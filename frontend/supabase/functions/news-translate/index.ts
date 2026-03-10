import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TranslationItem {
  id: string;
  title: string;
  desc: string;
}

const gatewayUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";

const parseStructuredTranslations = (content: unknown, max: number): TranslationItem[] => {
  const contentText = typeof content === "string" ? content : JSON.stringify(content ?? "");

  const parseCandidate = (candidate: string): TranslationItem[] => {
    const parsed = JSON.parse(candidate);
    return (parsed?.translations ?? [])
      .filter((item: TranslationItem) => item?.id && item?.title && item?.desc)
      .slice(0, max);
  };

  try {
    return parseCandidate(contentText);
  } catch {
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return [];
    try {
      return parseCandidate(jsonMatch[0]);
    } catch {
      return [];
    }
  }
};

const parseSingleTranslation = (content: unknown): { title: string; desc: string } | null => {
  const contentText = typeof content === "string" ? content : JSON.stringify(content ?? "");

  const parseCandidate = (candidate: string): { title: string; desc: string } | null => {
    const parsed = JSON.parse(candidate);
    if (typeof parsed?.title === "string" && typeof parsed?.desc === "string") {
      return { title: parsed.title, desc: parsed.desc };
    }
    return null;
  };

  try {
    return parseCandidate(contentText);
  } catch {
    const jsonMatch = contentText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      return parseCandidate(jsonMatch[0]);
    } catch {
      return null;
    }
  }
};

const callGateway = async (body: Record<string, unknown>) => {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await response.text();
    const status = response.status;
    if (status === 402 || status === 429) {
      throw new Error(`AI gateway error ${status}: ${details}`);
    }
    throw new Error(`Translation failed: ${details}`);
  }

  return response.json();
};

const fallbackTranslateOne = async (item: TranslationItem, targetLanguage: string): Promise<TranslationItem> => {
  const response = await callGateway({
    model: "google/gemini-3-flash-preview",
    messages: [
      {
        role: "system",
        content: `Translate the given TITLE and DESC into ${targetLanguage}. Return STRICT JSON only in this format: {"title":"...","desc":"..."}`,
      },
      { role: "user", content: JSON.stringify({ title: item.title, desc: item.desc }) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 800,
  });

  const content = response?.choices?.[0]?.message?.content;
  const parsed = parseSingleTranslation(content);

  if (parsed) {
    return {
      id: item.id,
      title: parsed.title,
      desc: parsed.desc,
    };
  }

  return item;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let payload: { targetLanguage?: string; items?: Partial<TranslationItem>[] } = {};

    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { targetLanguage, items } = payload;

    if (!targetLanguage || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: "targetLanguage and items are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedItems: TranslationItem[] = items
      .filter((item: Partial<TranslationItem>) => item?.id && item?.title && item?.desc)
      .slice(0, 30)
      .map((item: Partial<TranslationItem>) => ({
        id: String(item.id),
        title: String(item.title),
        desc: String(item.desc),
      }));

    if (normalizedItems.length === 0) {
      return new Response(JSON.stringify({ translations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const batchPrompt = `Translate the provided news items into ${targetLanguage}.\nReturn STRICT JSON only in this exact format:\n{"translations":[{"id":"...","title":"...","desc":"..."}]}\nDo not change IDs.`;

    const batchResponse = await callGateway({
      model: "google/gemini-3-flash-preview",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: batchPrompt },
        { role: "user", content: JSON.stringify({ items: normalizedItems }) },
      ],
      temperature: 0.1,
      max_tokens: 3500,
    });

    const batchContent = batchResponse?.choices?.[0]?.message?.content;
    let translations = parseStructuredTranslations(batchContent, normalizedItems.length);

    if (translations.length < normalizedItems.length || targetLanguage.toLowerCase() !== "english") {
      const translatedById = new Map(translations.map((t) => [t.id, t]));
      for (const item of normalizedItems) {
        const existing = translatedById.get(item.id);
        const looksUntranslated = !existing || (
          existing.title.trim() === item.title.trim() &&
          existing.desc.trim() === item.desc.trim()
        );

        if (looksUntranslated) {
          const translated = await fallbackTranslateOne(item, targetLanguage);
          translatedById.set(item.id, translated);
        }
      }
      translations = normalizedItems.map((item) => translatedById.get(item.id) ?? item);
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("AI gateway error 402") ? 402 : message.includes("AI gateway error 429") ? 429 : 500;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

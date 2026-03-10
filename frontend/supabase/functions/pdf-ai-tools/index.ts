import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, action } = await req.json();

    if (!text || !action) {
      return new Response(JSON.stringify({ error: "Missing text or action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const truncatedText = text.substring(0, 15000);

    let systemPrompt = "";
    switch (action) {
      case "summarize":
        systemPrompt = "You are a professional document summarizer. Provide a clear, concise summary of the given text. Include key points, main arguments, and important details. Format with bullet points and sections.";
        break;
      case "translate":
        systemPrompt = "You are a professional translator. Translate the given text to Hindi while maintaining the original meaning and structure. If the text is already in Hindi, translate it to English.";
        break;
      case "chat":
        systemPrompt = "You are a helpful assistant that answers questions about the provided document. Analyze the text carefully and provide accurate, detailed answers based only on the content provided.";
        break;
      default:
        systemPrompt = "Analyze the following text and provide useful insights.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: truncatedText },
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("AI Gateway error:", err);
      return new Response(JSON.stringify({ error: "AI processing failed", details: err }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response generated.";

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

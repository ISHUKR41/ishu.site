/**
 * useDynamicFavicon.ts - Dynamic Browser Tab Icon & Title
 * 
 * Changes the browser tab favicon and page title based on current page.
 * Brand: ISHU — Indian StudentHub University
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const faviconMap: Record<string, { emoji: string; bg: string }> = {
  "/": { emoji: "🎓", bg: "#3b82f6" },
  "/results": { emoji: "📊", bg: "#10b981" },
  "/tools": { emoji: "🛠️", bg: "#8b5cf6" },
  "/news": { emoji: "📰", bg: "#f59e0b" },
  "/test": { emoji: "📝", bg: "#06b6d4" },
  "/blog": { emoji: "✍️", bg: "#ec4899" },
  "/about": { emoji: "💡", bg: "#6366f1" },
  "/contact": { emoji: "📬", bg: "#14b8a6" },
  "/admin": { emoji: "⚙️", bg: "#ef4444" },
  "/auth/signin": { emoji: "🔐", bg: "#f97316" },
  "/auth/signup": { emoji: "🚀", bg: "#8b5cf6" },
  "/privacy": { emoji: "🛡️", bg: "#64748b" },
  "/terms": { emoji: "📜", bg: "#64748b" },
};

const titleMap: Record<string, string> = {
  "/": "ISHU — Indian StudentHub University | Government Exam Results & PDF Tools",
  "/results": "Results & Vacancies — ISHU",
  "/tools": "100+ Free PDF Tools — ISHU",
  "/news": "Latest News & Updates — ISHU",
  "/test": "Practice Tests — ISHU",
  "/blog": "Blog & Articles — ISHU",
  "/about": "About Us — ISHU",
  "/contact": "Contact Us — ISHU",
  "/admin": "Admin Panel — ISHU",
  "/auth/signin": "Sign In — ISHU",
  "/auth/signup": "Sign Up — ISHU",
  "/privacy": "Privacy Policy — ISHU",
  "/terms": "Terms of Service — ISHU",
};

function generateFaviconSvg(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="${bg}"/>
    <text x="32" y="44" font-size="36" text-anchor="middle" font-family="Arial,sans-serif">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function useDynamicFavicon() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const matchedKey =
      Object.keys(faviconMap).find((k) => k === path) ||
      Object.keys(faviconMap).find((k) => k !== "/" && path.startsWith(k)) ||
      "/";

    const { emoji, bg } = faviconMap[matchedKey] || faviconMap["/"];

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = generateFaviconSvg(emoji, bg);

    const title = titleMap[matchedKey] || titleMap["/"];
    document.title = title;
  }, [location.pathname]);
}

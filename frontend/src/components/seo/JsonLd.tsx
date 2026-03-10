/**
 * JsonLd.tsx - SEO Structured Data Components
 * 
 * These components add invisible JSON-LD structured data to pages.
 * Search engines (Google, Bing) use this data to better understand
 * the website content and show rich results in search.
 * 
 * Brand: ISHU — Indian StudentHub University
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export const WebsiteSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ISHU — Indian StudentHub University",
    "alternateName": ["ISHU", "Indian StudentHub University"],
    "url": "https://ishu.lovable.app",
    "description": "India's #1 platform for government exam results, vacancies, 100+ free PDF tools, and 1000+ daily news articles.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ishu.lovable.app/tools?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }} />
);

export const OrganizationSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ISHU — Indian StudentHub University",
    "alternateName": "ISHU",
    "url": "https://ishu.lovable.app",
    "logo": "https://ishu.lovable.app/favicon.ico",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+918986985813",
      "contactType": "customer support",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": []
  }} />
);

export const BreadcrumbSchema = ({ items }: { items: { name: string; url: string }[] }) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  }} />
);

export const ArticleSchema = ({ title, description, url, datePublished, author }: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "author": { "@type": "Person", "name": author },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "ISHU — Indian StudentHub University"
    }
  }} />
);

# 📰 NEWS PAGE — COMPLETE MASTERPLAN & IMPLEMENTATION GUIDE
### World-Class | Fully Working | Modern + Animated + 3D | Multi-language | Real-time

---

> **Page Route:** `/news`  
> **Individual Article:** `/news/[slug]`  
> **Category Page:** `/news/category/[categorySlug]`  
> **Search Results:** `/news/search?q=...`  
> **Tag Page:** `/news/tag/[tagSlug]`  
> **Stack:** Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + GSAP + MongoDB + Redis + Node.js  
> **Inspired By:** BBC News · NDTV · Times of India · The Verge · TechCrunch · Bloomberg · CNN · Dora.ai (animations)

---

## 📋 TABLE OF CONTENTS

1. [Page Vision & Goals](#1-page-vision--goals)
2. [Complete Libraries & Tools List](#2-complete-libraries--tools-list)
3. [Folder & File Structure](#3-folder--file-structure)
4. [Database Schema (Full)](#4-database-schema-full)
5. [Backend Architecture (Full)](#5-backend-architecture-full)
6. [Frontend Architecture (Full)](#6-frontend-architecture-full)
7. [All 30 News Categories](#7-all-30-news-categories)
8. [All 22 Indian Languages](#8-all-22-indian-languages)
9. [News Data Sources & Scraping](#9-news-data-sources--scraping)
10. [Real-time News System](#10-real-time-news-system)
11. [Translation System](#11-translation-system)
12. [Search System](#12-search-system)
13. [Individual News Article Page](#13-individual-news-article-page)
14. [Admin News Management](#14-admin-news-management)
15. [API Endpoints (Complete)](#15-api-endpoints-complete)
16. [Animation & 3D Details](#16-animation--3d-details)
17. [SEO Strategy for News](#17-seo-strategy-for-news)
18. [Performance Optimization](#18-performance-optimization)
19. [Full Code Implementation](#19-full-code-implementation)

---

## 1. PAGE VISION & GOALS

### 🎯 What This Page Does
India ka sabse modern, fast, aur beautiful news page banana hai. User ko world aur India ki latest news ek jagah milegi — apni language mein, apni category mein, real-time updates ke saath. Breaking news ticker se lekar AI-powered translations tak — sab kuch ek page pe.

### 🎯 Core Features
```
✅ Daily 1000+ news articles auto-fetched from 50+ sources
✅ 30 category filters
✅ 22 Indian language translations (Google Translate API)
✅ Real-time breaking news (Server-Sent Events)
✅ Date-wise arrangement (Today → Past)
✅ Individual news article page (new tab)
✅ Related news recommendations
✅ Images + Videos support
✅ Search with instant results
✅ Infinite scroll (performance optimized)
✅ Social sharing (WhatsApp, Twitter, Copy Link)
✅ Dark/Light mode
✅ PWA support (offline reading)
✅ SEO optimized (Google News eligible)
```

### 🎯 Design References
```
BBC News          → Clean layout, category tabs, breaking banner
NDTV.com          → India news layout, ticker design
The Verge         → Modern card design, typography
TechCrunch        → Category filtering, grid layout
Bloomberg         → Professional data presentation
Flipboard         → Magazine-style card layout
Google News       → Smart categorization
Apple News        → Beautiful reader mode
Dora.ai           → Animated transitions
Vercel.com        → Dark theme, gradient effects
```

---

## 2. COMPLETE LIBRARIES & TOOLS LIST

### 🖥️ FRONTEND LIBRARIES

#### Core Framework
```
next: ^14.2.0                         # React framework (SSR + ISR for news)
react: ^18.3.0                        # UI library
typescript: ^5.4.0                    # Type safety
```

#### Styling
```
tailwindcss: ^3.4.0                   # Utility CSS
tailwindcss-animate: ^1.0.7           # CSS animations
@tailwindcss/typography: ^0.5.13      # Prose styles for article content
tailwind-scrollbar: ^3.1.0            # Custom scrollbar
tailwind-scrollbar-hide: ^1.1.7       # Hide scrollbar utility
```

#### Animation Libraries (ALL USED)
```
framer-motion: ^11.2.0                # Page transitions, card animations
gsap: ^3.12.5                         # Timeline, ScrollTrigger, TextPlugin
@gsap/react: ^2.1.0                   # GSAP React hooks
react-spring: ^9.7.3                  # Physics-based animations
lottie-react: ^2.4.0                  # JSON micro-animations (loading, icons)
@lottiefiles/react-lottie-player      # Lottie player component
react-intersection-observer: ^9.10.2  # Scroll detection for lazy animations
animejs: ^3.2.2                       # JS animations for ticker/ticker
auto-animate: ^0.8.2                  # Automatic list animations
motion: ^10.16.4                      # Lightweight animation library
```

#### 3D Libraries
```
three: ^0.165.0                       # Core 3D engine
@react-three/fiber: ^8.16.8           # React renderer for Three.js
@react-three/drei: ^9.106.0           # 3D helpers (Text3D, Float, Stars)
@react-three/postprocessing: ^2.16.2  # Bloom, glow effects
```

#### UI Components
```
@radix-ui/react-tabs: ^1.1.0          # Category filter tabs
@radix-ui/react-dropdown-menu: ^2.1.1 # Language selector dropdown
@radix-ui/react-dialog: ^1.1.0        # Full-screen article modal
@radix-ui/react-scroll-area: ^1.0.5   # Custom scrollable areas
@radix-ui/react-tooltip: ^1.1.0       # Tooltips
@radix-ui/react-select: ^2.1.0        # Category select on mobile
@radix-ui/react-popover: ^1.1.0       # Search popover
shadcn/ui (all components)            # Primary component library
```

#### Data Fetching & State
```
@tanstack/react-query: ^5.40.0        # Server state, caching, background refetch
axios: ^1.7.2                         # HTTP client
swr: ^2.2.5                           # Stale-while-revalidate (news feed)
zustand: ^4.5.2                       # Global state (language, filters)
jotai: ^2.8.3                         # Atomic state (reading preferences)
immer: ^10.1.1                        # Immutable state updates
```

#### Real-time
```
eventsource: ^2.0.2                   # SSE client for breaking news
@microsoft/signalr: ^8.0.0            # Alternative real-time (WebSocket)
socket.io-client: ^4.7.5              # WebSocket client
```

#### Content Display
```
react-player: ^2.16.0                 # Video player for news videos
@vidstack/react: ^1.10.5              # Modern video player with controls
next-image-export-optimizer: ^1.8.0   # Image optimization
blurhash: ^2.0.5                      # Blur placeholder for images
react-photo-view: ^1.2.6              # Lightbox for news images
```

#### Text & Typography
```
@tiptap/react: ^2.4.0                 # Rich text display for articles
react-markdown: ^9.0.1                # Markdown article rendering
remark-gfm: ^4.0.0                    # GitHub flavored markdown
rehype-highlight: ^7.0.0              # Code syntax highlighting
react-syntax-highlighter: ^15.5.0     # Code blocks in articles
```

#### Search
```
fuse.js: ^7.0.0                       # Client-side fuzzy search
minisearch: ^7.1.0                    # Full-text client search
```

#### Virtualization (Performance)
```
@tanstack/react-virtual: ^3.5.1       # Virtualized news list (1000+ items)
react-window: ^1.8.10                 # Alternative virtualization
react-window-infinite-loader: ^1.0.9  # Infinite scroll + virtualization
```

#### Infinite Scroll
```
react-infinite-scroll-component: ^6.1.0  # Infinite scroll
react-intersection-observer: ^9.10.2     # Trigger fetch on scroll
```

#### Date & Time
```
dayjs: ^1.11.11                       # Date formatting (lightweight)
date-fns: ^3.6.0                      # Date utilities
timeago.js: ^4.0.2                    # "2 hours ago" formatting
```

#### Social Sharing
```
react-share: ^5.1.0                   # Social share buttons
```

#### Notifications
```
sonner: ^1.5.0                        # Toast for breaking news alerts
react-hot-toast: ^2.4.1               # Alternative toast
```

#### Icons
```
lucide-react: ^0.395.0                # Primary icons
react-icons: ^5.2.1                   # 80+ icon sets
@tabler/icons-react: ^3.5.0           # 4000+ icons
phosphor-react: ^1.4.1                # Flexible icons
```

#### Misc
```
clsx: ^2.1.1                          # Class merging
class-variance-authority: ^0.7.0      # Component variants
tailwind-merge: ^2.3.0                # Tailwind class merging
lodash: ^4.17.21                      # Utilities
uuid: ^10.0.0                         # Unique IDs
```

---

### ⚙️ BACKEND LIBRARIES

#### Core
```
express: ^4.19.2                      # Web framework
typescript: ^5.4.0                    # Type safety
ts-node: ^10.9.2                      # TS execution
tsx: ^4.11.0                          # Fast TS execution
nodemon: ^3.1.0                       # Dev auto-restart
```

#### Database
```
mongoose: ^8.4.1                      # MongoDB ODM
ioredis: ^5.4.1                       # Redis client
```

#### Web Scraping (News Fetching)
```
puppeteer: ^22.11.2                   # Headless Chrome for JS-heavy sites
puppeteer-cluster: ^0.23.0            # Parallel scraping cluster
cheerio: ^1.0.0-rc.12                 # HTML parsing (jQuery-style)
playwright: ^1.44.1                   # Alternative to Puppeteer
node-fetch: ^3.3.2                    # HTTP requests
axios: ^1.7.2                         # HTTP with interceptors
rss-parser: ^3.13.0                   # RSS feed parser
got: ^14.4.0                          # Advanced HTTP client
```

#### Translation
```
@google-cloud/translate: ^8.3.0       # Google Translate API v3
deepl: ^1.12.0                        # DeepL high-quality translation
libre-translate: custom wrapper       # Open-source translation fallback
```

#### Text Processing
```
natural: ^8.0.1                       # NLP for keyword extraction
compromise: ^14.13.0                  # Lightweight NLP
keyword-extractor: ^0.0.25            # Auto keyword extraction
franc: ^6.2.0                         # Language detection
```

#### Background Jobs
```
bullmq: ^5.8.3                        # Job queues (news sync, translations)
bull-board: ^5.20.0                   # Bull queue dashboard UI
node-cron: ^3.0.3                     # Scheduled tasks
agenda: ^5.0.0                        # MongoDB job scheduler
```

#### File Processing
```
sharp: ^0.33.4                        # Image optimization
jimp: ^1.6.0                          # Image manipulation
```

#### Real-time
```
socket.io: ^4.7.5                     # WebSocket server
@fastify/websocket: (optional)        # Alternative WebSocket
```

#### Middleware & Security
```
helmet: ^7.1.0                        # Security headers
cors: ^2.8.5                          # CORS
express-rate-limit: ^7.3.1            # Rate limiting
compression: ^1.7.4                   # Gzip
morgan: ^1.10.0                       # HTTP logging
winston: ^3.13.0                      # Application logging
express-validator: ^7.1.0             # Input validation
```

#### Caching
```
ioredis: ^5.4.1                       # Redis caching
node-cache: ^5.1.2                    # In-memory fallback cache
```

#### Search
```
mongoose (text index)                 # MongoDB full-text search
meilisearch: ^0.41.0                  # Meilisearch integration (optional)
```

---

### 🗄️ DATABASES

```
MongoDB Atlas        # Primary — news articles, categories, tags
Redis (Upstash)      # Cache — trending news, category counts, translations cache
PostgreSQL           # Analytics — view counts, click tracking, user preferences
Cloudinary           # Image storage — news thumbnails optimized
```

---

## 3. FOLDER & FILE STRUCTURE

```
📁 apps/web/
├── 📁 app/
│   └── 📁 (public)/
│       └── 📁 news/
│           ├── page.tsx                     # Main news feed page
│           ├── loading.tsx                  # Skeleton loading state
│           ├── error.tsx                    # Error boundary
│           ├── layout.tsx                   # News layout wrapper
│           ├── 📁 [slug]/                   # Individual news article
│           │   ├── page.tsx                 # Article page (SSR)
│           │   ├── loading.tsx
│           │   └── opengraph-image.tsx      # Dynamic OG image
│           ├── 📁 category/
│           │   └── 📁 [categorySlug]/
│           │       ├── page.tsx             # Category-filtered news
│           │       └── loading.tsx
│           ├── 📁 tag/
│           │   └── 📁 [tagSlug]/
│           │       └── page.tsx             # Tag-filtered news
│           └── 📁 search/
│               └── page.tsx                 # Search results page
│
├── 📁 app/api/
│   └── 📁 news/
│       ├── route.ts                         # GET /api/news (list)
│       ├── 📁 [slug]/
│       │   └── route.ts                     # GET /api/news/[slug]
│       ├── 📁 breaking/
│       │   └── route.ts                     # GET /api/news/breaking
│       ├── 📁 featured/
│       │   └── route.ts                     # GET /api/news/featured
│       ├── 📁 trending/
│       │   └── route.ts                     # GET /api/news/trending
│       ├── 📁 categories/
│       │   └── route.ts                     # GET /api/news/categories
│       ├── 📁 search/
│       │   └── route.ts                     # GET /api/news/search
│       ├── 📁 related/
│       │   └── 📁 [slug]/
│       │       └── route.ts                 # GET /api/news/related/[slug]
│       ├── 📁 translate/
│       │   └── route.ts                     # POST /api/news/translate
│       └── 📁 stream/
│           └── route.ts                     # GET /api/news/stream (SSE)
│
├── 📁 components/
│   └── 📁 news/
│       ├── NewsPage.tsx                     # Main page container
│       ├── NewsFeed.tsx                     # Main feed with virtualization
│       ├── NewsCard.tsx                     # Individual news card
│       ├── NewsCardSkeleton.tsx             # Loading skeleton card
│       ├── BreakingNewsBanner.tsx           # Animated top banner
│       ├── BreakingNewsTicker.tsx           # Scrolling ticker strip
│       ├── CategoryFilterBar.tsx            # 30-category filter tabs
│       ├── LanguageSelector.tsx             # 22-language dropdown
│       ├── NewsFilters.tsx                  # Advanced filter panel
│       ├── SearchBar.tsx                    # Search with suggestions
│       ├── TrendingSidebar.tsx              # Trending news sidebar
│       ├── DateSection.tsx                  # Date group header
│       ├── NewsGrid.tsx                     # Grid layout variant
│       ├── NewsList.tsx                     # List layout variant
│       ├── LayoutToggle.tsx                 # Grid/List toggle
│       ├── NewsVideo.tsx                    # Video news component
│       ├── NewsImage.tsx                    # Optimized news image
│       ├── NewsTag.tsx                      # Tag pill component
│       ├── CategoryBadge.tsx                # Category badge
│       ├── SourceBadge.tsx                  # News source badge
│       ├── TimeAgo.tsx                      # "2 hours ago" display
│       ├── ShareButtons.tsx                 # Social share buttons
│       ├── ReadMoreButton.tsx               # Animated CTA button
│       ├── NewsStats.tsx                    # View/read count
│       ├── FilterSidebar.tsx                # Left sidebar filters
│       ├── NewsHero.tsx                     # Hero featured article
│       ├── MostReadSection.tsx              # Most-read panel
│       ├── NewsletterSection.tsx            # Email subscribe box
│       ├── EmptyState.tsx                   # No results state
│       ├── ErrorState.tsx                   # Error display
│       └── 📁 article/                      # Article page components
│           ├── ArticlePage.tsx              # Full article layout
│           ├── ArticleHeader.tsx            # Title, author, date
│           ├── ArticleBody.tsx              # Content renderer
│           ├── ArticleSidebar.tsx           # Related + trending sidebar
│           ├── ArticleFooter.tsx            # Tags, share, related
│           ├── RelatedNews.tsx              # Related articles grid
│           ├── ReadingProgress.tsx          # Scroll progress bar
│           ├── TableOfContents.tsx          # Article TOC
│           ├── TranslationToggle.tsx        # Language switcher for article
│           └── ArticleActions.tsx           # Like, save, share
│
├── 📁 lib/
│   └── 📁 news/
│       ├── newsApi.ts                       # API call functions
│       ├── newsHelpers.ts                   # Utility functions
│       ├── newsCategories.ts                # 30 category definitions
│       ├── newsLanguages.ts                 # 22 language definitions
│       ├── newsSources.ts                   # 50+ source definitions
│       ├── newsCache.ts                     # Client-side cache logic
│       └── newsConstants.ts                 # Constants
│
├── 📁 hooks/
│   ├── useNewsFeed.ts                       # Main feed hook
│   ├── useBreakingNews.ts                   # SSE breaking news hook
│   ├── useNewsSearch.ts                     # Search hook
│   ├── useNewsTranslation.ts               # Translation hook
│   ├── useNewsFilters.ts                    # Filter state hook
│   ├── useReadingProgress.ts               # Scroll progress hook
│   └── useSavedArticles.ts                  # Saved articles hook
│
├── 📁 store/
│   └── newsStore.ts                         # Zustand news global state
│
└── 📁 types/
    └── news.types.ts                        # All TypeScript interfaces


📁 apps/backend/src/
├── 📁 routes/
│   └── news.routes.ts                       # All news API routes
│
├── 📁 controllers/
│   └── news.controller.ts                   # Request handlers
│
├── 📁 models/
│   ├── News.model.ts                        # MongoDB news schema
│   ├── NewsCategory.model.ts                # Category schema
│   ├── NewsSource.model.ts                  # Source schema
│   └── NewsView.model.ts                    # View tracking schema
│
├── 📁 services/
│   ├── news.scraper.ts                      # Web scraping service
│   ├── rss.service.ts                       # RSS feed service
│   ├── translation.service.ts              # Translation service
│   ├── news.cache.service.ts               # Redis cache service
│   ├── breaking.service.ts                  # Breaking news SSE service
│   └── news.search.service.ts              # Search service
│
├── 📁 jobs/
│   ├── newsSync.job.ts                      # Hourly news sync job
│   ├── newsTranslate.job.ts                 # Auto-translation job
│   ├── newsCleanup.job.ts                   # Old news cleanup job
│   └── trendingUpdate.job.ts               # Update trending scores
│
└── 📁 scrapers/
    ├── timesofindia.scraper.ts
    ├── ndtv.scraper.ts
    ├── hindustantimes.scraper.ts
    ├── thehindu.scraper.ts
    ├── indianexpress.scraper.ts
    ├── aajtak.scraper.ts
    ├── abpnews.scraper.ts
    ├── zeenews.scraper.ts
    ├── jagran.scraper.ts
    ├── bhaskar.scraper.ts
    └── rss.scraper.ts                       # Generic RSS scraper
```

---

## 4. DATABASE SCHEMA (FULL)

### MongoDB — News Collection

```typescript
// news.types.ts — All TypeScript Interfaces

export interface INewsArticle {
  _id: string;
  
  // Core Content
  title: string;                        // Original title
  slug: string;                         // URL slug (auto-generated from title)
  summary: string;                      // 2-3 line summary for card display
  content: string;                      // Full HTML/markdown article body
  
  // Media
  thumbnail: {
    url: string;                        // Cloudinary URL
    alt: string;
    width: number;
    height: number;
    blurDataUrl: string;               // Base64 blur placeholder
  };
  images: string[];                     // All images in article
  videoUrl?: string;                    // YouTube/video URL if video news
  videoThumbnail?: string;             // Video thumbnail
  
  // Classification
  category: NewsCategory;              // Primary category (1 of 30)
  subcategory?: string;               // Optional subcategory
  tags: string[];                      // Array of tags
  source: {
    name: string;                      // "Times of India"
    url: string;                       // Source article URL
    logo: string;                      // Source logo
    isVerified: boolean;               // Verified news source
  };
  
  // Status & Flags
  isBreaking: boolean;                 // Breaking news flag
  isFeatured: boolean;                 // Featured on main hero
  isTrending: boolean;                 // Trending section
  isEditorsPick: boolean;              // Editor's pick badge
  hasVideo: boolean;                   // Has video content
  
  // Dates
  publishedAt: Date;                   // Original publish time
  scrapedAt: Date;                     // When we fetched it
  updatedAt: Date;
  
  // Analytics
  viewCount: number;
  readCount: number;                   // Full reads
  shareCount: number;
  likeCount: number;
  
  // Translations
  translations: {
    [languageCode: string]: {          // "hi", "bn", "te", etc.
      title: string;
      summary: string;
      content: string;
      translatedAt: Date;
      translationEngine: 'google' | 'deepl' | 'libre';
    }
  };
  
  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    canonicalUrl: string;
  };
  
  // Relations
  relatedArticleIds: string[];
  
  // Trending Score (for sorting)
  trendingScore: number;               // Calculated: views + shares + time decay
  
  createdAt: Date;
}

// 30 News Categories
export type NewsCategory = 
  | 'education'
  | 'government-jobs'
  | 'exam-results'
  | 'technology'
  | 'politics'
  | 'sports'
  | 'entertainment'
  | 'business'
  | 'finance'
  | 'health'
  | 'science'
  | 'environment'
  | 'agriculture'
  | 'defence'
  | 'railways'
  | 'banking'
  | 'state-news'
  | 'international'
  | 'legal'
  | 'weather'
  | 'infrastructure'
  | 'social'
  | 'youth'
  | 'startup'
  | 'ai-technology'
  | 'cybersecurity'
  | 'space'
  | 'culture'
  | 'breaking'
  | 'general';

// 22 Indian Languages  
export type IndianLanguage = 
  | 'en'   // English
  | 'hi'   // Hindi
  | 'bn'   // Bengali
  | 'te'   // Telugu
  | 'mr'   // Marathi
  | 'ta'   // Tamil
  | 'gu'   // Gujarati
  | 'ur'   // Urdu
  | 'kn'   // Kannada
  | 'or'   // Odia
  | 'ml'   // Malayalam
  | 'pa'   // Punjabi
  | 'as'   // Assamese
  | 'mai'  // Maithili
  | 'sa'   // Sanskrit
  | 'ne'   // Nepali
  | 'kok'  // Konkani
  | 'doi'  // Dogri
  | 'mni'  // Manipuri
  | 'brx'  // Bodo
  | 'sd'   // Sindhi
  | 'ks';  // Kashmiri

// API Response Types
export interface NewsListResponse {
  articles: INewsArticle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface NewsFilters {
  category?: NewsCategory;
  language?: IndianLanguage;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  search?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'publishedAt' | 'viewCount' | 'trendingScore';
  sortOrder?: 'asc' | 'desc';
}
```

### MongoDB — News Schema (Mongoose)

```typescript
// News.model.ts
import mongoose, { Schema } from 'mongoose';

const NewsSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 500 },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true, maxlength: 1000 },
  content: { type: String, required: true },
  
  thumbnail: {
    url: String,
    alt: String,
    width: Number,
    height: Number,
    blurDataUrl: String,
  },
  images: [String],
  videoUrl: String,
  
  category: { 
    type: String, 
    required: true, 
    index: true,
    enum: [/* 30 categories */]
  },
  tags: [{ type: String, index: true }],
  
  source: {
    name: { type: String, required: true },
    url: String,
    logo: String,
    isVerified: { type: Boolean, default: false },
  },
  
  isBreaking: { type: Boolean, default: false, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  isTrending: { type: Boolean, default: false, index: true },
  hasVideo: { type: Boolean, default: false },
  
  publishedAt: { type: Date, required: true, index: true },
  scrapedAt: { type: Date, default: Date.now },
  
  viewCount: { type: Number, default: 0 },
  readCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  
  translations: { type: Map, of: Object, default: {} },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String,
  },
  
  relatedArticleIds: [{ type: Schema.Types.ObjectId, ref: 'News' }],
  trendingScore: { type: Number, default: 0, index: true },
  
}, { timestamps: true });

// Text search index for full-text search
NewsSchema.index({ 
  title: 'text', 
  summary: 'text', 
  content: 'text',
  tags: 'text'
}, { 
  weights: { title: 10, summary: 5, tags: 3, content: 1 }
});

// Compound indexes for common queries
NewsSchema.index({ category: 1, publishedAt: -1 });
NewsSchema.index({ isBreaking: 1, publishedAt: -1 });
NewsSchema.index({ trendingScore: -1, publishedAt: -1 });
NewsSchema.index({ publishedAt: -1 });

export const NewsModel = mongoose.model('News', NewsSchema);
```

---

## 5. BACKEND ARCHITECTURE (FULL)

### news.scraper.ts — Main Scraping Service
```typescript
// apps/backend/src/services/news.scraper.ts

import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { NewsModel } from '../models/News.model';
import { generateSlug } from '../utils/slug';
import { uploadToCloudinary } from './cloudinary.service';
import { translateService } from './translation.service';

// All 50+ RSS Feed Sources
const RSS_FEEDS = [
  // English Sources
  { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms', category: 'general', lang: 'en' },
  { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories', category: 'general', lang: 'en' },
  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', category: 'general', lang: 'en' },
  { name: 'The Hindu', url: 'https://www.thehindu.com/news/feeder/default.rss', category: 'general', lang: 'en' },
  { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'general', lang: 'en' },
  { name: 'India Today', url: 'https://www.indiatoday.in/rss/1206578', category: 'general', lang: 'en' },
  { name: 'Business Standard', url: 'https://www.business-standard.com/rss/home_page_top_stories.rss', category: 'business', lang: 'en' },
  { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedsdefault.cms', category: 'finance', lang: 'en' },
  { name: 'LiveMint', url: 'https://www.livemint.com/rss/news', category: 'finance', lang: 'en' },
  { name: 'Tech Crunch India', url: 'https://techcrunch.com/feed/', category: 'technology', lang: 'en' },
  { name: 'Gadgets 360', url: 'https://feeds.feedburner.com/NDTV-Gadgets360-Latest', category: 'technology', lang: 'en' },
  // Government/Jobs Sources
  { name: 'Sarkari Result', url: 'custom_scraper', category: 'government-jobs', lang: 'en' },
  { name: 'Employment News', url: 'https://www.employmentnews.gov.in/NewMain.asp', category: 'government-jobs', lang: 'en' },
  // Education Sources
  { name: 'NTA Official', url: 'custom_scraper', category: 'education', lang: 'en' },
  { name: 'Education Times', url: 'custom_scraper', category: 'education', lang: 'en' },
  // Sports
  { name: 'ESPN India', url: 'https://www.espn.in/espn/rss/news', category: 'sports', lang: 'en' },
  { name: 'CricBuzz', url: 'custom_scraper', category: 'sports', lang: 'en' },
  // Health
  { name: 'Health Ministry', url: 'custom_scraper', category: 'health', lang: 'en' },
  // Hindi Sources
  { name: 'Amar Ujala', url: 'https://www.amarujala.com/rss/breaking-news.xml', category: 'general', lang: 'hi' },
  { name: 'Dainik Bhaskar', url: 'https://www.bhaskar.com/rss-v1--category-1061.xml', category: 'general', lang: 'hi' },
  { name: 'Dainik Jagran', url: 'https://www.jagran.com/rss/national.xml', category: 'general', lang: 'hi' },
  { name: 'NavBharat Times', url: 'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms', category: 'general', lang: 'hi' },
  { name: 'Aaj Tak', url: 'custom_scraper', category: 'general', lang: 'hi' },
  { name: 'Zee News Hindi', url: 'https://zeenews.india.com/hindi/rss/india.xml', category: 'general', lang: 'hi' },
  // Regional Sources
  { name: 'Mathrubhumi (Malayalam)', url: 'custom_scraper', category: 'general', lang: 'ml' },
  { name: 'Eenadu (Telugu)', url: 'custom_scraper', category: 'general', lang: 'te' },
  { name: 'Ananda Bazar (Bengali)', url: 'custom_scraper', category: 'general', lang: 'bn' },
  { name: 'Divya Bhaskar (Gujarati)', url: 'custom_scraper', category: 'general', lang: 'gu' },
  // Weather
  { name: 'IMD India', url: 'https://internal.imd.gov.in/press_release/public/press_release.php', category: 'weather', lang: 'en' },
  // Science & Space
  { name: 'ISRO', url: 'https://www.isro.gov.in/pressrelease.html', category: 'space', lang: 'en' },
];

class NewsScraperService {
  private parser = new Parser({
    customFields: {
      item: ['media:content', 'media:thumbnail', 'enclosure'],
    }
  });

  // Main scraping function — runs every 30 minutes via cron job
  async scrapeAllSources(): Promise<void> {
    console.log(`[NewsSync] Starting scrape at ${new Date().toISOString()}`);
    
    for (const feed of RSS_FEEDS) {
      try {
        if (feed.url === 'custom_scraper') {
          await this.scrapeCustomSource(feed);
        } else {
          await this.scrapeRSSFeed(feed);
        }
      } catch (error) {
        console.error(`[NewsSync] Failed for ${feed.name}:`, error);
      }
    }
    
    console.log(`[NewsSync] Completed at ${new Date().toISOString()}`);
  }

  // Scrape RSS feed
  async scrapeRSSFeed(feedConfig: any): Promise<void> {
    const feed = await this.parser.parseURL(feedConfig.url);
    
    for (const item of feed.items.slice(0, 50)) { // Max 50 per source
      const slug = generateSlug(item.title || '');
      
      // Skip if already exists
      const exists = await NewsModel.findOne({ slug });
      if (exists) continue;
      
      // Extract image
      let thumbnail = '';
      if (item['media:content']?.['$']?.url) {
        thumbnail = item['media:content']['$'].url;
      } else if (item.enclosure?.url) {
        thumbnail = item.enclosure.url;
      }
      
      // Upload thumbnail to Cloudinary
      let cloudinaryImage = null;
      if (thumbnail) {
        cloudinaryImage = await uploadToCloudinary(thumbnail);
      }
      
      const article = new NewsModel({
        title: item.title?.trim(),
        slug,
        summary: this.extractSummary(item.contentSnippet || item.content || ''),
        content: item.content || item.contentSnippet || '',
        thumbnail: cloudinaryImage ? {
          url: cloudinaryImage.secure_url,
          alt: item.title,
          width: cloudinaryImage.width,
          height: cloudinaryImage.height,
          blurDataUrl: cloudinaryImage.blurDataUrl,
        } : null,
        category: feedConfig.category,
        tags: this.extractTags(item.title + ' ' + item.contentSnippet),
        source: {
          name: feedConfig.name,
          url: item.link,
          isVerified: true,
        },
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        isBreaking: false,
        trendingScore: 0,
      });
      
      await article.save();
      
      // Queue translation job
      await translationQueue.add('translate-article', {
        articleId: article._id,
        targetLanguages: ['hi', 'bn', 'te', 'mr', 'ta', 'gu'],
      });
    }
  }

  extractSummary(text: string): string {
    // Remove HTML tags, get first 200 chars
    return text.replace(/<[^>]*>/g, '').slice(0, 300).trim() + '...';
  }

  extractTags(text: string): string[] {
    // Simple keyword extraction
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'for', 'in', 'to'];
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 10);
  }
}

export const newsScraperService = new NewsScraperService();
```

### newsSync.job.ts — Cron Job
```typescript
// apps/backend/src/jobs/newsSync.job.ts
import cron from 'node-cron';
import { newsScraperService } from '../services/news.scraper';
import { trendingUpdateService } from '../services/trending.service';
import { newsCleanupService } from '../services/cleanup.service';

// Sync news every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('[CRON] Running news sync...');
  await newsScraperService.scrapeAllSources();
});

// Update trending scores every hour
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Updating trending scores...');
  await trendingUpdateService.updateScores();
});

// Cleanup old news (older than 30 days) at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Running news cleanup...');
  await newsCleanupService.deleteOldArticles(30);
});
```

### translation.service.ts — Full Translation
```typescript
// apps/backend/src/services/translation.service.ts
import { Translate } from '@google-cloud/translate/build/src/v2';
import * as deepl from 'deepl-node';
import { NewsModel } from '../models/News.model';

const googleTranslate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

const TARGET_LANGUAGES = ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'ml', 'pa', 'or'];

class TranslationService {
  
  async translateArticle(articleId: string, targetLangs: string[]): Promise<void> {
    const article = await NewsModel.findById(articleId);
    if (!article) return;

    for (const lang of targetLangs) {
      try {
        // Skip if already translated
        if (article.translations.get(lang)) continue;

        const [translatedTitle] = await googleTranslate.translate(article.title, lang);
        const [translatedSummary] = await googleTranslate.translate(article.summary, lang);

        article.translations.set(lang, {
          title: translatedTitle,
          summary: translatedSummary,
          content: '', // Full content translated on-demand to save API calls
          translatedAt: new Date(),
          translationEngine: 'google',
        });

        await article.save();
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Translation failed for ${lang}:`, error);
      }
    }
  }

  // On-demand content translation (when user reads full article)
  async translateContent(articleId: string, targetLang: string): Promise<string> {
    const article = await NewsModel.findById(articleId);
    if (!article) throw new Error('Article not found');

    const existing = article.translations.get(targetLang);
    if (existing?.content) return existing.content;

    const [translated] = await googleTranslate.translate(article.content, targetLang);
    
    // Update in DB
    const trans = article.translations.get(targetLang) || {};
    article.translations.set(targetLang, { ...trans, content: translated });
    await article.save();
    
    return translated;
  }
}

export const translationService = new TranslationService();
```

### news.controller.ts — Full API Controller
```typescript
// apps/backend/src/controllers/news.controller.ts
import { Request, Response } from 'express';
import { NewsModel } from '../models/News.model';
import { redisClient } from '../config/redis';
import { translationService } from '../services/translation.service';

const CACHE_TTL = 300; // 5 minutes

export const newsController = {
  
  // GET /api/news — Main list with filters
  async getNews(req: Request, res: Response) {
    const {
      category, language = 'en', page = 1, pageSize = 20,
      dateFrom, dateTo, source, isBreaking, search,
      sortBy = 'publishedAt', sortOrder = 'desc'
    } = req.query;

    const cacheKey = `news:list:${JSON.stringify(req.query)}`;
    
    // Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const filter: any = {};
    if (category) filter.category = category;
    if (isBreaking) filter.isBreaking = true;
    if (dateFrom || dateTo) {
      filter.publishedAt = {};
      if (dateFrom) filter.publishedAt.$gte = new Date(dateFrom as string);
      if (dateTo) filter.publishedAt.$lte = new Date(dateTo as string);
    }
    if (source) filter['source.name'] = source;
    if (search) filter.$text = { $search: search as string };

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(pageSize);
    
    const [articles, total] = await Promise.all([
      NewsModel.find(filter).sort(sort).skip(skip).limit(Number(pageSize)).lean(),
      NewsModel.countDocuments(filter),
    ]);

    // Apply language translation if not English
    let processedArticles = articles;
    if (language !== 'en') {
      processedArticles = articles.map(article => {
        const translation = article.translations?.[language as string];
        if (translation) {
          return {
            ...article,
            title: translation.title || article.title,
            summary: translation.summary || article.summary,
          };
        }
        return article;
      });
    }

    const response = {
      articles: processedArticles,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
      hasMore: skip + Number(pageSize) < total,
    };

    // Cache for 5 minutes
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(response));
    
    res.json(response);
  },

  // GET /api/news/breaking — Breaking news (SSE stream)
  async streamBreakingNews(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send initial data
    const breaking = await NewsModel.find({ isBreaking: true })
      .sort({ publishedAt: -1 }).limit(5).lean();
    
    res.write(`data: ${JSON.stringify(breaking)}\n\n`);

    // Poll for new breaking news every 30 seconds
    const interval = setInterval(async () => {
      try {
        const newBreaking = await NewsModel.find({ 
          isBreaking: true,
          publishedAt: { $gte: new Date(Date.now() - 30000) }
        }).lean();
        
        if (newBreaking.length > 0) {
          res.write(`data: ${JSON.stringify(newBreaking)}\n\n`);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 30000);

    // Clean up on disconnect
    req.on('close', () => clearInterval(interval));
  },

  // GET /api/news/:slug — Single article
  async getArticle(req: Request, res: Response) {
    const { slug } = req.params;
    const { language = 'en' } = req.query;

    const cacheKey = `news:article:${slug}:${language}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      // Increment view count asynchronously
      NewsModel.updateOne({ slug }, { $inc: { viewCount: 1 } }).exec();
      return res.json(JSON.parse(cached));
    }

    const article = await NewsModel.findOne({ slug }).lean();
    if (!article) return res.status(404).json({ error: 'Article not found' });

    // Apply translation
    let processedArticle = { ...article };
    if (language !== 'en') {
      const translation = article.translations?.[language as string];
      if (translation) {
        processedArticle.title = translation.title || article.title;
        processedArticle.summary = translation.summary || article.summary;
        if (translation.content) {
          processedArticle.content = translation.content;
        }
      }
    }

    // Get related articles
    const related = await NewsModel.find({
      category: article.category,
      _id: { $ne: article._id },
    }).sort({ publishedAt: -1 }).limit(6).select('title slug thumbnail publishedAt category').lean();

    const response = { article: processedArticle, related };
    
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(response));
    NewsModel.updateOne({ slug }, { $inc: { viewCount: 1 } }).exec();
    
    res.json(response);
  },
};
```

---

## 6. FRONTEND ARCHITECTURE (FULL)

### newsStore.ts — Zustand Global State
```typescript
// store/newsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsCategory, IndianLanguage, NewsFilters } from '../types/news.types';

interface NewsStore {
  // UI State
  selectedLanguage: IndianLanguage;
  selectedCategory: NewsCategory | 'all';
  viewMode: 'grid' | 'list';
  
  // Filters
  filters: NewsFilters;
  
  // Reading
  savedArticles: string[];
  readArticles: string[];
  
  // Actions
  setLanguage: (lang: IndianLanguage) => void;
  setCategory: (cat: NewsCategory | 'all') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  updateFilters: (filters: Partial<NewsFilters>) => void;
  saveArticle: (slug: string) => void;
  markAsRead: (slug: string) => void;
  resetFilters: () => void;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      selectedLanguage: 'en',
      selectedCategory: 'all',
      viewMode: 'grid',
      filters: { page: 1, pageSize: 20, sortBy: 'publishedAt', sortOrder: 'desc' },
      savedArticles: [],
      readArticles: [],
      
      setLanguage: (lang) => set({ selectedLanguage: lang }),
      setCategory: (cat) => set({ selectedCategory: cat }),
      setViewMode: (mode) => set({ viewMode: mode }),
      updateFilters: (newFilters) => set(state => ({ 
        filters: { ...state.filters, ...newFilters, page: 1 } 
      })),
      saveArticle: (slug) => set(state => ({
        savedArticles: state.savedArticles.includes(slug)
          ? state.savedArticles.filter(s => s !== slug)
          : [...state.savedArticles, slug]
      })),
      markAsRead: (slug) => set(state => ({
        readArticles: [...new Set([...state.readArticles, slug])]
      })),
      resetFilters: () => set({ 
        filters: { page: 1, pageSize: 20, sortBy: 'publishedAt', sortOrder: 'desc' },
        selectedCategory: 'all'
      }),
    }),
    { name: 'news-store', partialize: (state) => ({
      selectedLanguage: state.selectedLanguage,
      viewMode: state.viewMode,
      savedArticles: state.savedArticles,
      readArticles: state.readArticles,
    })}
  )
);
```

### useNewsFeed.ts — Main Data Hook
```typescript
// hooks/useNewsFeed.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNewsStore } from '../store/newsStore';
import { newsApi } from '../lib/news/newsApi';

export function useNewsFeed() {
  const { selectedCategory, selectedLanguage, filters } = useNewsStore();
  
  return useInfiniteQuery({
    queryKey: ['news', selectedCategory, selectedLanguage, filters],
    queryFn: ({ pageParam = 1 }) => newsApi.getNews({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      language: selectedLanguage,
      page: pageParam,
      pageSize: 20,
      ...filters,
    }),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,  // 5 min
    refetchInterval: 1000 * 60 * 5,  // Auto-refetch every 5 min
    initialPageParam: 1,
  });
}
```

### useBreakingNews.ts — SSE Hook
```typescript
// hooks/useBreakingNews.ts
import { useState, useEffect, useRef } from 'react';
import { INewsArticle } from '../types/news.types';

export function useBreakingNews() {
  const [breakingNews, setBreakingNews] = useState<INewsArticle[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/news/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setIsConnected(true);
    
    eventSource.onmessage = (event) => {
      const newArticles: INewsArticle[] = JSON.parse(event.data);
      if (newArticles.length > 0) {
        setBreakingNews(prev => {
          const combined = [...newArticles, ...prev];
          return combined.slice(0, 10); // Keep only latest 10
        });
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      // Reconnect after 5 seconds
      setTimeout(() => {
        eventSourceRef.current = new EventSource('/api/news/stream');
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { breakingNews, isConnected };
}
```

---

## 7. ALL 30 NEWS CATEGORIES

```typescript
// lib/news/newsCategories.ts

export const NEWS_CATEGORIES = [
  { 
    id: 'all', 
    label: 'All News', 
    icon: '🌐', 
    color: 'from-blue-500 to-purple-500',
    description: 'All news from every category'
  },
  { 
    id: 'breaking', 
    label: 'Breaking', 
    icon: '🔴', 
    color: 'from-red-500 to-orange-500',
    description: 'Live breaking news updates'
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: '🎓', 
    color: 'from-blue-400 to-cyan-500',
    description: 'Schools, colleges, exams, policies'
  },
  { 
    id: 'government-jobs', 
    label: 'Govt Jobs', 
    icon: '🏛️', 
    color: 'from-indigo-500 to-blue-500',
    description: 'Government vacancies and recruitment'
  },
  { 
    id: 'exam-results', 
    label: 'Results', 
    icon: '📋', 
    color: 'from-green-400 to-emerald-500',
    description: 'JEE, NEET, UPSC, SSC results'
  },
  { 
    id: 'technology', 
    label: 'Technology', 
    icon: '💻', 
    color: 'from-violet-500 to-purple-500',
    description: 'Tech news, gadgets, internet'
  },
  { 
    id: 'politics', 
    label: 'Politics', 
    icon: '🗳️', 
    color: 'from-orange-500 to-red-500',
    description: 'Political news, elections, governance'
  },
  { 
    id: 'sports', 
    label: 'Sports', 
    icon: '🏏', 
    color: 'from-yellow-500 to-orange-500',
    description: 'Cricket, football, all sports'
  },
  { 
    id: 'entertainment', 
    label: 'Entertainment', 
    icon: '🎬', 
    color: 'from-pink-500 to-rose-500',
    description: 'Bollywood, web series, music'
  },
  { 
    id: 'business', 
    label: 'Business', 
    icon: '💼', 
    color: 'from-slate-500 to-gray-600',
    description: 'Corporate news, startups, trade'
  },
  { 
    id: 'finance', 
    label: 'Finance', 
    icon: '📈', 
    color: 'from-green-500 to-teal-500',
    description: 'Stock market, banking, economy'
  },
  { 
    id: 'health', 
    label: 'Health', 
    icon: '🏥', 
    color: 'from-red-400 to-pink-500',
    description: 'Medical news, wellness, research'
  },
  { 
    id: 'science', 
    label: 'Science', 
    icon: '🔬', 
    color: 'from-blue-500 to-indigo-500',
    description: 'Scientific discoveries, research'
  },
  { 
    id: 'environment', 
    label: 'Environment', 
    icon: '🌿', 
    color: 'from-green-400 to-lime-500',
    description: 'Climate, nature, pollution'
  },
  { 
    id: 'agriculture', 
    label: 'Agriculture', 
    icon: '🌾', 
    color: 'from-yellow-400 to-green-400',
    description: 'Farming, crops, rural news'
  },
  { 
    id: 'defence', 
    label: 'Defence', 
    icon: '🛡️', 
    color: 'from-gray-600 to-slate-700',
    description: 'Military, security, defence news'
  },
  { 
    id: 'railways', 
    label: 'Railways', 
    icon: '🚆', 
    color: 'from-blue-600 to-indigo-700',
    description: 'Indian Railways news and updates'
  },
  { 
    id: 'banking', 
    label: 'Banking', 
    icon: '🏦', 
    color: 'from-emerald-500 to-green-600',
    description: 'Banks, loans, RBI, fintech'
  },
  { 
    id: 'state-news', 
    label: 'State News', 
    icon: '🗺️', 
    color: 'from-orange-400 to-amber-500',
    description: 'News from all 36 states/UTs'
  },
  { 
    id: 'international', 
    label: 'International', 
    icon: '🌍', 
    color: 'from-teal-500 to-cyan-500',
    description: 'World news affecting India'
  },
  { 
    id: 'legal', 
    label: 'Legal', 
    icon: '⚖️', 
    color: 'from-gray-500 to-slate-600',
    description: 'Supreme Court, legal updates, laws'
  },
  { 
    id: 'weather', 
    label: 'Weather', 
    icon: '🌤️', 
    color: 'from-sky-400 to-blue-500',
    description: 'IMD forecasts, monsoon, alerts'
  },
  { 
    id: 'infrastructure', 
    label: 'Infrastructure', 
    icon: '🏗️', 
    color: 'from-stone-500 to-gray-600',
    description: 'Roads, highways, construction'
  },
  { 
    id: 'social', 
    label: 'Social', 
    icon: '👥', 
    color: 'from-violet-400 to-purple-500',
    description: 'Social issues, community news'
  },
  { 
    id: 'youth', 
    label: 'Youth', 
    icon: '⚡', 
    color: 'from-yellow-400 to-orange-400',
    description: 'Youth news, students, internships'
  },
  { 
    id: 'startup', 
    label: 'Startup', 
    icon: '🚀', 
    color: 'from-purple-500 to-pink-500',
    description: 'Indian startup ecosystem'
  },
  { 
    id: 'ai-technology', 
    label: 'AI & ML', 
    icon: '🤖', 
    color: 'from-cyan-500 to-blue-500',
    description: 'Artificial Intelligence, Machine Learning'
  },
  { 
    id: 'cybersecurity', 
    label: 'Cyber Security', 
    icon: '🔒', 
    color: 'from-red-600 to-orange-500',
    description: 'Cyber threats, data breaches, safety'
  },
  { 
    id: 'space', 
    label: 'Space', 
    icon: '🚀', 
    color: 'from-indigo-600 to-purple-700',
    description: 'ISRO, NASA, space exploration'
  },
  { 
    id: 'culture', 
    label: 'Culture', 
    icon: '🎭', 
    color: 'from-rose-400 to-pink-500',
    description: 'Arts, festivals, Indian culture'
  },
];
```

---

## 8. ALL 22 INDIAN LANGUAGES

```typescript
// lib/news/newsLanguages.ts

export const INDIAN_LANGUAGES = [
  { code: 'en',  name: 'English',    nativeName: 'English',     flag: '🇬🇧', rtl: false },
  { code: 'hi',  name: 'Hindi',      nativeName: 'हिन्दी',       flag: '🇮🇳', rtl: false },
  { code: 'bn',  name: 'Bengali',    nativeName: 'বাংলা',        flag: '🇮🇳', rtl: false },
  { code: 'te',  name: 'Telugu',     nativeName: 'తెలుగు',       flag: '🇮🇳', rtl: false },
  { code: 'mr',  name: 'Marathi',    nativeName: 'मराठी',         flag: '🇮🇳', rtl: false },
  { code: 'ta',  name: 'Tamil',      nativeName: 'தமிழ்',        flag: '🇮🇳', rtl: false },
  { code: 'gu',  name: 'Gujarati',   nativeName: 'ગુજરાતી',      flag: '🇮🇳', rtl: false },
  { code: 'ur',  name: 'Urdu',       nativeName: 'اردو',          flag: '🇮🇳', rtl: true  },
  { code: 'kn',  name: 'Kannada',    nativeName: 'ಕನ್ನಡ',        flag: '🇮🇳', rtl: false },
  { code: 'or',  name: 'Odia',       nativeName: 'ଓଡ଼ିଆ',        flag: '🇮🇳', rtl: false },
  { code: 'ml',  name: 'Malayalam',  nativeName: 'മലയാളം',       flag: '🇮🇳', rtl: false },
  { code: 'pa',  name: 'Punjabi',    nativeName: 'ਪੰਜਾਬੀ',       flag: '🇮🇳', rtl: false },
  { code: 'as',  name: 'Assamese',   nativeName: 'অসমীয়া',       flag: '🇮🇳', rtl: false },
  { code: 'mai', name: 'Maithili',   nativeName: 'मैथिली',        flag: '🇮🇳', rtl: false },
  { code: 'sa',  name: 'Sanskrit',   nativeName: 'संस्कृत',       flag: '🇮🇳', rtl: false },
  { code: 'ne',  name: 'Nepali',     nativeName: 'नेपाली',        flag: '🇮🇳', rtl: false },
  { code: 'kok', name: 'Konkani',    nativeName: 'कोंकणी',        flag: '🇮🇳', rtl: false },
  { code: 'doi', name: 'Dogri',      nativeName: 'डोगरी',         flag: '🇮🇳', rtl: false },
  { code: 'mni', name: 'Manipuri',   nativeName: 'মণিপুরী',       flag: '🇮🇳', rtl: false },
  { code: 'brx', name: 'Bodo',       nativeName: 'बड़ो',          flag: '🇮🇳', rtl: false },
  { code: 'sd',  name: 'Sindhi',     nativeName: 'سنڌي',          flag: '🇮🇳', rtl: true  },
  { code: 'ks',  name: 'Kashmiri',   nativeName: 'کٲشُر',         flag: '🇮🇳', rtl: true  },
];
```

---

## 9. NEWS DATA SOURCES & SCRAPING

### 50+ News Sources Full List

```typescript
// lib/news/newsSources.ts

export const NEWS_SOURCES = {
  ENGLISH: [
    // National English
    { id: 'toi',    name: 'Times of India',     rss: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms' },
    { id: 'ndtv',   name: 'NDTV',               rss: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
    { id: 'ht',     name: 'Hindustan Times',    rss: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' },
    { id: 'hindu',  name: 'The Hindu',          rss: 'https://www.thehindu.com/news/feeder/default.rss' },
    { id: 'ie',     name: 'Indian Express',     rss: 'https://indianexpress.com/feed/' },
    { id: 'it',     name: 'India Today',        rss: 'https://www.indiatoday.in/rss/1206578' },
    { id: 'wion',   name: 'WION',               rss: 'https://www.wionews.com/feeds/world.xml' },
    // Business English
    { id: 'et',     name: 'Economic Times',     rss: 'https://economictimes.indiatimes.com/rssfeedsdefault.cms' },
    { id: 'mint',   name: 'LiveMint',           rss: 'https://www.livemint.com/rss/news' },
    { id: 'bs',     name: 'Business Standard',  rss: 'https://www.business-standard.com/rss/home_page_top_stories.rss' },
    // Tech English
    { id: 'g360',   name: 'Gadgets360',         rss: 'https://feeds.feedburner.com/NDTV-Gadgets360-Latest' },
    { id: 'yts',    name: 'YourStory',          rss: 'https://yourstory.com/feed' },
    { id: 'inc42',  name: 'Inc42',              scraper: true },
    // Sports English
    { id: 'cric',   name: 'Cricbuzz',           scraper: true },
    { id: 'espn',   name: 'ESPN India',         rss: 'https://www.espn.in/espn/rss/news' },
  ],
  HINDI: [
    { id: 'au',     name: 'Amar Ujala',         rss: 'https://www.amarujala.com/rss/breaking-news.xml' },
    { id: 'db',     name: 'Dainik Bhaskar',     rss: 'https://www.bhaskar.com/rss-v1--category-1061.xml' },
    { id: 'dj',     name: 'Dainik Jagran',      rss: 'https://www.jagran.com/rss/national.xml' },
    { id: 'nbt',    name: 'NavBharat Times',    rss: 'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms' },
    { id: 'at',     name: 'Aaj Tak',            scraper: true },
    { id: 'ab',     name: 'ABP News',           scraper: true },
    { id: 'zeen',   name: 'Zee News',           rss: 'https://zeenews.india.com/hindi/rss/india.xml' },
    { id: 'jansatta', name: 'Jansatta',         scraper: true },
    { id: 'livehindu', name: 'LiveHindustan',   scraper: true },
    { id: 'patrika', name: 'Patrika',           scraper: true },
  ],
  REGIONAL: [
    { id: 'matu',   name: 'Mathrubhumi',        lang: 'ml', scraper: true },
    { id: 'eena',   name: 'Eenadu',             lang: 'te', scraper: true },
    { id: 'abp',    name: 'ABP Ananda (Bengali)', lang: 'bn', scraper: true },
    { id: 'divbha', name: 'Divya Bhaskar',      lang: 'gu', scraper: true },
    { id: 'loksatta', name: 'Loksatta',         lang: 'mr', scraper: true },
    { id: 'dinamalar', name: 'Dinamalar',       lang: 'ta', scraper: true },
    { id: 'prabha', name: 'Prabhasakshi',       lang: 'hi', scraper: true },
  ],
  GOVERNMENT: [
    { id: 'pib',    name: 'PIB India',          rss: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3' },
    { id: 'emp',    name: 'Employment News',    scraper: true },
    { id: 'isro',   name: 'ISRO',              scraper: true },
    { id: 'imd',    name: 'IMD Weather',        scraper: true },
    { id: 'nta',    name: 'NTA Official',       scraper: true },
  ],
};
```

---

## 10. REAL-TIME NEWS SYSTEM

### Architecture Flow
```
[50+ RSS Feeds + Scrapers]
        ↓ (every 30 min via node-cron)
[Backend Scraper Service]
        ↓
[Deduplicate + Validate]
        ↓
[Upload images → Cloudinary]
        ↓
[Save to MongoDB]
        ↓
[Queue Translation Job → BullMQ → Redis]
        ↓
[Translation Worker translates to 6+ languages]
        ↓
[Update Redis Cache (breaking news list)]
        ↓
[SSE Server pushes to all connected clients]
        ↓
[Frontend updates news feed in real-time]
```

### Breaking News Flow
```
Admin marks article as "Breaking" in admin panel
        ↓
POST /api/admin/news/:id/set-breaking
        ↓
Updates MongoDB: isBreaking = true
        ↓
Publishes to Redis Pub/Sub channel 'breaking-news'
        ↓
All connected SSE clients receive update instantly
        ↓
Frontend shows animated breaking news banner + toast notification
```

---

## 11. TRANSLATION SYSTEM

### How it Works
```
1. New article saved to MongoDB
2. BullMQ translation job queued
3. Worker picks up job
4. Google Translate API called for: title + summary
   (6 priority languages: hi, bn, te, mr, ta, gu)
5. Results stored in article.translations Map
6. Full content translated ONLY when user requests it
   (on-demand to save API costs)
7. Translated content cached in Redis for 1 hour
```

### Language Selection UX
```
User selects language from dropdown (top-right of news page)
  → Saved to Zustand store (persisted in localStorage)
  → All API calls include ?language=hi (or selected lang)
  → Backend returns translated titles/summaries
  → Article page shows translated content
  → Language auto-detected from browser settings on first visit
```

### Translation Priority
```
Priority 1: Hindi (30% of India's population)
Priority 2: Bengali (8%)
Priority 3: Telugu (7%)
Priority 4: Marathi (7%)
Priority 5: Tamil (6%)
Priority 6: Gujarati (4.5%)
Priority 7-22: On-demand translation only
```

---

## 12. SEARCH SYSTEM

### Search Architecture
```
User types in search box
  → Debounced (300ms)
  → Client-side Fuse.js for instant results (from cached news)
  → API call to GET /api/news/search?q=... (MongoDB text search)
  → Results ranked by: relevance score + recency + views
  → Highlighted matching text in results
  → Recent searches saved to localStorage
```

### MongoDB Text Search Index
```javascript
NewsSchema.index({ 
  title: 'text', 
  summary: 'text', 
  content: 'text',
  tags: 'text'
}, { 
  weights: { 
    title: 10,      // Title match = highest priority
    tags: 5,        // Tag match = high priority  
    summary: 3,     // Summary match = medium
    content: 1      // Content match = lowest
  },
  default_language: 'english',
  name: 'news_text_search'
});
```

---

## 13. INDIVIDUAL NEWS ARTICLE PAGE

### Route: `/news/[slug]` (opens in new tab)

### Page Sections

**1. Article Header:**
- Category badge + breaking badge if applicable
- Headline (H1, large, bold, animated entrance)
- Author / Source + publication date
- Read time estimate ("5 min read")
- Language switcher (change translation)
- Share buttons (WhatsApp, Twitter, Copy Link, Facebook)

**2. Hero Image:**
- Full-width image with blur placeholder loading
- Image caption if available
- Video player if it's a video news article (react-player)

**3. Reading Progress Bar:**
- Fixed at top of page
- Shows scroll progress through article
- Color gradient animation

**4. Article Body:**
- Full HTML content rendered (dangerouslySetInnerHTML with sanitization)
- DOMPurify for XSS protection
- Inline images styled beautifully
- Code blocks with syntax highlighting if any
- Pull quotes styled with left border accent

**5. Tags Section:**
- Clickable tag pills → navigate to /news/tag/[tagSlug]

**6. Share Section:**
- Large share card with article title + image
- WhatsApp: direct wa.me link with article title + URL
- Twitter: pre-filled tweet
- Copy Link: clipboard API with toast confirmation

**7. Related News (Bottom):**
- 6 article cards in horizontal scroll
- Same category as current article
- Sorted by recency

**8. More From This Source:**
- 4 articles from same source

### SSR (Server-Side Rendering) Implementation
```typescript
// app/(public)/news/[slug]/page.tsx
import { Metadata } from 'next';
import { newsApi } from '../../../lib/news/newsApi';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await newsApi.getArticle(params.slug);
  const article = data?.article;
  
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.summary,
    keywords: article.seo?.keywords?.join(', '),
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.thumbnail?.url || ''],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.source.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.thumbnail?.url || ''],
    },
    alternates: {
      canonical: article.seo?.canonicalUrl,
    },
  };
}

// JSON-LD structured data for Google News
function ArticleSchema({ article }: { article: INewsArticle }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.thumbnail?.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.source.name,
      url: article.source.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Site Name',
      logo: { '@type': 'ImageObject', url: 'https://yoursite.com/logo.png' }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yoursite.com/news/${article.slug}`
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
    inLanguage: 'en-IN',
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 14. ADMIN NEWS MANAGEMENT

### Admin Panel — News Section Features

**1. Dashboard Stats (Real-time):**
- Total articles count
- Articles added today
- Breaking news count
- Most viewed article today
- Articles by category (pie chart - Recharts)
- Hourly article count (line chart)
- Top sources by article count

**2. News List Table (TanStack Table):**
```
Columns: Thumbnail | Title | Category | Source | Published | Views | Breaking | Featured | Actions
Sorting: By date, views, category
Filtering: Category, source, date range, breaking flag
Pagination: 50 per page
Bulk Actions: Delete, Set Breaking, Set Featured, Translate
```

**3. Add/Edit News Form:**
```
Fields:
- Title (required, max 500 chars)
- Slug (auto-generated, editable)
- Summary (required, max 1000 chars)
- Content (Rich text editor - TipTap)
- Category (dropdown, required)
- Tags (comma-separated)
- Thumbnail (URL or upload)
- Video URL (optional)
- Source Name (required)
- Source URL
- Published Date (required)
- Is Breaking (toggle)
- Is Featured (toggle)
- Is Editor's Pick (toggle)
- SEO: Meta Title, Meta Description, Keywords
```

**4. Bulk Import Panel:**
- Upload CSV file with news data
- Paste JSON array of news articles
- Preview before import
- Duplicate detection
- Import progress bar (BullMQ queue)
- This is how admin will add 1000+ news articles daily

**5. CSV Template Format:**
```csv
title,summary,content,category,tags,source_name,source_url,thumbnail_url,published_at,is_breaking
"JEE Main 2024 Result Out","NTA has released...","Full content here...","exam-results","JEE,NTA,Result","NDTV","https://ndtv.com","https://img.url","2024-06-01T10:00:00Z","false"
```

**6. Translation Management:**
- View translation status per language per article
- Manually trigger translation for specific articles
- Override auto-translated content
- See API usage and costs

**7. Breaking News Control:**
- Quick toggle for any article → Breaking
- Set ticker text manually
- Schedule breaking news removal

---

## 15. API ENDPOINTS (COMPLETE)

```typescript
// All News API Endpoints

// ============= PUBLIC APIs =============

GET  /api/news
     // Query: category, language, page, pageSize, dateFrom, dateTo, 
     //        source, isBreaking, search, sortBy, sortOrder
     // Returns: NewsListResponse

GET  /api/news/breaking
     // Returns: INewsArticle[] (top 5 breaking news)

GET  /api/news/featured
     // Returns: INewsArticle[] (featured articles for hero)

GET  /api/news/trending
     // Query: category, limit (default: 10)
     // Returns: INewsArticle[] (sorted by trendingScore)

GET  /api/news/categories
     // Returns: Category[] with article counts

GET  /api/news/sources
     // Returns: Source[] with article counts

GET  /api/news/tags/popular
     // Returns: string[] (top 50 tags)

GET  /api/news/search?q={query}
     // Query: q, category, language, page, pageSize
     // Returns: NewsListResponse with relevance scores

GET  /api/news/:slug
     // Query: language
     // Returns: { article: INewsArticle, related: INewsArticle[] }

GET  /api/news/:slug/related
     // Returns: INewsArticle[] (6 related articles)

GET  /api/news/category/:categorySlug
     // Query: language, page, pageSize, sortBy
     // Returns: NewsListResponse

GET  /api/news/tag/:tagSlug
     // Query: page, pageSize
     // Returns: NewsListResponse

GET  /api/news/stream
     // SSE endpoint for real-time breaking news
     // Content-Type: text/event-stream

POST /api/news/:slug/view
     // Increment view count

POST /api/news/:slug/share
     // Increment share count

POST /api/news/translate
     // Body: { articleId, targetLanguage }
     // Returns: { translatedContent: string }

// ============= ADMIN APIs (require auth + admin role) =============

GET    /api/admin/news             # List all news with full filters
POST   /api/admin/news             # Create single article
PUT    /api/admin/news/:id         # Update article
DELETE /api/admin/news/:id         # Delete article
DELETE /api/admin/news/bulk        # Bulk delete

POST   /api/admin/news/bulk-import # Import via JSON/CSV
       # Body: { articles: ArticleData[] } or FormData with CSV file
       # Returns: { imported: number, skipped: number, errors: string[] }

POST   /api/admin/news/:id/breaking      # Toggle breaking
POST   /api/admin/news/:id/featured      # Toggle featured  
POST   /api/admin/news/:id/translate     # Trigger translation
POST   /api/admin/news/sync              # Trigger manual news sync
GET    /api/admin/news/stats             # Dashboard statistics
GET    /api/admin/news/translation-status # Translation coverage stats
```

---

## 16. ANIMATION & 3D DETAILS

### Breaking News Banner Animation
```typescript
// Framer Motion — banner slides in from top
const bannerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  exit: { y: -100, opacity: 0 }
};

// GSAP — ticker text infinite scroll
gsap.to('.ticker-text', {
  x: '-100%',
  duration: 30,
  ease: 'linear',
  repeat: -1,
});
```

### News Card Animations
```typescript
// Framer Motion — card entrance (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 200 }
  }
};

// Hover — tilt + glow effect (react-parallax-tilt)
<Tilt
  tiltMaxAngleX={8}
  tiltMaxAngleY={8}
  glareEnable={true}
  glareMaxOpacity={0.1}
  glareColor="#6366f1"
>
  <NewsCard article={article} />
</Tilt>
```

### Category Filter Bar Animation
```typescript
// GSAP — animated underline indicator
gsap.to('.filter-indicator', {
  x: targetX,
  width: targetWidth,
  duration: 0.3,
  ease: 'power2.out'
});

// Framer Motion — pill morphing
const filterVariants = {
  inactive: { backgroundColor: 'transparent', color: '#9ca3af' },
  active: { 
    backgroundColor: '#6366f1', 
    color: '#fff',
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400 }
  }
};
```

### Language Selector
```typescript
// Framer Motion — dropdown fade+scale
const dropdownVariants = {
  closed: { opacity: 0, scale: 0.95, y: -10 },
  open: { 
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  }
};
```

### 3D Hero Section (Three.js)
```typescript
// Rotating 3D text "NEWS" above hero
// Floating newspaper/document 3D model
// Particle system spelling out breaking news keywords
// Globe with news hotspot markers

// Three.js component
function NewsGlobe() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Float speed={2} rotationIntensity={0.5}>
        <Text3D font="/fonts/helvetiker.json" size={0.5}>
          LIVE NEWS
          <meshStandardMaterial color="#6366f1" />
        </Text3D>
      </Float>
      <Stars radius={100} depth={50} count={3000} factor={4} />
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
    </Canvas>
  );
}
```

### Page Transition (Framer Motion)
```typescript
// Smooth page transitions
const pageTransition = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { 
    opacity: 1, filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, filter: 'blur(10px)',
    transition: { duration: 0.2 }
  }
};
```

### Loading Skeleton
```typescript
// Animated shimmer skeleton for news cards
// Using Tailwind animate-pulse + custom shimmer gradient
// Lottie animation for "Loading latest news..."
```

---

## 17. SEO STRATEGY FOR NEWS

### Technical SEO
```
✅ Next.js App Router SSR for all news pages
✅ generateMetadata() for dynamic meta tags
✅ NewsArticle JSON-LD schema on every article
✅ BreadcrumbList schema
✅ Organization schema on news home page
✅ News sitemap (news-sitemap.xml) - Google News requirement
✅ robots.txt allowing Google News bot
✅ Canonical URLs to prevent duplicate content
✅ hreflang tags for multi-language versions
✅ Open Graph + Twitter Card for social sharing
✅ Image alt texts on all thumbnails
✅ Fast loading (Core Web Vitals - LCP < 2.5s)
```

### News Sitemap (Google News)
```xml
<!-- /news-sitemap.xml — auto-generated daily -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://yoursite.com/news/article-slug-here</loc>
    <news:news>
      <news:publication>
        <news:name>Your Site Name</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2024-06-01T10:00:00Z</news:publication_date>
      <news:title>Article Title Here</news:title>
      <news:keywords>JEE, Result, Education</news:keywords>
    </news:news>
  </url>
</urlset>
```

### Content SEO
```
✅ Category pages: /news/category/education (indexable)
✅ Tag pages: /news/tag/jee-main (indexable)
✅ Article titles optimized (max 65 chars)
✅ Meta descriptions auto-generated from summary (max 155 chars)
✅ Keywords extracted from article content
✅ Internal links to related articles
✅ Last Modified header on all articles
```

---

## 18. PERFORMANCE OPTIMIZATION

### Frontend Performance
```
✅ React Virtual / TanStack Virtual — only render visible news cards
   (1000 articles in DOM = lag, Virtual = smooth)
✅ next/image — automatic WebP conversion, lazy loading, blur placeholders
✅ React Query — smart caching, background updates, no redundant fetches
✅ Dynamic imports — lazy load heavy components (video player, 3D scene)
✅ Route prefetching — Next.js auto-prefetches linked article pages
✅ SWR revalidation — news data stays fresh without full page reload
✅ Skeleton loading — immediate visual feedback
✅ Font optimization — next/font with subset
✅ Code splitting — separate chunk for 3D/animation code
```

### Backend Performance
```
✅ Redis caching — news list cached for 5 min (HUGE query savings)
✅ MongoDB indexes — compound indexes for common queries
✅ Pagination — max 20 articles per API call
✅ Field projection — only return needed fields
✅ Image optimization — Cloudinary auto-transforms for different sizes
✅ Gzip compression — express compression middleware
✅ Connection pooling — Mongoose connection pool
✅ Rate limiting — prevent scraper abuse (100 req/min/IP)
```

### Cache Strategy
```
Redis TTLs:
- Breaking news list     : 30 seconds (real-time feel)
- Category news list     : 5 minutes
- Trending news          : 10 minutes
- Article detail         : 5 minutes
- Translation (title)    : 24 hours
- Translation (content)  : 1 hour
- Category counts        : 1 hour
- Popular tags           : 1 hour
```

---

## 19. FULL CODE IMPLEMENTATION

### package.json (Frontend)
```json
{
  "name": "website-news-frontend",
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.2.0",
    "gsap": "^3.12.5",
    "@gsap/react": "^2.1.0",
    "three": "^0.165.0",
    "@react-three/fiber": "^8.16.8",
    "@react-three/drei": "^9.106.0",
    "@react-three/postprocessing": "^2.16.2",
    "lottie-react": "^2.4.0",
    "react-spring": "^9.7.3",
    "@tanstack/react-query": "^5.40.0",
    "@tanstack/react-virtual": "^3.5.1",
    "zustand": "^4.5.2",
    "swr": "^2.2.5",
    "axios": "^1.7.2",
    "socket.io-client": "^4.7.5",
    "react-player": "^2.16.0",
    "react-intersection-observer": "^9.10.2",
    "react-infinite-scroll-component": "^6.1.0",
    "fuse.js": "^7.0.0",
    "dayjs": "^1.11.11",
    "timeago.js": "^4.0.2",
    "react-share": "^5.1.0",
    "sonner": "^1.5.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.395.0",
    "react-icons": "^5.2.1",
    "react-parallax-tilt": "^1.7.217",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "dompurify": "^3.1.3",
    "auto-animate": "^0.8.2",
    "blurhash": "^2.0.5",
    "lodash": "^4.17.21",
    "uuid": "^10.0.0"
  }
}
```

### package.json (Backend)
```json
{
  "name": "website-news-backend",
  "dependencies": {
    "express": "^4.19.2",
    "typescript": "^5.4.0",
    "mongoose": "^8.4.1",
    "ioredis": "^5.4.1",
    "puppeteer": "^22.11.2",
    "puppeteer-cluster": "^0.23.0",
    "cheerio": "^1.0.0-rc.12",
    "playwright": "^1.44.1",
    "axios": "^1.7.2",
    "rss-parser": "^3.13.0",
    "got": "^14.4.0",
    "@google-cloud/translate": "^8.3.0",
    "deepl-node": "^1.12.0",
    "bullmq": "^5.8.3",
    "@bull-board/express": "^5.20.0",
    "node-cron": "^3.0.3",
    "sharp": "^0.33.4",
    "cloudinary": "^2.2.0",
    "socket.io": "^4.7.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.3.1",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "winston": "^3.13.0",
    "express-validator": "^7.1.0",
    "natural": "^8.0.1",
    "franc": "^6.2.0",
    "keyword-extractor": "^0.0.25",
    "agenda": "^5.0.0",
    "dotenv": "^16.4.5",
    "uuid": "^10.0.0",
    "node-cache": "^5.1.2"
  }
}
```

---

## 🔧 QUICK START COMMANDS

```bash
# Clone and setup
git clone <your-repo>
cd project-root

# Install all dependencies (monorepo)
npm install

# Setup environment
cp .env.example .env
# Fill in all env variables

# Start MongoDB + Redis (Docker)
docker-compose up -d mongodb redis

# Seed initial data
npm run seed:categories
npm run seed:sources

# Start development servers
npm run dev:web      # Next.js on port 3000
npm run dev:backend  # Express on port 5000

# Start background jobs (news sync)
npm run workers

# Run first news sync manually
curl -X POST http://localhost:5000/api/admin/news/sync

# Build for production
npm run build

# Deploy
npm run deploy
```

---

## 📊 EXPECTED PERFORMANCE METRICS

```
News Page Load Time:      < 1.5 seconds (SSR + CDN)
Article Page Load Time:   < 1 second
News Articles per Day:    1000+ (auto-scraped)
Supported Languages:      22
Category Filters:         30
Breaking News Latency:    < 30 seconds
Search Response Time:     < 200ms (with index)
Cache Hit Rate:           > 85% (Redis)
Mobile Performance Score: > 90 (Lighthouse)
SEO Score:                > 95 (Lighthouse)
```

---

## 📌 IMPORTANT NOTES

```
1. Google Translate API — set up billing alerts (costs money for high volume)
2. RSS scraping is legal for most news sites — always check robots.txt
3. Puppeteer needs ~1GB RAM for headless Chrome — plan server accordingly
4. BullMQ requires Redis — don't run without Redis
5. Cache invalidation — when admin updates article, clear Redis cache for that slug
6. Rate limiting on translation — Google allows 500K chars/month free
7. Image CDN — Cloudinary free tier limited — upgrade for production
8. Breaking news SSE — max 1000 concurrent connections on basic server
9. Mobile first — test news cards on 320px width
10. Accessibility — use proper ARIA labels on all interactive elements
```

---

*News Page Masterplan — Version 1.0*  
*Every line of this document is actionable. Follow step by step.*  
*Contact: 8986985813 | ishukryk@gmail.com*  
*Status: Ready for Development 🚀*

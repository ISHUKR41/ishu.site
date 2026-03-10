# 🔐 USER AUTHENTICATION + PROFILE + DASHBOARD — COMPLETE MASTERPLAN
### ishu.site — Post-Login Experience, User Profile, MCP Integration & Feature Roadmap
### Reference: Vercel · Clerk · GitHub · Apple · Tesla · Figma · Linear · Notion · Dora.ai

---

> **Author:** ISHU (Project Owner)  
> **Contact:** 📱 8986985813 | 📧 ishukryk@gmail.com | 💬 WA: 8986985813  
> **Repo:** https://github.com/ISHUKR41/ishu.site.git  
> **Auth Provider:** Clerk (with India phone fix)  
> **Stack:** Next.js 14 + TypeScript + Tailwind + Framer Motion + Three.js + MongoDB + Redis  
> **Purpose:** This document is the SINGLE SOURCE OF TRUTH for everything that happens AFTER a user signs in.

---

## 📋 TABLE OF CONTENTS

1. [🚨 CRITICAL FIX — Clerk India Phone Number Error](#1-critical-fix--clerk-india-phone-number-error)
2. [🏗️ Authentication Architecture](#2-authentication-architecture)
3. [👤 User Profile System — Complete Design](#3-user-profile-system--complete-design)
4. [🎨 Profile Page UI — World-Class Design](#4-profile-page-ui--world-class-design)
5. [📊 User Dashboard](#5-user-dashboard)
6. [🔔 Notification Center](#6-notification-center)
7. [⭐ Bookmarks & Saved Items System](#7-bookmarks--saved-items-system)
8. [📱 WhatsApp Subscription Manager](#8-whatsapp-subscription-manager)
9. [📜 User Activity History](#9-user-activity-history)
10. [🛠️ Tool Usage History & Favorites](#10-tool-usage-history--favorites)
11. [📰 Personalized News Feed](#11-personalized-news-feed)
12. [🎓 Exam Tracker & Result Alerts](#12-exam-tracker--result-alerts)
13. [🔒 Security & Settings Page](#13-security--settings-page)
14. [🤖 MCP (Model Context Protocol) Integration](#14-mcp-model-context-protocol-integration)
15. [📁 Complete Folder & File Structure](#15-complete-folder--file-structure)
16. [🗄️ Database Schema — User Collections](#16-database-schema--user-collections)
17. [🔌 API Endpoints — All User Routes](#17-api-endpoints--all-user-routes)
18. [📦 All Libraries & Tools to Use](#18-all-libraries--tools-to-use)
19. [🎬 Animation & 3D Strategy for User Pages](#19-animation--3d-strategy-for-user-pages)
20. [🔐 Security & Privacy Architecture](#20-security--privacy-architecture)
21. [🧠 AI-Powered Features for Users](#21-ai-powered-features-for-users)
22. [📋 Step-by-Step Implementation Prompts](#22-step-by-step-implementation-prompts)
23. [🚀 Deployment & Environment Variables](#23-deployment--environment-variables)

---

## 1. 🚨 CRITICAL FIX — Clerk India Phone Number Error

### The Error:
```
"Phone numbers from this country (India) are currently not supported.
For more information, please contact support."
```

### Root Cause:
Clerk has geo-restrictions on SMS OTP for Indian (+91) phone numbers in some plans/regions.

### ✅ COMPLETE SOLUTION (Multiple Approaches):

#### Option A — Disable Phone Auth, Use Email + Google OAuth (RECOMMENDED - FREE)
```typescript
// app/layout.tsx or ClerkProvider config
// In Clerk Dashboard → User & Authentication → Email, Phone, Username
// TURN OFF: Phone number authentication
// TURN ON: Email address (required) + Google OAuth + GitHub OAuth

// clerk.config.ts or in Dashboard Settings:
// Authentication Strategy: Email + Social (Google, GitHub, Facebook)
// Remove phone number as required field
```

#### Option B — Use Twilio as Custom SMS Provider (PAID but works in India)
```typescript
// In Clerk Dashboard:
// Configure → SMS → Custom SMS Provider → Twilio
// Twilio supports India (+91) fully

// Steps:
// 1. Create Twilio account at twilio.com
// 2. Get Account SID + Auth Token + Phone Number
// 3. In Clerk Dashboard → SMS Provider → Add Twilio credentials
// 4. Test with Indian number

// Environment Variables:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

#### Option C — Custom OTP via WhatsApp (BEST for Indian Users - FREE)
```typescript
// Instead of SMS OTP, use WhatsApp OTP via Baileys/Twilio WhatsApp API
// Store WhatsApp number separately in MongoDB, NOT in Clerk

// Flow:
// 1. User signs up with email in Clerk
// 2. After sign-up, prompt "Add WhatsApp for notifications"
// 3. Send OTP via WhatsApp (not SMS) using your Baileys/Twilio setup
// 4. Verify OTP, store verified WhatsApp number in MongoDB user profile

// This way: Clerk handles auth (email/Google), you handle WhatsApp separately
```

#### Option D — Firebase Phone Auth as Backup (Alternative to Clerk for Phone)
```typescript
// Keep Clerk for email/social login
// Add Firebase Auth for phone-only users
// Merge both into one unified user in MongoDB by email

// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firebase supports India (+91) perfectly for phone OTP
```

### ✅ FINAL RECOMMENDED APPROACH:
```
Primary Auth: Clerk (Email + Google OAuth + GitHub OAuth)
Secondary:    Firebase (Phone/WhatsApp OTP for Indian users)
WhatsApp:     Custom OTP via Baileys (stored in MongoDB, not Clerk)
Profile:      All user data stored in MongoDB with Clerk userId as foreign key
```

---

## 2. 🏗️ Authentication Architecture

### Complete Auth Flow Diagram:
```
┌─────────────────────────────────────────────────────────────┐
│                    USER VISITS SITE                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │  Clerk    │ ← Email / Google / GitHub / Facebook
                    │  Auth     │
                    └─────┬─────┘
                          │ userId returned
                          │
                    ┌─────▼──────────────────┐
                    │  Clerk Webhook          │
                    │  (user.created event)   │
                    └─────┬───────────────────┘
                          │ Auto-trigger
                          │
                    ┌─────▼──────────────────┐
                    │  POST /api/users/sync   │
                    │  Create MongoDB Profile │
                    └─────┬───────────────────┘
                          │
                    ┌─────▼──────────────────┐
                    │  User Dashboard         │
                    │  /dashboard             │
                    └────────────────────────┘
```

### Auth Guard Middleware:
```typescript
// middleware.ts (root level)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/saved(.*)',
  '/notifications(.*)',
  '/api/user(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    const adminIds = process.env.ADMIN_CLERK_IDS?.split(',') || [];
    if (!userId || !adminIds.includes(userId)) {
      return Response.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
```

### Clerk Webhook Handler (Auto Profile Creation):
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET!);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    }) as WebhookEvent;
  } catch (err) {
    return new Response('Error verifying webhook', { status: 400 });
  }

  await connectDB();

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    
    await User.create({
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name || '',
      lastName: last_name || '',
      avatar: image_url,
      role: 'user',
      subscription: { plan: 'free', status: 'active' },
      preferences: { language: 'hi', notifications: { whatsapp: false, email: true } },
      stats: { toolsUsed: 0, pdfProcessed: 0, newsRead: 0 },
      createdAt: new Date(),
    });
  }

  if (evt.type === 'user.deleted') {
    await User.findOneAndDelete({ clerkId: evt.data.id });
  }

  return new Response('OK', { status: 200 });
}
```

---

## 3. 👤 User Profile System — Complete Design

### Profile Data Model (Everything a User Can Have):
```typescript
// MongoDB User Schema — COMPLETE
interface IUser {
  // === IDENTITY (from Clerk) ===
  clerkId: string;              // Clerk's user ID (primary key link)
  email: string;                // Primary email
  firstName: string;
  lastName: string;
  username: string;             // Unique handle @username
  avatar: string;               // Profile picture URL
  coverImage: string;           // Banner/cover photo URL
  bio: string;                  // Short bio (max 160 chars)

  // === CONTACT ===
  phone: string;                // Optional phone
  whatsappNumber: string;       // Verified WhatsApp number (Indian +91)
  whatsappVerified: boolean;    // Whether WA is verified via OTP
  location: {
    state: string;              // Indian state
    city: string;
    pincode: string;
  };

  // === ROLE & PERMISSIONS ===
  role: 'user' | 'moderator' | 'admin' | 'superadmin';
  permissions: string[];        // Granular permissions array

  // === SUBSCRIPTION ===
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date;
    stripeCustomerId: string;
    razorpayCustomerId: string; // Indian payment gateway
  };

  // === PREFERENCES ===
  preferences: {
    language: string;           // 'hi' | 'en' | 'bn' | 'te' | etc.
    theme: 'dark' | 'light' | 'system';
    notifications: {
      email: boolean;
      whatsapp: boolean;
      push: boolean;
      examAlerts: boolean;
      newsDigest: boolean;
      toolUpdates: boolean;
    };
    newsCategories: string[];   // Preferred news categories
    examTypes: string[];        // Subscribed exam types (JEE, NEET, SSC, etc.)
    states: string[];           // States user follows
  };

  // === EXAM TRACKER ===
  trackedExams: {
    examId: string;
    examName: string;           // JEE Mains, NEET, SSC CGL, etc.
    status: 'upcoming' | 'applied' | 'appeared' | 'result_out';
    applicationNumber: string;
    rollNumber: string;
    examDate: Date;
    resultDate: Date;
    notes: string;
    addedAt: Date;
  }[];

  // === BOOKMARKS ===
  bookmarks: {
    type: 'result' | 'news' | 'blog' | 'tool' | 'vacancy';
    itemId: string;
    title: string;
    url: string;
    thumbnail: string;
    savedAt: Date;
  }[];

  // === TOOL HISTORY ===
  toolHistory: {
    toolId: string;
    toolName: string;
    usedAt: Date;
    fileCount: number;
    success: boolean;
  }[];
  favoriteTool: string[];       // List of favorite tool IDs

  // === STATS & GAMIFICATION ===
  stats: {
    toolsUsed: number;
    pdfProcessed: number;
    newsRead: number;
    blogsRead: number;
    examsTracked: number;
    loginStreak: number;
    lastLogin: Date;
    totalLogins: number;
    points: number;             // Gamification points
    badges: string[];           // Achievement badges
    level: number;              // User level 1-100
  };

  // === METADATA ===
  isVerified: boolean;          // Email verified
  isActive: boolean;            // Account active
  isBanned: boolean;            // Banned by admin
  banReason: string;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. 🎨 Profile Page UI — World-Class Design

### Design Inspiration:
- **GitHub Profile** → Stats, contribution graph, pinned repos concept
- **Vercel Dashboard** → Clean dark UI, smooth transitions
- **Clerk Dashboard** → Professional user management
- **Linear Profile** → Minimalist with great typography
- **Figma Profile** → Creative portfolio style

### Profile Page Sections:

#### Section 1 — Hero Banner
```typescript
// app/(dashboard)/profile/page.tsx

// Features:
// ✅ Full-width cover image with parallax scroll (Framer Motion)
// ✅ Profile avatar with animated ring (glow effect - CSS animation)
// ✅ Avatar upload with drag & drop (react-dropzone + Cloudinary)
// ✅ Username, email, join date
// ✅ Animated stats bar (tools used, news read, exams tracked)
// ✅ Edit Profile button with slide-in drawer (shadcn Sheet)
// ✅ Verified badge animation (Lottie checkmark)
// ✅ Dark glassmorphism card overlay

// Libraries:
// - framer-motion (parallax + stagger animations)
// - react-dropzone (avatar upload)
// - @cloudinary/next (image hosting)
// - lottie-react (verified badge animation)
// - react-countup (animated stat numbers)
```

#### Section 2 — Stats Cards (Animated)
```typescript
// 6-card grid layout:
// ┌──────────┐ ┌──────────┐ ┌──────────┐
// │ Tools    │ │ PDFs     │ │ News     │
// │  Used    │ │Processed │ │  Read    │
// │  🔢 47   │ │  🔢 123  │ │  🔢 890  │
// └──────────┘ └──────────┘ └──────────┘
// ┌──────────┐ ┌──────────┐ ┌──────────┐
// │ Exams    │ │ Login    │ │  Points  │
// │ Tracked  │ │  Streak  │ │ (Level)  │
// │  🔢 5    │ │  🔢 12🔥 │ │  🔢 2450 │
// └──────────┘ └──────────┘ └──────────┘

// Each card: hover tilt (react-parallax-tilt), gradient border, countup numbers
```

#### Section 3 — Exam Tracker Board
```typescript
// Kanban-style board (inspired by Linear/GitHub Projects)
// Columns: Upcoming | Applied | Appeared | Result Out
// Cards: Exam name, date, status badge, quick notes
// Drag & Drop to change status (@dnd-kit/core)
// Add exam via modal with search autocomplete
// Calendar view toggle (react-calendar)
```

#### Section 4 — Activity Graph (GitHub-style)
```typescript
// 52-week contribution-style grid
// Color intensity = activity level (tools used, news read)
// Hover tooltip showing date + activity count
// Built with D3.js or custom SVG + Framer Motion
// Toggle: Tools / News / Blogs / Logins
```

#### Section 5 — Recent Bookmarks
```typescript
// Masonry grid layout (react-masonry-css)
// 3 tabs: Results | News | Tools
// Card with: thumbnail, title, date saved, remove button
// Infinite scroll (react-intersection-observer)
```

#### Section 6 — Badge Collection (Gamification)
```typescript
// Horizontal scroll badge shelf
// Badges with 3D tilt effect on hover
// Locked badges shown dimly with lock icon
// Progress toward next badge
// Example badges:
// 🏆 "PDF Master" - Used 50 PDF tools
// 📰 "News Junkie" - Read 1000 news
// 🎯 "Exam Ready" - Tracked 10 exams  
// 🔥 "7-Day Streak" - Logged in 7 days straight
// ⭐ "Power User" - Used site for 30 days
```

#### Section 7 — WhatsApp Notification Manager
```typescript
// Large card with WhatsApp green theme
// Current WA number (if verified)
// Verify/Change WA number button
// OTP input (6-digit with auto-focus)
// Subscription toggles for each exam type
// "Preview" last WA message sent
```

#### Section 8 — Preferences Panel
```typescript
// Language Selector (22 Indian languages)
// Theme Toggle with 3D cube animation
// Notification preferences (toggle switches)
// News category preferences (chip selection)
// State preferences (multi-select with India map)
```

---

## 5. 📊 User Dashboard

### Dashboard Layout:
```
/dashboard — Main hub after login

┌────────────────────────────────────────────────────────────┐
│  SIDEBAR (collapsible)    │  MAIN CONTENT AREA              │
│  ───────────────────────  │  ─────────────────────────────  │
│  👤 Profile               │  Welcome back, [Name]! 🎉       │
│  📊 Dashboard             │  ───────────────────────────── │
│  🎓 Exam Tracker          │  QUICK STATS (animated cards)   │
│  📑 Saved Results         │  ───────────────────────────── │
│  📰 My News Feed          │  UPCOMING EXAMS TIMELINE        │
│  🛠️  Tool History         │  ───────────────────────────── │
│  ⭐ Bookmarks             │  RECENT TOOL USAGE              │
│  🔔 Notifications         │  ───────────────────────────── │
│  💬 WhatsApp Alerts       │  PERSONALIZED NEWS              │
│  ⚙️  Settings             │  ───────────────────────────── │
│  🔒 Security              │  TRENDING VACANCIES             │
│  ─────────────────────    │  ───────────────────────────── │
│  [Sign Out]               │  BADGE PROGRESS                 │
└────────────────────────────────────────────────────────────┘
```

### Dashboard Widgets:

#### Widget 1 — Exam Timeline
```typescript
// Vertical timeline showing upcoming exams
// Color coded: Red (< 7 days), Orange (< 30 days), Green (> 30 days)
// Click exam → detailed modal with all info
// Quick action: "Mark as Applied" button
// Library: react-chrono or custom Framer Motion timeline
```

#### Widget 2 — WhatsApp Alert Status
```typescript
// Mini card showing:
// ✅ WA Connected: +91 8986985813
// 📨 Last message: "SSC CGL Form 2025 Released" (2 hours ago)
// 🔔 Active subscriptions: 5 exams
// Quick toggle: Pause all / Resume all
```

#### Widget 3 — Tool Quick Launch
```typescript
// 8 most used tools as icon grid
// Drag to reorder
// "Recent" tab showing last 5 files processed
// Direct upload button per tool
```

#### Widget 4 — Personalized News
```typescript
// 5 news cards based on user's preferred categories
// "Load more" button
// Category filter chips
// Mark as read (swipe gesture on mobile)
```

#### Widget 5 — State Vacancy Tracker
```typescript
// India map (SVG + Framer Motion)
// User's selected states highlighted
// Click state → popup with new vacancies count
// "New" badge animation on states with fresh vacancies
```

---

## 6. 🔔 Notification Center

### `/notifications` Page:
```typescript
// Bell icon in header with unread count badge (animated pulse)
// Dropdown preview (last 5 notifications)
// Full page: /notifications

// Notification Types:
// 🎓 EXAM_ALERT     - New form/result for tracked exam
// 📰 NEWS_DIGEST    - Daily news summary
// 🛠️  TOOL_UPDATE   - New tool added
// 💬 WHATSAPP       - WA message sent confirmation
// 🔐 SECURITY       - Login from new device/location
// 🏆 BADGE_EARNED   - Achievement unlocked
// 🎉 WELCOME        - Welcome message for new users
// 📢 ANNOUNCEMENT   - Admin broadcast

// Features:
// - Real-time via Server-Sent Events (SSE) or Socket.io
// - Mark all as read
// - Filter by type
// - Delete individual / clear all
// - Notification preferences in settings

// Libraries:
// - socket.io-client (real-time)
// - framer-motion (slide-in animations)
// - react-hot-toast (toast notifications)
```

### Real-time Notification Service:
```typescript
// lib/notifications.ts
import { Server } from 'socket.io';

// When admin posts new exam result:
// 1. Admin triggers POST /api/admin/notify
// 2. BullMQ job queued for each subscribed user
// 3. Socket.io emits to connected users instantly
// 4. WhatsApp message sent via Baileys to WA-subscribed users
// 5. Push notification via web push API
// 6. Email notification via Nodemailer/SendGrid
```

---

## 7. ⭐ Bookmarks & Saved Items System

### `/saved` Page:
```typescript
// Tab Layout:
// [Results] [News] [Blogs] [Tools] [Vacancies]

// Each tab:
// - Masonry grid (react-masonry-css)
// - Search within saved items
// - Sort: Date Saved | Alphabetical | Category
// - Export as PDF list (pdf-lib)
// - Share bookmark collection (public/private toggle)

// Bookmark card:
// - Thumbnail image
// - Title
// - Source/Category badge
// - Date saved
// - Quick actions: Open | Share | Remove
// - Tag system (user can add custom tags)

// API:
// POST   /api/user/bookmarks        - Add bookmark
// DELETE /api/user/bookmarks/:id    - Remove bookmark
// GET    /api/user/bookmarks        - List all (with filters)
// PATCH  /api/user/bookmarks/:id    - Update tags
```

---

## 8. 📱 WhatsApp Subscription Manager

### WhatsApp OTP Verification Flow:
```typescript
// Step 1: User clicks "Add WhatsApp"
// Step 2: Enter +91 number (Indian format)
// Step 3: System sends OTP via Baileys/Twilio WhatsApp
// Step 4: User enters 6-digit OTP
// Step 5: Number verified, stored in MongoDB

// app/api/user/whatsapp/send-otp/route.ts
import { Baileys } from '@whiskeysockets/baileys';

export async function POST(req: Request) {
  const { phone } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in Redis with 5min expiry
  await redis.set(`whatsapp_otp:${phone}`, otp, 'EX', 300);
  
  // Send via WhatsApp
  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    text: `🔐 Your ishu.site verification code: *${otp}*\n\nValid for 5 minutes. Do not share.`
  });
  
  return Response.json({ success: true });
}
```

### Subscription Categories (What User Can Subscribe To):
```typescript
// CENTRAL EXAMS:
const SUBSCRIPTION_CATEGORIES = {
  UPSC: ['UPSC CSE', 'UPSC CDS', 'UPSC CAPF', 'UPSC NDA'],
  SSC: ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'SSC CPO'],
  BANKING: ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B'],
  RAILWAYS: ['RRB NTPC', 'RRB Group D', 'RRB JE', 'RRB ALP'],
  DEFENSE: ['NDA', 'CDS', 'AFCAT', 'Indian Navy', 'Indian Air Force'],
  ENGINEERING: ['JEE Main', 'JEE Advanced', 'GATE', 'ESE'],
  MEDICAL: ['NEET UG', 'NEET PG', 'AIIMS', 'JIPMER'],
  LAW: ['CLAT', 'AILET', 'SLAT'],
  MANAGEMENT: ['CAT', 'MAT', 'XAT', 'GMAT', 'SNAP'],
  TEACHING: ['CTET', 'TET', 'NTA NET', 'DSSSB'],
  STATE: ['Bihar', 'UP', 'Rajasthan', 'MP', 'Maharashtra', /* all 36 */],
};
```

### WhatsApp Message Template:
```
🎓 *[EXAM NAME] — NEW UPDATE*
━━━━━━━━━━━━━━━━━━━━
📋 Type: [Form/Admit Card/Result]
📅 Date: [Date]
🔗 Link: ishu.site/result/[id]
━━━━━━━━━━━━━━━━━━━━
📌 *Quick Info:*
• Vacancies: [N]
• Last Date: [Date]  
• Documents: 10th, 12th, Photo, Sign
━━━━━━━━━━━━━━━━━━━━
❌ Unsubscribe: ishu.site/unsubscribe
```

---

## 9. 📜 User Activity History

### `/activity` Page:
```typescript
// Timeline of everything user did on site
// Grouped by day with date headers
// Activity types with icons:
// 🛠️  Used PDF Merge tool (file: report.pdf → merged.pdf)
// 📰 Read news: "JEE Main 2025 Registration Opens"
// ⭐ Bookmarked: "SSC CGL Result 2025"
// 🎓 Added exam: UPSC CSE 2025
// 💬 WA verified: +91 8986985813
// 🏆 Badge earned: "PDF Explorer"
// 🔐 Login: Chrome on Windows (Delhi, IN)

// Filters: Date range | Activity type | Search
// Pagination (15 items per page)
// "Download activity report" → PDF export
```

---

## 10. 🛠️ Tool Usage History & Favorites

### Tool History Dashboard:
```typescript
// /tools/history
// Table view (TanStack Table):
// Columns: Tool | File Name | Date | Status | File Size | Download Again

// Features:
// - Re-download processed files (stored 24hrs in Cloudinary/S3)
// - Retry failed operations
// - File size analytics (donut chart)
// - Most used tool = shown with golden star
// - Usage count per tool
// - Monthly usage heatmap (D3.js)

// Favorite Tools:
// - Star icon on tool cards to favorite
// - Favorites shelf on tools page (pinned at top)
// - Max 10 favorites
```

---

## 11. 📰 Personalized News Feed

### User-Specific News Features:
```typescript
// /news (when logged in vs logged out):

// LOGGED OUT: Generic news feed
// LOGGED IN: 
// ✅ Based on preferred categories (from preferences)
// ✅ Based on followed states
// ✅ AI-powered "For You" section (based on reading history)
// ✅ "Following" tab: Only news from subscribed exam categories
// ✅ Read later queue (pocket-style)
// ✅ Reading progress tracker (% of articles read today)
// ✅ Daily digest email/WhatsApp at 8:00 AM IST
// ✅ "You might also like" based on reading patterns
```

---

## 12. 🎓 Exam Tracker & Result Alerts

### `/tracker` Page — Full Exam Management:
```typescript
// Add Exam Modal:
// - Search autocomplete from exam database
// - Auto-fill: exam date, apply date, result date
// - Custom notes field
// - Application number field (user fills)
// - Roll number (added later)

// Exam Card shows:
// - Exam name + logo/icon
// - Status (Upcoming / Applied / Appeared / Result Out)
// - Days remaining countdown (Framer Motion timer)
// - Important dates (open date, close date, exam date, result date)
// - Required documents list
// - Official website link
// - ishu.site result page link
// - Notes (editable inline)

// Calendar View:
// - Month view with exam dates marked
// - Color-coded by status
// - Click date → exam popup
// Library: react-big-calendar or FullCalendar

// Reminder System:
// - 30 days before: "Form closing soon"
// - 7 days before: "Exam in 1 week!"
// - Exam day: "All the best! 🎯"
// - Result day: "Result expected today!"
// Delivery: WhatsApp + Email + Browser Push notification
```

---

## 13. 🔒 Security & Settings Page

### `/settings` — Tabbed Interface:
```typescript
// Tab 1: Profile
// - Edit name, username, bio
// - Upload avatar (with crop tool - react-image-crop)
// - Upload cover image
// - Location (state, city)
// - Interests/Skills

// Tab 2: Account
// - Change email (Clerk managed)
// - Connected social accounts (Google, GitHub)
// - Delete account (with confirmation modal + type "DELETE")
// - Export data (GDPR compliant - JSON download)

// Tab 3: Notifications
// - Toggle each notification type
// - Email digest frequency (immediate/daily/weekly)
// - WhatsApp quiet hours (e.g., 10PM - 8AM)
// - Notification sound on/off

// Tab 4: Privacy
// - Profile visibility (public/private)
// - Activity visibility
// - Searchable by email (on/off)
// - Data collection preferences

// Tab 5: Security
// - Active sessions list (device, location, last active)
// - Revoke specific session
// - Revoke all other sessions
// - Login history (last 10 logins)
// - Two-factor authentication (via Clerk)

// Tab 6: Appearance
// - Theme (dark/light/system) with live preview
// - Accent color picker (6 options)
// - Font size (small/medium/large)
// - Animation intensity (full/reduced/none) for accessibility

// Tab 7: Subscription
// - Current plan details
// - Usage vs limits
// - Upgrade to Pro button
// - Billing history
// - Cancel subscription
```

---

## 14. 🤖 MCP (Model Context Protocol) Integration

### What is MCP for ishu.site?
MCP (Model Context Protocol) allows AI models (like Claude) to interact with your website's data and APIs programmatically. This enables AI-powered features throughout the site.

### MCP Server Setup:
```typescript
// packages/mcp-server/src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'ishu-site-mcp',
  version: '1.0.0',
}, {
  capabilities: { tools: {}, resources: {} }
});

// ===== MCP TOOLS =====

// Tool 1: Get user profile
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_user_profile',
      description: 'Get complete user profile from MongoDB',
      inputSchema: {
        type: 'object',
        properties: { userId: { type: 'string' } },
        required: ['userId']
      }
    },
    {
      name: 'get_exam_results',
      description: 'Search government exam results by name, state, year',
      inputSchema: {
        type: 'object',
        properties: {
          examName: { type: 'string' },
          state: { type: 'string' },
          year: { type: 'number' },
          type: { enum: ['result', 'form', 'admit_card', 'cutoff'] }
        }
      }
    },
    {
      name: 'get_news',
      description: 'Get latest news by category',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          language: { type: 'string' },
          limit: { type: 'number' }
        }
      }
    },
    {
      name: 'process_pdf',
      description: 'Process PDF files using available tools',
      inputSchema: {
        type: 'object',
        properties: {
          operation: { enum: ['merge', 'split', 'compress', 'convert'] },
          fileUrls: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    {
      name: 'send_whatsapp_notification',
      description: 'Send WhatsApp notification to subscribed users',
      inputSchema: {
        type: 'object',
        properties: {
          examId: { type: 'string' },
          message: { type: 'string' },
          targetCategory: { type: 'string' }
        }
      }
    },
    {
      name: 'add_exam_to_tracker',
      description: 'Add exam to user\'s tracker',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          examName: { type: 'string' },
          examDate: { type: 'string' }
        }
      }
    },
    {
      name: 'update_user_preferences',
      description: 'Update user notification preferences',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          preferences: { type: 'object' }
        }
      }
    },
    {
      name: 'get_analytics',
      description: 'Get site analytics (admin only)',
      inputSchema: {
        type: 'object',
        properties: {
          metric: { enum: ['daily_users', 'tool_usage', 'news_reads', 'exam_searches'] },
          dateRange: { type: 'string' }
        }
      }
    }
  ]
}));
```

### MCP Claude Integration in Profile:
```typescript
// AI-powered features using MCP:

// 1. "Ask AI about your exams" — Chatbot in profile
//    User: "Which exams should I apply for as a 12th pass student?"
//    AI uses MCP to fetch available exams, user's profile, recommendations

// 2. "Summarize my week" — Weekly digest via AI
//    AI fetches user's activity, bookmarks, exam dates → generates summary

// 3. "Smart Notification Drafts" — Admin uses AI to write WA messages
//    Admin: "Write a message about JEE Main form release"
//    AI generates formatted WA message template

// 4. "Document Assistant" — In PDF tools
//    User uploads PDF → AI analyzes → suggests best tools to use

// 5. "Exam Guidance" — Personalized study advice
//    Based on tracked exams → AI provides preparation tips via chat
```

### MCP Configuration File:
```json
// .mcp/config.json
{
  "mcpServers": {
    "ishu-site": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "env": {
        "MONGODB_URI": "${MONGODB_URI}",
        "REDIS_URL": "${REDIS_URL}",
        "ADMIN_API_KEY": "${ADMIN_API_KEY}"
      }
    }
  }
}
```

---

## 15. 📁 Complete Folder & File Structure

```
ishu.site/
├── .mcp/
│   └── config.json                    # MCP server config
│
├── app/                               # Next.js App Router
│   ├── (auth)/                        # Auth group (no main layout)
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx           # Clerk sign-in page (custom styled)
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx           # Clerk sign-up page (custom styled)
│   │
│   ├── (dashboard)/                   # Protected routes group
│   │   ├── layout.tsx                 # Dashboard layout (sidebar + header)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Main user dashboard
│   │   ├── profile/
│   │   │   ├── page.tsx               # User profile (public view)
│   │   │   └── edit/
│   │   │       └── page.tsx           # Edit profile form
│   │   ├── tracker/
│   │   │   └── page.tsx               # Exam tracker (kanban/calendar)
│   │   ├── saved/
│   │   │   └── page.tsx               # All bookmarks
│   │   ├── notifications/
│   │   │   └── page.tsx               # Notification center
│   │   ├── activity/
│   │   │   └── page.tsx               # User activity history
│   │   ├── tools/
│   │   │   └── history/
│   │   │       └── page.tsx           # Tool usage history
│   │   ├── whatsapp/
│   │   │   └── page.tsx               # WhatsApp manager
│   │   └── settings/
│   │       └── page.tsx               # Settings (all tabs)
│   │
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── clerk/
│   │   │       └── route.ts           # Clerk webhook handler
│   │   ├── user/
│   │   │   ├── profile/
│   │   │   │   └── route.ts           # GET/PUT /api/user/profile
│   │   │   ├── preferences/
│   │   │   │   └── route.ts           # GET/PUT preferences
│   │   │   ├── bookmarks/
│   │   │   │   └── route.ts           # CRUD bookmarks
│   │   │   ├── tracker/
│   │   │   │   └── route.ts           # CRUD exam tracker
│   │   │   ├── notifications/
│   │   │   │   └── route.ts           # GET/PATCH notifications
│   │   │   ├── activity/
│   │   │   │   └── route.ts           # GET activity log
│   │   │   ├── whatsapp/
│   │   │   │   ├── send-otp/
│   │   │   │   │   └── route.ts       # Send WA OTP
│   │   │   │   ├── verify-otp/
│   │   │   │   │   └── route.ts       # Verify WA OTP
│   │   │   │   └── subscriptions/
│   │   │   │       └── route.ts       # Manage WA subscriptions
│   │   │   └── upload-avatar/
│   │   │       └── route.ts           # Upload profile picture
│   │   │
│   │   └── sse/
│   │       └── notifications/
│   │           └── route.ts           # Server-Sent Events for real-time
│   │
│   └── (main)/                        # Public pages
│       ├── layout.tsx                 # Main layout (header + footer)
│       ├── page.tsx                   # Landing page
│       ├── result/                    # Result pages
│       ├── tools/                     # Tools pages
│       ├── news/                      # News page
│       ├── blog/                      # Blog page
│       ├── contact/                   # Contact page
│       └── about/                     # About page
│
├── components/
│   ├── auth/
│   │   ├── SignInModal.tsx
│   │   ├── SignUpModal.tsx
│   │   ├── WhatsAppVerification.tsx
│   │   └── AuthGuard.tsx
│   │
│   ├── profile/
│   │   ├── ProfileHero.tsx            # Banner + avatar section
│   │   ├── ProfileStats.tsx           # Animated stats cards
│   │   ├── ActivityGraph.tsx          # GitHub-style activity graph
│   │   ├── BadgeCollection.tsx        # User badges/achievements
│   │   ├── ExamTracker.tsx            # Kanban board
│   │   ├── BookmarkGrid.tsx           # Saved items masonry
│   │   ├── WhatsAppManager.tsx        # WA number management
│   │   └── EditProfileDrawer.tsx      # Edit profile slide drawer
│   │
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx       # Collapsible sidebar
│   │   ├── DashboardHeader.tsx        # Top bar with notifications
│   │   ├── QuickStats.tsx             # Hero metric cards
│   │   ├── ExamTimeline.tsx           # Upcoming exam timeline
│   │   ├── RecentTools.tsx            # Last used tools
│   │   ├── PersonalizedNews.tsx       # AI-filtered news
│   │   ├── VacancyMap.tsx             # India map widget
│   │   └── ProgressWidget.tsx         # Level/points/badges
│   │
│   ├── notifications/
│   │   ├── NotificationBell.tsx       # Header bell icon
│   │   ├── NotificationDropdown.tsx   # Quick preview
│   │   ├── NotificationCard.tsx       # Individual notification
│   │   └── NotificationCenter.tsx    # Full page
│   │
│   └── settings/
│       ├── SettingsTabs.tsx
│       ├── ProfileTab.tsx
│       ├── AccountTab.tsx
│       ├── NotificationsTab.tsx
│       ├── PrivacyTab.tsx
│       ├── SecurityTab.tsx
│       ├── AppearanceTab.tsx
│       └── SubscriptionTab.tsx
│
├── lib/
│   ├── mongodb.ts                     # MongoDB connection
│   ├── redis.ts                       # Redis connection
│   ├── clerk.ts                       # Clerk server utilities
│   ├── cloudinary.ts                  # Image upload
│   ├── whatsapp.ts                    # Baileys WA client
│   ├── notifications.ts               # Notification service
│   ├── analytics.ts                   # Event tracking
│   └── gamification.ts               # Points/badges logic
│
├── models/
│   ├── User.ts                        # Main user model
│   ├── ExamTracker.ts                 # Exam tracking
│   ├── Bookmark.ts                    # Saved items
│   ├── Notification.ts               # Notification records
│   ├── Activity.ts                    # Activity log
│   └── WhatsAppSubscription.ts       # WA subscriptions
│
├── hooks/
│   ├── useUser.ts                     # Current user data hook
│   ├── useProfile.ts                  # Profile management
│   ├── useNotifications.ts            # Realtime notifications
│   ├── useBookmarks.ts               # Bookmark operations
│   ├── useExamTracker.ts             # Exam CRUD
│   ├── useWhatsApp.ts                # WA verification
│   └── useActivity.ts                # Activity logging
│
├── stores/
│   ├── userStore.ts                   # Zustand user state
│   ├── notificationStore.ts           # Notification state
│   └── uiStore.ts                     # UI preferences (theme, sidebar)
│
├── packages/
│   └── mcp-server/
│       ├── src/
│       │   ├── index.ts               # MCP server entry
│       │   ├── tools/
│       │   │   ├── userTools.ts       # User-related MCP tools
│       │   │   ├── examTools.ts       # Exam search/result tools
│       │   │   ├── newsTools.ts       # News query tools
│       │   │   ├── pdfTools.ts        # PDF processing tools
│       │   │   └── notifyTools.ts     # Notification tools
│       │   └── resources/
│       │       └── examDatabase.ts    # Static exam data
│       ├── package.json
│       └── tsconfig.json
│
└── types/
    ├── user.ts                        # User TypeScript types
    ├── exam.ts                        # Exam types
    ├── notification.ts               # Notification types
    └── global.ts                      # Global type augmentations
```

---

## 16. 🗄️ Database Schema — User Collections

### MongoDB Collections:

#### users Collection:
```javascript
// Full schema (see Section 3 for TypeScript interface)
{
  _id: ObjectId,
  clerkId: "user_2abc123",        // Index: unique
  email: "user@gmail.com",        // Index: unique
  username: "ishu_student",       // Index: unique, sparse
  firstName: "Ishu",
  lastName: "Kumar",
  avatar: "https://cloudinary.com/...",
  coverImage: "https://...",
  bio: "UPSC aspirant | JEE 2025",
  phone: "+91XXXXXXXXXX",
  whatsappNumber: "+91XXXXXXXXXX",
  whatsappVerified: true,
  location: { state: "Bihar", city: "Patna", pincode: "800001" },
  role: "user",
  subscription: { plan: "free", status: "active" },
  preferences: { language: "hi", theme: "dark", notifications: {...} },
  trackedExams: [...],
  bookmarks: [...],
  stats: { toolsUsed: 47, points: 2450, level: 8, badges: [...] },
  isActive: true,
  lastSeen: ISODate("2026-03-11"),
  createdAt: ISODate("2026-01-01")
}
```

#### activities Collection:
```javascript
{
  _id: ObjectId,
  userId: "user_2abc123",         // Index
  type: "tool_used",
  data: {
    toolName: "PDF Merge",
    toolId: "pdf-merge",
    fileName: "report.pdf",
    fileSize: 2048576,
    success: true
  },
  ip: "103.x.x.x",
  userAgent: "Chrome/123",
  location: "Bihar, India",
  createdAt: ISODate("2026-03-11") // TTL index: 90 days
}
```

#### notifications Collection:
```javascript
{
  _id: ObjectId,
  userId: "user_2abc123",         // Index
  type: "exam_alert",
  title: "SSC CGL Form 2025 Released!",
  body: "Apply before April 30, 2025",
  data: { examId: "ssc-cgl-2025", url: "/result/ssc-cgl-2025" },
  channels: ["whatsapp", "email", "push"],
  isRead: false,
  readAt: null,
  createdAt: ISODate("2026-03-11") // TTL index: 30 days
}
```

#### whatsapp_subscriptions Collection:
```javascript
{
  _id: ObjectId,
  userId: "user_2abc123",
  phone: "+918986985813",
  verified: true,
  verifiedAt: ISODate("2026-01-15"),
  subscriptions: {
    categories: ["SSC", "UPSC", "JEE"],
    exams: ["ssc-cgl", "upsc-cse", "jee-main"],
    states: ["Bihar", "Jharkhand"],
    quietHours: { start: "22:00", end: "08:00", timezone: "Asia/Kolkata" }
  },
  isPaused: false,
  totalSent: 156,
  lastMessage: ISODate("2026-03-10")
}
```

---

## 17. 🔌 API Endpoints — All User Routes

```typescript
// ===== USER PROFILE =====
GET    /api/user/profile              → Get current user's profile
PUT    /api/user/profile              → Update profile
POST   /api/user/upload-avatar        → Upload profile picture
DELETE /api/user/account              → Delete account (soft delete)
GET    /api/user/export               → Export all user data (GDPR)

// ===== EXAM TRACKER =====
GET    /api/user/tracker              → Get all tracked exams
POST   /api/user/tracker              → Add exam to tracker
PUT    /api/user/tracker/:id          → Update exam (status, notes)
DELETE /api/user/tracker/:id          → Remove from tracker

// ===== BOOKMARKS =====
GET    /api/user/bookmarks            → Get all bookmarks (with filters)
POST   /api/user/bookmarks            → Add bookmark
PUT    /api/user/bookmarks/:id        → Update tags
DELETE /api/user/bookmarks/:id        → Remove bookmark
GET    /api/user/bookmarks/check/:id  → Check if item is bookmarked

// ===== NOTIFICATIONS =====
GET    /api/user/notifications        → Get notifications (paginated)
PATCH  /api/user/notifications/:id    → Mark as read
PATCH  /api/user/notifications/all    → Mark all as read
DELETE /api/user/notifications/clear  → Clear all
GET    /api/sse/notifications         → SSE stream for real-time

// ===== WHATSAPP =====
POST   /api/user/whatsapp/send-otp    → Send OTP to WA number
POST   /api/user/whatsapp/verify-otp  → Verify OTP
GET    /api/user/whatsapp/subscriptions → Get subscriptions
PUT    /api/user/whatsapp/subscriptions → Update subscriptions
DELETE /api/user/whatsapp/disconnect   → Remove WA number

// ===== ACTIVITY =====
GET    /api/user/activity             → Get activity log (paginated)
POST   /api/user/activity             → Log new activity (internal)

// ===== PREFERENCES =====
GET    /api/user/preferences          → Get all preferences
PUT    /api/user/preferences          → Update preferences

// ===== STATS & GAMIFICATION =====
GET    /api/user/stats                → Get user stats
POST   /api/user/stats/increment      → Increment a stat counter
GET    /api/user/badges               → Get earned + available badges
```

---

## 18. 📦 All Libraries & Tools to Use

### Authentication & User Management:
```
@clerk/nextjs ^5.0             - Core auth
@clerk/themes                  - Custom Clerk UI themes  
svix                           - Webhook verification
firebase                       - Alternative phone auth for India
```

### Database:
```
mongoose ^8.0                  - MongoDB ODM
@upstash/redis                 - Redis (Upstash - serverless)
@upstash/ratelimit             - Rate limiting
```

### Real-time:
```
socket.io ^4.7                 - WebSocket server
socket.io-client               - Client-side socket
eventsource                    - SSE (Server-Sent Events) fallback
```

### Image Upload:
```
@cloudinary/next ^2.0          - Cloudinary integration
react-dropzone ^14.0           - Drag & drop uploads
react-image-crop               - Avatar cropping tool
browser-image-compression      - Client-side compression
```

### WhatsApp:
```
@whiskeysockets/baileys        - WhatsApp Web API (free)
qrcode                         - QR code for WA auth
twilio                         - Twilio WA Business API (paid)
```

### Animations (ALL of these):
```
framer-motion ^11              - Page transitions, gestures
gsap ^3.12                     - ScrollTrigger, timeline
@gsap/react                    - GSAP React hooks
lottie-react ^2.4              - Lottie JSON animations
react-spring ^9.7              - Physics animations
@react-three/fiber ^8.16       - Three.js in React
@react-three/drei ^9.109       - Three.js helpers
@react-three/postprocessing    - Visual effects (bloom, glitch)
vanta ^0.5.24                  - Animated backgrounds
tsparticles + react-tsparticles - Particle effects
react-parallax-tilt            - Card tilt hover
react-countup ^6.5             - Number counters
auto-animate ^0.8              - Auto list animations
```

### UI Components:
```
@radix-ui/react-*              - Accessible primitives
shadcn/ui                      - Component library
aceternity-ui                  - Premium animated components
@headlessui/react              - Unstyled components
react-hot-toast                - Toast notifications
sonner                         - Modern toasts
vaul                           - Drawer component
cmdk                           - Command palette (⌘K)
embla-carousel-react           - Carousel/slider
react-resizable-panels         - Split pane layouts
```

### Forms:
```
react-hook-form ^7.54          - Form management
zod ^3.23                      - Schema validation
@hookform/resolvers            - Zod integration
```

### Data Display:
```
@tanstack/react-table ^8.21   - Data tables
@tanstack/react-virtual ^3.10  - Virtualization
react-masonry-css              - Masonry grid layout
react-big-calendar             - Calendar component
```

### Charts & Visualization:
```
recharts ^2.12                 - Charts
d3 ^7.9                        - Custom SVG visualizations
nivo                           - Beautiful charts
```

### State Management:
```
zustand ^5.0                   - Global state
@tanstack/react-query ^5.62   - Server state
jotai ^2.10                    - Atomic state
```

### Drag & Drop:
```
@dnd-kit/core                  - DnD kit core
@dnd-kit/sortable              - Sortable lists (exam tracker)
@dnd-kit/utilities             - Utility helpers
```

### Utilities:
```
date-fns ^3.6                  - Date manipulation
dayjs ^1.11                    - Lightweight dates
clsx + tailwind-merge          - Class merging
lodash-es                      - Utility functions
axios ^1.7                     - HTTP client
uuid ^10.0                     - Unique IDs
```

### Notifications:
```
web-push                       - Browser push notifications
@upstash/qstash                - Serverless message queue
bullmq + ioredis               - Job queue for WA messages
```

### MCP:
```
@modelcontextprotocol/sdk      - Official MCP SDK
zod                            - Tool schema validation
```

### Email:
```
nodemailer                     - Email sending
@sendgrid/mail                 - SendGrid API
react-email                    - Email template components
@react-email/components        - Pre-built email components
```

### Analytics & Monitoring:
```
posthog-js                     - User analytics
@sentry/nextjs                 - Error tracking
@vercel/analytics              - Vercel analytics
```

### SEO:
```
next-seo                       - SEO meta tags
next-sitemap                   - Auto sitemap
```

---

## 19. 🎬 Animation & 3D Strategy for User Pages

### Profile Page Animations:
```typescript
// 1. Cover photo parallax on scroll (Framer Motion + useScroll)
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 150]); // parallax

// 2. Avatar entrance (scale + spring)
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 200, damping: 20 }}

// 3. Stats cards stagger reveal
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } };

// 4. Activity graph draw animation (D3 + Framer Motion)
// Each cell animates in with delay based on position

// 5. Badge 3D tilt (react-parallax-tilt)
<Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable glareMaxOpacity={0.3}>
  <BadgeCard />
</Tilt>
```

### Dashboard Animations:
```typescript
// 1. Sidebar slide in on mount
initial={{ x: -300 }} animate={{ x: 0 }} transition={{ type: "spring" }}

// 2. Widget cards stagger entrance (GSAP ScrollTrigger)
gsap.from(".widget-card", {
  y: 100, opacity: 0, duration: 0.8,
  stagger: 0.15, ease: "power3.out",
  scrollTrigger: { trigger: ".dashboard-grid", start: "top 80%" }
});

// 3. Notification bell shake animation (CSS keyframes)
@keyframes bell-shake {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

// 4. Exam countdown timer (Framer Motion AnimatePresence for digits)

// 5. India map state hover glow (Three.js + postprocessing bloom)
```

### Sign-In / Sign-Up Page Animations:
```typescript
// 1. 3D floating geometric shapes (Three.js + @react-three/fiber)
// Torus, octahedron, icosahedron floating with rotation

// 2. Gradient mesh background (CSS + GSAP color interpolation)

// 3. Form field focus animations (Framer Motion layout)

// 4. Social login button hover (spring bounce)

// 5. Password strength indicator (animated bar with color transition)
// Weak=red, Fair=orange, Strong=green — animated width

// 6. Success state (Lottie checkmark animation on sign-in)
```

---

## 20. 🔐 Security & Privacy Architecture

### Security Layers:
```typescript
// 1. Route Protection (Clerk middleware) — Already covered

// 2. API Rate Limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '10 s'), // 20 req per 10s
});

// 3. Input Sanitization
import DOMPurify from 'isomorphic-dompurify';
const safeInput = DOMPurify.sanitize(userInput);

// 4. WhatsApp OTP Security
// - OTP stored in Redis with 5min TTL
// - Max 3 attempts per phone per hour
// - Rate limit: 1 OTP per 60 seconds per number

// 5. File Upload Security
// - Validate file type (magic bytes, not just extension)
// - Max file size: 50MB
// - Scan with ClamAV before processing
// - Store in private S3/Cloudinary (not public)

// 6. Session Security
// - Clerk handles JWT rotation automatically
// - Custom logout: invalidates all active sessions
// - Suspicious login detection (new country/device → notify user)

// 7. Data Privacy
// - User can export all data (GDPR compliant)
// - User can delete account → cascade delete all data
// - Activity logs auto-deleted after 90 days (TTL index)
// - Notification records auto-deleted after 30 days
```

---

## 21. 🧠 AI-Powered Features for Users

### Feature 1: AI Exam Assistant (Chat)
```typescript
// /dashboard → "Ask AI" button → modal chat
// Powered by: Claude API (via MCP) or OpenAI

// System prompt:
const SYSTEM_PROMPT = `
You are an expert guide for Indian government job aspirants.
User's profile: ${JSON.stringify(userProfile)}
Tracked exams: ${JSON.stringify(trackedExams)}
Your job: Give personalized exam advice, study tips, application guidance.
Always respond in the user's preferred language: ${userLanguage}.
Keep responses concise and actionable.
`;

// Use cases:
// - "Which form should I fill for 12th pass student?"
// - "Summarize SSC CGL syllabus"
// - "What documents do I need for NEET?"
// - "When is the next UPSC notification?"
```

### Feature 2: Smart Notification Writer (Admin)
```typescript
// Admin creates WA notification → AI writes the message
// POST /api/admin/ai/write-notification
{
  "examName": "SSC CGL 2025",
  "eventType": "form_released",
  "deadline": "2025-04-30"
}
// → AI returns formatted WA message with emoji, key info
```

### Feature 3: Personalized News Ranking
```typescript
// Based on:
// - User's read history (what they click)
// - Tracked exams
// - Followed states
// - Time of day (morning news vs evening news)
// Algorithm: Collaborative filtering + content-based filtering
// Optional: Use embedding model to match news to user interests
```

### Feature 4: PDF Smart Analysis
```typescript
// User uploads PDF → AI analyzes content
// Returns: Document type, language, page count, key entities
// Suggests: Which PDF tool to use next
// Example: "This looks like a form. Use PDF Filler tool!"
```

---

## 22. 📋 Step-by-Step Implementation Prompts

### PROMPT 1: Custom Clerk Sign-Up Page (India-Ready)
```
Create a custom Next.js 14 + TypeScript Clerk sign-up page.
Location: app/(auth)/sign-up/[[...sign-up]]/page.tsx

Requirements:
- Use <SignUp> from @clerk/nextjs with appearance prop (dark theme)
- Remove phone field (disabled in Clerk dashboard)
- Add: Email, Google OAuth, GitHub OAuth
- Background: Three.js animated 3D particle field (@react-three/fiber)
- Left side: 3D floating geometric shapes (Torus, Icosahedron in blue/purple)
- Right side: Clerk SignUp component with custom glassmorphism styling
- After sign-up: redirect to /dashboard
- After sign-up: trigger webhook → POST /api/webhooks/clerk
- Framer Motion entrance animation for the card
- Fully responsive (stack vertically on mobile)
- Reference design: Vercel.com sign-up + Clerk.com aesthetic
- Dark theme (#0a0a0a background, blue-500 accents)
```

### PROMPT 2: User Profile Page
```
Create a world-class user profile page for ishu.site.
Location: app/(dashboard)/profile/page.tsx

Tech Stack: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Three.js

Section 1 - HERO BANNER:
- Full-width cover image (uploadable, default gradient)
- Parallax scroll effect using Framer Motion useScroll/useTransform
- Profile avatar: 120px circle, animated glowing ring (CSS animation)
- Avatar upload: react-dropzone + Cloudinary upload
- Name, @username, joined date, verified badge (Lottie animation)
- Animated stats: [Tools Used] [PDFs Processed] [Points] using react-countup

Section 2 - STATS GRID:
- 6 glassmorphism cards in 3x2 grid
- Each card: icon, label, animated number (react-countup on viewport enter)
- Hover: react-parallax-tilt effect
- Framer Motion stagger entrance (0.1s delay between cards)

Section 3 - ACTIVITY GRAPH:
- GitHub-style contribution heatmap
- 52 weeks × 7 days SVG grid
- Color: opacity based on activity count (blue theme)
- Hover tooltip: "March 11, 2026 — 8 activities"
- Built with D3.js + Framer Motion cell animations
- Toggle buttons: Tools | News | Total

Section 4 - BADGE COLLECTION:
- Horizontal scrollable shelf
- 3D tilt effect (react-parallax-tilt) on each badge
- Locked badges shown with blur + lock icon
- Badge click → modal with description and progress
- Badges: PDF Master, News Junkie, Exam Ready, 7-Day Streak, etc.

Section 5 - RECENT BOOKMARKS:
- 3-column masonry grid (react-masonry-css)
- Cards with thumbnail, title, date, remove button
- Tab filter: Results | News | Tools

All sections: dark theme (#0d0d0d), blue gradient accents, smooth transitions
Reference: GitHub profile + Linear.app + Vercel dashboard
```

### PROMPT 3: WhatsApp OTP Verification Component
```
Create a WhatsApp number verification flow for ishu.site.
Location: components/profile/WhatsAppManager.tsx

UI:
- Large card with WhatsApp green (#25D366) accent
- If not verified: "Add WhatsApp" state
  - Phone input: Indian flag (+91) prefix selector
  - Input: numeric only, 10 digits
  - "Send OTP" button (animated loading state)
  - OTP input: 6 individual digit boxes (auto-advance on type)
  - 60-second countdown to resend
  - Verify button
- If verified: "Connected" state  
  - Shows masked number (+91 XXXXX XX813)
  - Subscription toggles (checkboxes for exam categories)
  - "Change number" option
  - "Pause all notifications" toggle

Backend API:
POST /api/user/whatsapp/send-otp
- Validate Indian phone number (+91, 10 digits)
- Generate 6-digit OTP
- Store in Redis with key `wa_otp:{phone}`, TTL: 300s
- Send via Baileys: sock.sendMessage(`${phone}@s.whatsapp.net`, { text: ... })
- Return: { success: true, expiresIn: 300 }

POST /api/user/whatsapp/verify-otp
- Get OTP from Redis
- Compare with submitted OTP (bcrypt.compare if hashed)
- If match: update user.whatsappNumber and user.whatsappVerified in MongoDB
- Delete OTP from Redis
- Log activity
- Return: { success: true }

Animations: Framer Motion for state transitions (not-verified → verifying → verified)
```

### PROMPT 4: Exam Tracker Kanban Board
```
Create an exam tracker with kanban board for ishu.site.
Location: app/(dashboard)/tracker/page.tsx

Kanban Columns: 
1. "📅 Upcoming" — Exams not yet applied
2. "📝 Applied" — Applied, waiting for admit card
3. "🎯 Appeared" — Attended exam, waiting for result  
4. "✅ Result Out" — Result declared

Features:
- Drag & drop cards between columns (@dnd-kit/core + @dnd-kit/sortable)
- Add Exam: searchable autocomplete from exam database + custom entry
- Exam Card: name, logo, exam date countdown, status badge, application number, notes
- Click card → detailed modal (full exam info, required docs, links)
- Calendar view toggle (react-big-calendar) 
- Reminder setup per exam (notification preferences)
- Delete with swipe gesture (Framer Motion drag-to-delete on mobile)
- Empty state: Beautiful illustration + "Add your first exam" CTA

API:
GET    /api/user/tracker         — List all tracked exams
POST   /api/user/tracker         — Add exam
PATCH  /api/user/tracker/:id     — Update (status change, add notes)
DELETE /api/user/tracker/:id     — Remove

Animations:
- Column header: gradient accent border
- Card entrance: Framer Motion scale + opacity  
- Drag shadow: elevation effect while dragging
- Status change: color flash animation
Dark theme, fully responsive (stack columns vertically on mobile)
```

### PROMPT 5: Real-time Notification System
```
Create a real-time notification system for ishu.site.

Part 1 - Notification Bell (Header):
Location: components/notifications/NotificationBell.tsx
- Bell icon (Lucide) with animated badge showing unread count
- Badge: red circle, bounces when new notification arrives
- Bell shakes with CSS keyframe animation on new notification
- Dropdown on click: last 5 notifications
- "Mark all read" button
- "View all" link → /notifications

Part 2 - SSE (Server-Sent Events) for Real-time:
Location: app/api/sse/notifications/route.ts
- Stream: text/event-stream
- Auth: verify Clerk session
- Subscribe to Redis pub/sub for user's channel
- Send heartbeat every 30s
- Send notification events as: data: { type, title, body, url }

Part 3 - Client SSE Hook:
Location: hooks/useNotifications.ts
- Connect to /api/sse/notifications on mount
- EventSource with reconnect on disconnect
- Update Zustand store on new notification
- Show toast (sonner) for real-time notifications

Part 4 - Full Notifications Page:
Location: app/(dashboard)/notifications/page.tsx
- List all notifications (paginated, 20 per page)
- Grouped by date (Today, Yesterday, This Week)
- Click notification → navigate to relevant page + mark as read
- Filter by type (exam, news, tool, security, badge)
- Bulk actions: mark all read, clear all
- Empty state with Lottie animation

Notification types with icons:
🎓 exam_alert (blue), 📰 news (gray), 🛠️ tool (purple),
🔐 security (red), 🏆 badge (gold), 📢 announcement (green)
```

### PROMPT 6: Gamification System
```
Create a gamification/points system for ishu.site.
Location: lib/gamification.ts + components/profile/BadgeCollection.tsx

POINTS SYSTEM:
- Use PDF tool: +2 points
- Read news article: +1 point  
- Add exam to tracker: +5 points
- Daily login: +3 points
- Share a bookmark: +2 points
- Complete profile: +20 points
- Verify WhatsApp: +10 points
- Refer a friend: +50 points (future)

LEVELS (1-100):
Level 1: 0-100 pts       (Beginner)
Level 10: 1000-1500 pts  (Explorer)
Level 25: 5000-7000 pts  (Achiever)
Level 50: 20000+ pts     (Champion)
Level 100: 100000+ pts   (Legend)

BADGES (Unlockable):
ID              | Name           | Criteria
pdf_5           | PDF Starter    | Use 5 PDF tools
pdf_50          | PDF Master     | Use 50 PDF tools
news_100        | News Follower  | Read 100 news
news_1000       | News Junkie    | Read 1000 news
exam_1          | Exam Ready     | Track 1 exam
exam_10         | Exam Champion  | Track 10 exams
streak_7        | Week Warrior   | 7-day login streak
streak_30       | Month Master   | 30-day login streak
profile_complete| All About Me   | 100% profile complete
wa_verified     | Connected      | Verify WhatsApp
early_adopter   | Pioneer        | Among first 1000 users

Badge UI:
- SVG badge designs with gradient colors
- 3D perspective on hover (react-parallax-tilt)
- Locked = grayscale + lock overlay
- Unlocked = color + particle burst animation (tsparticles)
- New badge: full-screen celebration modal (Lottie confetti)
```

---

## 23. 🚀 Deployment & Environment Variables

### Complete `.env.local` File:
```bash
# ============================
# CLERK (Authentication)
# ============================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
# Admin Clerk IDs (comma-separated)
ADMIN_CLERK_IDS=user_2abc123,user_2xyz456

# ============================
# FIREBASE (India Phone Auth)
# ============================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ishu-site.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ishu-site

# ============================
# DATABASE
# ============================
MONGODB_URI=mongodb+srv://ishu:password@cluster.mongodb.net/ishu_site
REDIS_URL=redis://default:password@host:6379
# OR Upstash (serverless, recommended for Vercel):
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx

# ============================
# WHATSAPP (Baileys)
# ============================
WA_SESSION_PATH=./wa-sessions
WA_AUTH_INFO_PATH=./wa-auth

# ============================
# TWILIO (Backup WA/SMS)
# ============================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# ============================
# CLOUDINARY (Images)
# ============================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ishu-site
CLOUDINARY_API_KEY=xxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxx

# ============================
# EMAIL
# ============================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ishukryk@gmail.com
SMTP_PASS=your-app-password-here
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# ============================
# WEB PUSH NOTIFICATIONS
# ============================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxA
VAPID_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_SUBJECT=mailto:ishukryk@gmail.com

# ============================
# AI / MCP
# ============================
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# ============================
# ANALYTICS
# ============================
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxxxx
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ============================
# SITE
# ============================
NEXT_PUBLIC_SITE_URL=https://ishu.site
NEXT_PUBLIC_SITE_NAME=ishu.site

# ============================
# ADMIN
# ============================
ADMIN_ROUTE_SECRET=your-super-secret-admin-key-here
MCP_ADMIN_API_KEY=your-mcp-api-key-here
```

### Clerk Dashboard Settings to Fix India Phone Issue:
```
1. Go to: https://dashboard.clerk.com
2. Select your application
3. Go to: User & Authentication → Email, Phone, Username
4. DISABLE: "Phone number" (turn off completely)
5. ENABLE: "Email address" (required)  
6. ENABLE: Google OAuth (Social connections)
7. ENABLE: GitHub OAuth (optional)
8. Save changes

This completely removes the India phone restriction issue.
WhatsApp will be handled separately via your own Baileys integration.
```

### Vercel Deployment Checklist:
```bash
# 1. Install dependencies
npm install @clerk/nextjs @whiskeysockets/baileys mongoose 
npm install framer-motion gsap @react-three/fiber @react-three/drei
npm install zustand @tanstack/react-query socket.io-client
npm install react-hot-toast sonner react-dropzone
npm install @upstash/redis @upstash/ratelimit
npm install lottie-react react-countup react-parallax-tilt
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-masonry-css react-big-calendar
npm install @modelcontextprotocol/sdk
npm install web-push nodemailer @sendgrid/mail
npm install d3 recharts

# 2. Add all env vars to Vercel dashboard

# 3. Clerk webhook in Vercel:
#    Clerk Dashboard → Webhooks → Add endpoint
#    URL: https://ishu.site/api/webhooks/clerk
#    Events: user.created, user.updated, user.deleted

# 4. MongoDB: Allow Vercel IPs (0.0.0.0/0 for simplicity)

# 5. Deploy:
git add . && git commit -m "feat: auth + profile system" && git push
```

---

## 🎯 Priority Order — What to Build First

```
Week 1: Foundation
  ✅ Fix Clerk (disable phone, enable Google OAuth)
  ✅ Webhook → auto-create MongoDB user on sign-up
  ✅ Basic dashboard layout (sidebar + header)
  ✅ Basic profile page (hero + stats)

Week 2: Core Profile
  ✅ Avatar upload (Cloudinary)
  ✅ Edit profile drawer
  ✅ Settings page (all tabs)
  ✅ WhatsApp OTP verification

Week 3: Exam Tracker  
  ✅ Add/Edit/Delete exams
  ✅ Kanban board with drag & drop
  ✅ Calendar view
  ✅ Exam countdown widgets

Week 4: Notifications & Real-time
  ✅ SSE for real-time notifications
  ✅ Notification center page
  ✅ WhatsApp message sending
  ✅ Exam alert system

Week 5: Gamification & Polish
  ✅ Points system
  ✅ Badges/achievements
  ✅ Activity graph
  ✅ All animations (Framer Motion + GSAP)
  ✅ 3D effects (Three.js)
  ✅ MCP server setup

Week 6: AI Features
  ✅ AI exam assistant chat
  ✅ Personalized news feed  
  ✅ Smart notification writer (admin)
  ✅ PDF smart analysis
```

---

## 📞 Project Owner Contact

| Method | Details |
|--------|---------|
| 📱 Mobile | 8986985813 |
| 📧 Email | ishukryk@gmail.com |
| 💬 WhatsApp | 8986985813 |
| 🐙 GitHub | https://github.com/ISHUKR41/ishu.site.git |

---

*This document is the complete blueprint for the post-login user experience on ishu.site. Every feature, file, library, and API endpoint is documented here. Start with Week 1 priorities and work through systematically. The MCP server enables AI-powered features across the entire platform.*

**Document Version:** 2.0.0  
**Created:** 2026-03-11  
**Status:** Ready for Implementation 🚀

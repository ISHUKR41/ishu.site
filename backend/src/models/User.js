/**
 * User.js — MongoDB User Model (Complete Schema)
 * 
 * This is the SINGLE SOURCE OF TRUTH for all user data in MongoDB.
 * Clerk handles authentication — this model stores everything else:
 * profile info, preferences, stats, subscriptions, bookmarks, etc.
 * 
 * The `clerkId` field links this MongoDB document to the Clerk user.
 * When a user signs up via Clerk, a webhook creates this document automatically.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // ══════════════════════════════════════════════════════
    // IDENTITY — Synced from Clerk on sign-up/update
    // ══════════════════════════════════════════════════════
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        // This is the PRIMARY LINK between Clerk auth and MongoDB data
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    firstName: { type: String, default: '', trim: true },
    lastName: { type: String, default: '', trim: true },
    username: {
        type: String,
        unique: true,
        sparse: true, // Allows null — not everyone sets a username immediately
        lowercase: true,
        trim: true,
    },
    avatar: { type: String, default: '' },          // Profile picture URL (Cloudinary/Clerk)
    coverImage: { type: String, default: '' },       // Banner photo URL
    bio: { type: String, default: '', maxlength: 160 }, // Short bio

    // ══════════════════════════════════════════════════════
    // CONTACT INFO
    // ══════════════════════════════════════════════════════
    phone: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    whatsappVerified: { type: Boolean, default: false },
    location: {
        state: { type: String, default: '' },
        city: { type: String, default: '' },
        pincode: { type: String, default: '' },
    },

    // ══════════════════════════════════════════════════════
    // ROLE & PERMISSIONS
    // ══════════════════════════════════════════════════════
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin', 'superadmin'],
        default: 'user',
    },
    permissions: [{ type: String }],

    // ══════════════════════════════════════════════════════
    // SUBSCRIPTION
    // ══════════════════════════════════════════════════════
    subscription: {
        plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
        status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
        startDate: { type: Date },
        endDate: { type: Date },
    },

    // ══════════════════════════════════════════════════════
    // PREFERENCES — User-configurable settings
    // ══════════════════════════════════════════════════════
    preferences: {
        language: { type: String, default: 'en' },
        theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
        notifications: {
            email: { type: Boolean, default: true },
            whatsapp: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
            examAlerts: { type: Boolean, default: true },
            newsDigest: { type: Boolean, default: true },
            toolUpdates: { type: Boolean, default: false },
        },
        newsCategories: [{ type: String }],
        examTypes: [{ type: String }],
        states: [{ type: String }],
    },

    // ══════════════════════════════════════════════════════
    // EXAM TRACKER — Exams user is tracking
    // ══════════════════════════════════════════════════════
    trackedExams: [{
        examName: { type: String, required: true },
        status: {
            type: String,
            enum: ['upcoming', 'applied', 'appeared', 'result_out'],
            default: 'upcoming',
        },
        applicationNumber: { type: String, default: '' },
        rollNumber: { type: String, default: '' },
        examDate: { type: Date },
        resultDate: { type: Date },
        notes: { type: String, default: '' },
        addedAt: { type: Date, default: Date.now },
    }],

    // ══════════════════════════════════════════════════════
    // BOOKMARKS — Saved items
    // ══════════════════════════════════════════════════════
    bookmarks: [{
        type: { type: String, enum: ['result', 'news', 'blog', 'tool', 'vacancy'] },
        itemId: { type: String },
        title: { type: String },
        url: { type: String },
        thumbnail: { type: String, default: '' },
        savedAt: { type: Date, default: Date.now },
    }],

    // ══════════════════════════════════════════════════════
    // TOOL HISTORY — PDF tools usage log
    // ══════════════════════════════════════════════════════
    toolHistory: [{
        toolId: { type: String },
        toolName: { type: String },
        usedAt: { type: Date, default: Date.now },
        fileCount: { type: Number, default: 1 },
        success: { type: Boolean, default: true },
    }],
    favoriteTools: [{ type: String }],

    // ══════════════════════════════════════════════════════
    // STATS & GAMIFICATION
    // ══════════════════════════════════════════════════════
    stats: {
        toolsUsed: { type: Number, default: 0 },
        pdfProcessed: { type: Number, default: 0 },
        newsRead: { type: Number, default: 0 },
        blogsRead: { type: Number, default: 0 },
        examsTracked: { type: Number, default: 0 },
        loginStreak: { type: Number, default: 0 },
        lastLogin: { type: Date, default: Date.now },
        totalLogins: { type: Number, default: 1 },
        points: { type: Number, default: 0 },
        badges: [{ type: String }],
        level: { type: Number, default: 1 },
    },

    // ══════════════════════════════════════════════════════
    // NOTIFICATION TRACKING — IDs of notifications user has read
    // (since notifications are computed dynamically, we track read state here)
    // ══════════════════════════════════════════════════════
    readNotificationIds: [{ type: String }],

    // ══════════════════════════════════════════════════════
    // METADATA
    // ══════════════════════════════════════════════════════
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: '' },
    lastSeen: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

// ──────────────────────────────────────────────────────────
// INDEXES for fast queries
// ──────────────────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.points': -1 }); // Leaderboard queries
userSchema.index({ lastSeen: -1 });         // Recently active users

// ──────────────────────────────────────────────────────────
// VIRTUAL: Full name computed from first + last
// ──────────────────────────────────────────────────────────
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);

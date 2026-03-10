/**
 * userRoutes.js — User Profile & Settings API Routes
 * 
 * All routes under /api/user/
 * 
 * Protected routes (require Clerk JWT):
 *   GET    /api/user/profile            — Get current user's profile
 *   PUT    /api/user/profile            — Update profile fields
 *   GET    /api/user/stats              — Get user stats
 *   GET    /api/user/preferences        — Get preferences
 *   PUT    /api/user/preferences        — Update preferences
 *   GET    /api/user/bookmarks          — Get bookmarks (with ?type filter)
 *   POST   /api/user/bookmarks          — Add bookmark
 *   DELETE /api/user/bookmarks/:itemId  — Remove bookmark
 *   GET    /api/user/tracker            — Get tracked exams
 *   POST   /api/user/tracker            — Add exam
 *   PUT    /api/user/tracker/:examId    — Update exam
 *   DELETE /api/user/tracker/:examId    — Remove exam
 *   GET    /api/user/notifications      — Get notifications
 *   PATCH  /api/user/notifications/read-all — Mark all as read
 *   PATCH  /api/user/notifications/:id  — Mark one as read
 *   DELETE /api/user/notifications/clear — Clear all
 *   GET    /api/user/tool-history       — Get tool usage history
 *   GET    /api/user/activity           — Get activity log
 *   DELETE /api/user/account            — Delete account (soft)
 * 
 * Public routes (webhook):
 *   POST   /api/user/sync              — Clerk webhook (creates user on sign-up)
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    getStats,
    syncUser,
    getPreferences,
    updatePreferences,
    getBookmarks,
    addBookmark,
    removeBookmark,
    getTrackedExams,
    addExam,
    updateExam,
    removeExam,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    getToolHistory,
    getActivity,
    deleteAccount,
} = require('../controllers/userController');

// ─── Protected Routes (require Clerk authentication) ────
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.get('/stats', requireAuth, getStats);
router.get('/preferences', requireAuth, getPreferences);
router.put('/preferences', requireAuth, updatePreferences);

// Bookmarks
router.get('/bookmarks', requireAuth, getBookmarks);
router.post('/bookmarks', requireAuth, addBookmark);
router.delete('/bookmarks/:itemId', requireAuth, removeBookmark);

// Exam Tracker
router.get('/tracker', requireAuth, getTrackedExams);
router.post('/tracker', requireAuth, addExam);
router.put('/tracker/:examId', requireAuth, updateExam);
router.delete('/tracker/:examId', requireAuth, removeExam);

// Notifications & Activity
router.get('/notifications', requireAuth, getNotifications);
router.patch('/notifications/read-all', requireAuth, markAllNotificationsRead);
router.patch('/notifications/:id', requireAuth, markNotificationRead);
router.delete('/notifications/clear', requireAuth, clearNotifications);

// Tool History
router.get('/tool-history', requireAuth, getToolHistory);

// Activity Log
router.get('/activity', requireAuth, getActivity);

// Account Management
router.delete('/account', requireAuth, deleteAccount);

// ─── Webhook Route (called by Clerk — no auth needed) ───
router.post('/sync', syncUser);

module.exports = router;


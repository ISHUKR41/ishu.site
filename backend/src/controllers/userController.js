/**
 * userController.js — User Profile API Controllers
 * 
 * Handles all user-related operations:
 * - getProfile:       Fetch user's own profile from MongoDB
 * - updateProfile:    Update user profile fields
 * - getStats:         Get user stats (tools used, points, etc.)
 * - syncUser:         Create/update MongoDB doc when Clerk user signs up (webhook)
 * - getPreferences:   Get user notification/theme preferences
 * - updatePreferences: Update user preferences
 * - getBookmarks:     Get user's saved bookmarks
 * - addBookmark:      Add a new bookmark
 * - removeBookmark:   Delete a bookmark by index
 * - getTrackedExams:  Get all exams in tracker
 * - addExam:          Add exam to tracker
 * - updateExam:       Update exam status/notes
 * - removeExam:       Delete exam from tracker
 * - getNotifications: Get user notifications (from toolHistory + system events)
 * - markNotificationRead: Mark a notification as read
 * - markAllNotificationsRead: Mark all notifications as read
 * - getActivity:      Get user activity log (toolHistory)
 * - deleteAccount:    Soft-delete user account
 * 
 * All routes require authentication via Clerk JWT (except webhook).
 * The userId comes from req.auth.userId (set by Clerk middleware).
 */

const User = require('../models/User');

// ══════════════════════════════════════════════════════════
// GET /api/user/profile — Get current user's full profile
// ══════════════════════════════════════════════════════════
const getProfile = async (req, res) => {
    try {
        const { userId } = req.auth;
        
        let user = await User.findOne({ clerkId: userId });
        
        if (!user) {
            // Auto-create a minimal profile if none exists yet
            // (This handles cases where webhook didn't fire)
            user = await User.create({
                clerkId: userId,
                email: req.auth.sessionClaims?.email || 'unknown@email.com',
                firstName: req.auth.sessionClaims?.first_name || '',
                lastName: req.auth.sessionClaims?.last_name || '',
                avatar: req.auth.sessionClaims?.image_url || '',
            });
        }

        // Update lastSeen timestamp and increment login streak
        const now = new Date();
        const lastLogin = user.stats?.lastLogin;
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        if (lastLogin) {
            const diff = now.getTime() - new Date(lastLogin).getTime();
            if (diff >= oneDayMs && diff < 2 * oneDayMs) {
                // Consecutive day login — increment streak
                user.stats.loginStreak = (user.stats.loginStreak || 0) + 1;
            } else if (diff >= 2 * oneDayMs) {
                // Streak broken — reset to 1
                user.stats.loginStreak = 1;
            }
            // Same day — don't change streak
        }
        
        user.stats.lastLogin = now;
        user.stats.totalLogins = (user.stats.totalLogins || 0) + 1;
        user.lastSeen = now;
        await user.save();

        res.json({ success: true, user });
    } catch (error) {
        console.error('❌ getProfile error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
};

// ══════════════════════════════════════════════════════════
// PUT /api/user/profile — Update user profile fields
// ══════════════════════════════════════════════════════════
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.auth;

        // Only allow specific fields to be updated (prevent mass assignment)
        const allowedFields = [
            'firstName', 'lastName', 'username', 'bio', 'avatar', 'coverImage',
            'phone', 'location', 'preferences',
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        // Handle duplicate username error
        if (error.code === 11000 && error.keyPattern?.username) {
            return res.status(409).json({ success: false, error: 'Username already taken' });
        }
        console.error('❌ updateProfile error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

// ══════════════════════════════════════════════════════════
// GET /api/user/stats — Get user stats & gamification data
// ══════════════════════════════════════════════════════════
const getStats = async (req, res) => {
    try {
        const { userId } = req.auth;

        const user = await User.findOne({ clerkId: userId })
            .select('stats subscription role');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, stats: user.stats, subscription: user.subscription, role: user.role });
    } catch (error) {
        console.error('❌ getStats error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
};

// ══════════════════════════════════════════════════════════
// POST /api/user/sync — Clerk Webhook: Auto-create user on sign-up
// ══════════════════════════════════════════════════════════
const syncUser = async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'user.created') {
            const { id, email_addresses, first_name, last_name, image_url } = data;
            const email = email_addresses?.[0]?.email_address || '';

            // Check if user already exists (idempotent)
            const existingUser = await User.findOne({ clerkId: id });
            if (existingUser) {
                return res.json({ success: true, message: 'User already exists' });
            }

            await User.create({
                clerkId: id,
                email,
                firstName: first_name || '',
                lastName: last_name || '',
                avatar: image_url || '',
                role: 'user',
                subscription: { plan: 'free', status: 'active' },
                preferences: {
                    language: 'en',
                    theme: 'dark',
                    notifications: { email: true, whatsapp: false, push: true, examAlerts: true, newsDigest: true },
                },
                stats: { toolsUsed: 0, pdfProcessed: 0, newsRead: 0, points: 0, level: 1, totalLogins: 1 },
            });

            console.log(`✅ New user created: ${email} (${id})`);
            return res.json({ success: true, message: 'User created' });
        }

        if (type === 'user.updated') {
            const { id, email_addresses, first_name, last_name, image_url } = data;
            await User.findOneAndUpdate(
                { clerkId: id },
                {
                    email: email_addresses?.[0]?.email_address,
                    firstName: first_name || '',
                    lastName: last_name || '',
                    avatar: image_url || '',
                },
                { upsert: false }
            );
            return res.json({ success: true, message: 'User updated' });
        }

        if (type === 'user.deleted') {
            await User.findOneAndUpdate(
                { clerkId: data.id },
                { isActive: false, isBanned: false },
                { upsert: false }
            );
            console.log(`🗑️ User soft-deleted: ${data.id}`);
            return res.json({ success: true, message: 'User deleted' });
        }

        // Unknown event type
        res.json({ success: true, message: 'Event ignored' });
    } catch (error) {
        console.error('❌ syncUser webhook error:', error.message);
        res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
};

// ══════════════════════════════════════════════════════════
// GET /api/user/preferences — Get user preferences
// ══════════════════════════════════════════════════════════
const getPreferences = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findOne({ clerkId: userId }).select('preferences');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, preferences: user.preferences });
    } catch (error) {
        console.error('❌ getPreferences error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch preferences' });
    }
};

// ══════════════════════════════════════════════════════════
// PUT /api/user/preferences — Update user preferences
// ══════════════════════════════════════════════════════════
const updatePreferences = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { preferences } = req.body;

        if (!preferences) {
            return res.status(400).json({ success: false, error: 'Preferences object required' });
        }

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: { preferences } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, preferences: user.preferences });
    } catch (error) {
        console.error('❌ updatePreferences error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to update preferences' });
    }
};

// ══════════════════════════════════════════════════════════
// BOOKMARKS — CRUD Operations
// ══════════════════════════════════════════════════════════

/**
 * GET /api/user/bookmarks — Get all bookmarks with optional type filter
 * Query params: ?type=result|news|blog|tool|vacancy
 */
const getBookmarks = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { type } = req.query;

        const user = await User.findOne({ clerkId: userId }).select('bookmarks');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        let bookmarks = user.bookmarks || [];
        if (type) {
            bookmarks = bookmarks.filter(b => b.type === type);
        }

        // Sort by savedAt descending (most recent first)
        bookmarks.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

        res.json({ success: true, bookmarks, total: bookmarks.length });
    } catch (error) {
        console.error('❌ getBookmarks error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch bookmarks' });
    }
};

/**
 * POST /api/user/bookmarks — Add a new bookmark
 * Body: { type, itemId, title, url, thumbnail }
 */
const addBookmark = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { type, itemId, title, url, thumbnail } = req.body;

        if (!type || !title) {
            return res.status(400).json({ success: false, error: 'type and title are required' });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // Check for duplicate bookmark
        const exists = user.bookmarks.some(b => b.itemId === itemId && b.type === type);
        if (exists) {
            return res.status(409).json({ success: false, error: 'Already bookmarked' });
        }

        user.bookmarks.push({
            type,
            itemId: itemId || `${type}_${Date.now()}`,
            title,
            url: url || '',
            thumbnail: thumbnail || '',
            savedAt: new Date(),
        });

        await user.save();
        res.json({ success: true, bookmarks: user.bookmarks });
    } catch (error) {
        console.error('❌ addBookmark error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to add bookmark' });
    }
};

/**
 * DELETE /api/user/bookmarks/:itemId — Remove a bookmark by itemId
 */
const removeBookmark = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { itemId } = req.params;

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $pull: { bookmarks: { itemId } } },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        res.json({ success: true, bookmarks: user.bookmarks });
    } catch (error) {
        console.error('❌ removeBookmark error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to remove bookmark' });
    }
};

// ══════════════════════════════════════════════════════════
// EXAM TRACKER — CRUD Operations
// ══════════════════════════════════════════════════════════

/**
 * GET /api/user/tracker — Get all tracked exams
 */
const getTrackedExams = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findOne({ clerkId: userId }).select('trackedExams');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        res.json({ success: true, exams: user.trackedExams || [] });
    } catch (error) {
        console.error('❌ getTrackedExams error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch exams' });
    }
};

/**
 * POST /api/user/tracker — Add a new exam to tracker
 * Body: { examName, examDate, resultDate, applicationNumber, notes, status }
 */
const addExam = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { examName, examDate, resultDate, applicationNumber, notes, status } = req.body;

        if (!examName) {
            return res.status(400).json({ success: false, error: 'examName is required' });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        user.trackedExams.push({
            examName,
            status: status || 'upcoming',
            applicationNumber: applicationNumber || '',
            rollNumber: '',
            examDate: examDate ? new Date(examDate) : null,
            resultDate: resultDate ? new Date(resultDate) : null,
            notes: notes || '',
            addedAt: new Date(),
        });

        // Update stats
        user.stats.examsTracked = user.trackedExams.length;
        user.stats.points = (user.stats.points || 0) + 5; // +5 points for tracking an exam
        
        await user.save();
        res.json({ success: true, exams: user.trackedExams });
    } catch (error) {
        console.error('❌ addExam error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to add exam' });
    }
};

/**
 * PUT /api/user/tracker/:examId — Update exam (status, notes, etc.)
 */
const updateExam = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { examId } = req.params;
        const updates = req.body;

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const exam = user.trackedExams.id(examId);
        if (!exam) return res.status(404).json({ success: false, error: 'Exam not found' });

        // Update allowed fields
        if (updates.status) exam.status = updates.status;
        if (updates.notes !== undefined) exam.notes = updates.notes;
        if (updates.applicationNumber !== undefined) exam.applicationNumber = updates.applicationNumber;
        if (updates.rollNumber !== undefined) exam.rollNumber = updates.rollNumber;
        if (updates.examDate) exam.examDate = new Date(updates.examDate);
        if (updates.resultDate) exam.resultDate = new Date(updates.resultDate);

        await user.save();
        res.json({ success: true, exams: user.trackedExams });
    } catch (error) {
        console.error('❌ updateExam error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to update exam' });
    }
};

/**
 * DELETE /api/user/tracker/:examId — Remove exam from tracker
 */
const removeExam = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { examId } = req.params;

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        user.trackedExams.pull({ _id: examId });
        user.stats.examsTracked = user.trackedExams.length;
        await user.save();

        res.json({ success: true, exams: user.trackedExams });
    } catch (error) {
        console.error('❌ removeExam error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to remove exam' });
    }
};

// ══════════════════════════════════════════════════════════
// NOTIFICATIONS — Read operations (notifications generated from activity)
// ══════════════════════════════════════════════════════════

/**
 * GET /api/user/notifications — Get user notifications
 * Returns a computed list from recent activities + system events
 */
const getNotifications = async (req, res) => {
    try {
        const { userId } = req.auth;

        const user = await User.findOne({ clerkId: userId })
            .select('toolHistory trackedExams stats bookmarks createdAt readNotificationIds');
        
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const readIds = new Set(user.readNotificationIds || []);

        // Build notifications from real user data
        const notifications = [];

        // Welcome notification (always present for new users)
        notifications.push({
            id: 'welcome',
            type: 'welcome',
            title: 'Welcome to ISHU! 🎉',
            body: 'Your account has been created successfully. Explore PDF tools, track exams, and stay updated!',
            isRead: true,
            createdAt: user.createdAt,
        });

        // Recent tool usage → tool_update notifications
        const recentTools = (user.toolHistory || []).slice(-5).reverse();
        for (const tool of recentTools) {
            const nid = `tool_${tool._id}`;
            notifications.push({
                id: nid,
                type: 'tool_update',
                title: `Used ${tool.toolName || tool.toolId}`,
                body: tool.success ? 'Processing completed successfully' : 'Processing failed — try again',
                isRead: readIds.has(nid),
                createdAt: tool.usedAt,
            });
        }

        // Exam-related notifications
        const exams = user.trackedExams || [];
        const now = new Date();
        for (const exam of exams) {
            if (exam.examDate) {
                const daysUntil = Math.ceil((new Date(exam.examDate) - now) / (1000 * 60 * 60 * 24));
                if (daysUntil > 0 && daysUntil <= 7) {
                    const nid = `exam_soon_${exam._id}`;
                    notifications.push({
                        id: nid,
                        type: 'exam_alert',
                        title: `${exam.examName} — ${daysUntil} day${daysUntil > 1 ? 's' : ''} left!`,
                        body: `Your exam is coming up soon. Make sure you're prepared!`,
                        isRead: readIds.has(nid),
                        createdAt: new Date(),
                    });
                }
                if (daysUntil === 0) {
                    const nid = `exam_today_${exam._id}`;
                    notifications.push({
                        id: nid,
                        type: 'exam_alert',
                        title: `${exam.examName} — TODAY! 🎯`,
                        body: `All the best for your exam today!`,
                        isRead: readIds.has(nid),
                        createdAt: new Date(),
                    });
                }
            }
        }

        // Badge/achievement notifications
        const badges = user.stats?.badges || [];
        for (const badge of badges.slice(-3)) {
            const nid = `badge_${badge}`;
            notifications.push({
                id: nid,
                type: 'badge_earned',
                title: `Badge Earned: ${badge}`,
                body: 'You unlocked a new achievement! Check your profile.',
                isRead: readIds.has(nid),
                createdAt: new Date(),
            });
        }

        // Sort by date (newest first)
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, notifications, total: notifications.length });
    } catch (error) {
        console.error('❌ getNotifications error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
};

/**
 * PATCH /api/user/notifications/:id — Mark a single notification as read
 */
const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.params;

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $addToSet: { readNotificationIds: id } },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('❌ markNotificationRead error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to mark notification' });
    }
};

/**
 * PATCH /api/user/notifications/read-all — Mark all notifications as read
 */
const markAllNotificationsRead = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { ids } = req.body; // Array of notification IDs to mark as read

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, error: 'ids array required in body' });
        }

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $addToSet: { readNotificationIds: { $each: ids } } },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('❌ markAllNotificationsRead error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to mark all' });
    }
};

/**
 * DELETE /api/user/notifications/clear — Clear all read notification IDs
 */
const clearNotifications = async (req, res) => {
    try {
        const { userId } = req.auth;

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: { readNotificationIds: [] } },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'Notifications cleared' });
    } catch (error) {
        console.error('❌ clearNotifications error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to clear' });
    }
};

/**
 * GET /api/user/tool-history — Get paginated tool usage history
 * Query: ?page=1&limit=20
 */
const getToolHistory = async (req, res) => {
    try {
        const { userId } = req.auth;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const user = await User.findOne({ clerkId: userId }).select('toolHistory favoriteTools');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const history = (user.toolHistory || []).slice().reverse(); // newest first
        const total = history.length;
        const paginated = history.slice((page - 1) * limit, page * limit);

        res.json({
            success: true,
            history: paginated,
            favorites: user.favoriteTools || [],
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('❌ getToolHistory error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch tool history' });
    }
};

// ══════════════════════════════════════════════════════════
// ACTIVITY — Get user activity log
// ══════════════════════════════════════════════════════════

/**
 * GET /api/user/activity — Get user activity log
 * Query: ?page=1&limit=20
 */
const getActivity = async (req, res) => {
    try {
        const { userId } = req.auth;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const user = await User.findOne({ clerkId: userId })
            .select('toolHistory bookmarks trackedExams stats createdAt');

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // Build activity timeline from real data
        const activities = [];

        // Tool usage activities
        for (const tool of (user.toolHistory || [])) {
            activities.push({
                id: `tool_${tool._id}`,
                type: 'tool_used',
                icon: '🛠️',
                title: `Used ${tool.toolName || tool.toolId}`,
                detail: tool.success ? `${tool.fileCount || 1} file(s) processed` : 'Processing failed',
                success: tool.success,
                createdAt: tool.usedAt,
            });
        }

        // Bookmark activities
        for (const bm of (user.bookmarks || [])) {
            activities.push({
                id: `bookmark_${bm._id}`,
                type: 'bookmark_added',
                icon: '⭐',
                title: `Bookmarked: ${bm.title}`,
                detail: `Saved to ${bm.type} collection`,
                success: true,
                createdAt: bm.savedAt,
            });
        }

        // Exam tracker activities
        for (const exam of (user.trackedExams || [])) {
            activities.push({
                id: `exam_${exam._id}`,
                type: 'exam_tracked',
                icon: '🎓',
                title: `Tracking: ${exam.examName}`,
                detail: `Status: ${exam.status}`,
                success: true,
                createdAt: exam.addedAt,
            });
        }

        // Account creation
        activities.push({
            id: 'account_created',
            type: 'account',
            icon: '🔐',
            title: 'Account created',
            detail: 'Welcome to ISHU!',
            success: true,
            createdAt: user.createdAt,
        });

        // Sort by date (newest first) and paginate
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const total = activities.length;
        const paginated = activities.slice((page - 1) * limit, page * limit);

        res.json({
            success: true,
            activities: paginated,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('❌ getActivity error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch activity' });
    }
};

// ══════════════════════════════════════════════════════════
// DELETE /api/user/account — Soft-delete user account
// ══════════════════════════════════════════════════════════
const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.auth;

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { isActive: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        res.json({ success: true, message: 'Account deactivated' });
    } catch (error) {
        console.error('❌ deleteAccount error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to delete account' });
    }
};

module.exports = {
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
};

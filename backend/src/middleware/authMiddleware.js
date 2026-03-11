/**
 * authMiddleware.js — Clerk JWT Verification Middleware
 * 
 * Verifies the Clerk session token from the Authorization header.
 * Extracts userId and attaches it to req.auth for downstream use.
 * 
 * Usage in routes:
 *   router.get('/profile', requireAuth, getProfile);
 * 
 * The frontend sends: Authorization: Bearer <clerk-session-token>
 * This middleware validates that token and extracts the user identity.
 */

const { clerkMiddleware, requireAuth } = require('@clerk/express');

/**
 * requireAuth — Middleware that REQUIRES a valid Clerk session.
 * Returns 401 if no valid token is found.
 * On success, sets req.auth.userId
 */
const requireAuthMiddleware = requireAuth({
    // Clerk will automatically read CLERK_SECRET_KEY from env
});

/**
 * optionalAuth — Middleware that OPTIONALLY reads Clerk session.
 * Does NOT block the request if no token is present.
 * Useful for routes that work for both logged-in and anonymous users.
 */
const optionalAuth = (req, res, next) => {
    // Try to extract auth, but don't fail if not present
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            // Let Clerk handle it
            return requireAuth(req, res, (err) => {
                if (err) {
                    // Auth failed but we don't care — continue without auth
                    req.auth = null;
                }
                next();
            });
        }
    } catch (e) {
        // Silently continue without auth
    }
    req.auth = null;
    next();
};

module.exports = { requireAuth: requireAuthMiddleware, optionalAuth };

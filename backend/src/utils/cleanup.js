/**
 * cleanup.js — Automatic Temp File Cleanup (ISHU PDF Tools Backend)
 *
 * Problem:
 *   Every file upload creates a temp file in ./temp/ directory.
 *   If a user uploads a file but never downloads the result, or if
 *   an error occurs mid-processing, temp files accumulate on disk.
 *
 * Solution:
 *   This module runs a cron job every 15 minutes that scans the
 *   temp directory and deletes any file older than TEMP_FILE_EXPIRY_MINUTES
 *   (default 30 minutes from .env).
 *
 * How it works:
 *   1. node-cron schedules the cleanup to run every 15 minutes
 *   2. On each run, reads all files in temp/
 *   3. Checks each file's creation time (birthtimeMs)
 *   4. Deletes files older than the expiry threshold
 *   5. Logs how many files were cleaned up
 *
 * Usage:
 *   // In server.js (called once after server starts listening)
 *   const { startCleanupSchedule } = require('./src/utils/cleanup');
 *   startCleanupSchedule();
 */

const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');

// ─── CONFIGURATION ──────────────────────────────────────────
// Resolve temp directory path from .env
const TEMP_DIR = path.resolve(process.env.TEMP_DIR || './temp');

// Convert expiry minutes to milliseconds for time comparison
// Default: 30 minutes = 30 * 60 * 1000 = 1,800,000 ms
const EXPIRY_MS = (parseInt(process.env.TEMP_FILE_EXPIRY_MINUTES, 10) || 30) * 60 * 1000;

/**
 * cleanTemp — Scan temp directory and delete expired files
 *
 * This function is called:
 *   - Once on server startup (immediate cleanup)
 *   - Every 15 minutes via cron schedule
 *
 * It safely handles:
 *   - Missing temp directory (skips)
 *   - Files that can't be stat'd (skips)
 *   - Files that can't be deleted (skips with no error)
 */
function cleanTemp() {
    try {
        // Skip if temp directory doesn't exist
        if (!fs.existsSync(TEMP_DIR)) return;

        const files = fs.readdirSync(TEMP_DIR);
        const now = Date.now();
        let deleted = 0;

        files.forEach((file) => {
            const filePath = path.join(TEMP_DIR, file);
            try {
                const stat = fs.statSync(filePath);
                // Check if file is older than expiry threshold
                // birthtimeMs = file creation time in milliseconds since epoch
                if (now - stat.birthtimeMs > EXPIRY_MS) {
                    fs.removeSync(filePath); // fs-extra's removeSync handles files AND directories
                    deleted++;
                }
            } catch { /* skip files that can't be stat'd or deleted */ }
        });

        if (deleted > 0) {
            console.log(`[Cleanup] Deleted ${deleted} expired temp file(s)`);
        }
    } catch (err) {
        console.error('[Cleanup] Error:', err.message);
    }
}

/**
 * startCleanupSchedule — Initialize the automatic cleanup cron job
 *
 * Cron expression: '* /15 * * * *' = every 15 minutes
 *   - Minute: every 15th minute (0, 15, 30, 45)
 *   - Hour: every hour
 *   - Day/Month/Weekday: every day
 *
 * Also runs an immediate cleanup on startup to clear any files
 * left over from a previous server session.
 */
function startCleanupSchedule() {
    // Schedule cron job — runs every 15 minutes
    cron.schedule('*/15 * * * *', cleanTemp);
    console.log('[Cleanup] Scheduled every 15 minutes (expiry: ' +
        (EXPIRY_MS / 60000) + ' minutes)');

    // Run once immediately on startup
    cleanTemp();
}

module.exports = { startCleanupSchedule, cleanTemp };

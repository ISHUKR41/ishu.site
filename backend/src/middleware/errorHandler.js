/**
 * errorHandler.js — Global Express Error Handler (ISHU PDF Tools Backend)
 *
 * This is the LAST middleware in the Express chain. Any error thrown
 * or passed via next(err) ends up here.
 *
 * Responsibilities:
 *   1. Clean up temp files on error (prevent disk space leaks)
 *   2. Handle Multer-specific errors (file too large, too many files)
 *   3. Return consistent JSON error responses: { success, error, code }
 *   4. Log errors to console with timestamp
 *
 * Error categories handled:
 *   - 413: File too large (multer LIMIT_FILE_SIZE)
 *   - 400: Too many files (multer LIMIT_FILE_COUNT)
 *   - 400: Wrong file type / validation errors
 *   - 500: Conversion failures, system tool errors, unexpected errors
 *
 * Usage:
 *   // In server.js — must be AFTER all routes
 *   app.use(errorHandler);
 */

const multer = require('multer');

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request (may have .file or .files)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Next function (unused but required by Express)
 */
function errorHandler(err, req, res, _next) {
    // ─── STEP 1: Clean up uploaded temp files ───────────────
    // When an error occurs mid-processing, temp files may have been
    // written to disk. We remove them to prevent disk space leaks.

    if (req.file) {
        // Single file upload — clean up the one temp file
        const fs = require('fs-extra');
        fs.remove(req.file.path).catch(() => { });
    }

    if (req.files) {
        // Multiple file upload — req.files can be:
        //   - Array (from upload.array())
        //   - Object with field names as keys (from upload.fields())
        const fs = require('fs-extra');
        const files = Array.isArray(req.files)
            ? req.files
            : Object.values(req.files).flat();
        files.forEach((f) => fs.remove(f.path).catch(() => { }));
    }

    // ─── STEP 2: Handle Multer-specific errors ──────────────

    if (err instanceof multer.MulterError) {
        // LIMIT_FILE_SIZE — uploaded file exceeds MAX_FILE_SIZE_MB
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                error: 'File too large. Maximum size is 100 MB.',
                code: 413,
            });
        }

        // LIMIT_FILE_COUNT — too many files in one request
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: 'Too many files. Maximum is 20.',
                code: 400,
            });
        }

        // Other multer errors (LIMIT_FIELD_KEY, LIMIT_FIELD_VALUE, etc.)
        return res.status(400).json({
            success: false,
            error: err.message,
            code: 400,
        });
    }

    // ─── STEP 3: Handle application and system errors ───────

    // Use error's status code if set, otherwise default to 500
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Log the error — only show stack trace for 500 errors
    console.error(`[ERROR] ${status} — ${message}`);
    if (status === 500) console.error(err.stack);

    // ─── STEP 4: Send consistent JSON response ─────────────
    res.status(status).json({
        success: false,
        error: message,
        code: status,
    });
}

module.exports = errorHandler;

/**
 * upload.js — Multer File Upload Middleware (ISHU PDF Tools Backend)
 *
 * This middleware handles all file uploads for the backend.
 * Files are stored in the `temp/` directory with UUID-based filenames
 * to prevent naming collisions and ensure security.
 *
 * Features:
 *   - UUID filenames: prevents overwriting and path traversal attacks
 *   - Configurable max file size (default 100 MB from .env)
 *   - Pre-built middleware variants:
 *     • single  — one file on field "file"  (most tools use this)
 *     • multi   — up to 20 files on field "files" (merge, scan-upload)
 *     • two     — two files on fields "file1" and "file2" (compare)
 *   - Raw multer instance exported for custom field configurations
 *
 * Usage in routes:
 *   const { single, multi, two } = require('../middleware/upload');
 *   router.post('/merge', multi, mergePdfHandler);
 *   router.post('/rotate', single, rotatePdfHandler);
 *   router.post('/compare', two, comparePdfHandler);
 */

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');

// ─── TEMP DIRECTORY ─────────────────────────────────────────
// Resolve the temp directory path from .env (default: ./temp relative to backend/)
// fs.ensureDirSync creates it if it doesn't exist (runs once on import)
const TEMP_DIR = path.resolve(process.env.TEMP_DIR || './temp');
fs.ensureDirSync(TEMP_DIR);

// ─── MULTER STORAGE ENGINE ─────────────────────────────────
// Uses disk storage (not memory) to handle large files up to 100 MB
// Each file gets a UUID filename to prevent collisions
// Original extension is preserved for format detection in controllers
const storage = multer.diskStorage({
  // All uploads go to the temp directory
  destination: (_req, _file, cb) => cb(null, TEMP_DIR),

  // Generate unique filename: <uuid>.<original-extension>
  // Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf"
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// ─── FILE SIZE LIMIT ────────────────────────────────────────
// Read from .env MAX_FILE_SIZE_MB, default 100 MB
// Convert MB to bytes: 100 * 1024 * 1024 = 104,857,600 bytes
const MAX_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 100) * 1024 * 1024;

// ─── MULTER INSTANCE ────────────────────────────────────────
// This is the core multer instance with storage config and size limit
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
});

// ═══════════════════════════════════════════════════════════════
// EXPORTS — Pre-built middleware for common upload patterns
// ═══════════════════════════════════════════════════════════════
module.exports = {
  /**
   * Accept a single file on field "file"
   * Used by: most tools (rotate, compress, watermark, etc.)
   */
  single: upload.single('file'),

  /**
   * Accept multiple files on field "files" (max 20)
   * Used by: merge PDF, scan-upload, image-to-pdf
   */
  multi: upload.array('files', 20),

  /**
   * Accept two files on fields "file1" and "file2"
   * Used by: compare PDF (needs two PDFs to diff)
   */
  two: upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
  ]),

  /** Raw multer instance — for custom field configurations in specific routes */
  upload,

  /** Temp directory absolute path — used by controllers for output files */
  TEMP_DIR,
};

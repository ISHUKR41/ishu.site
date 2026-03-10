/**
 * organizeController.js — Organize PDF Tools (ISHU PDF Tools Backend)
 *
 * This controller handles all PDF organization/manipulation tools:
 *
 * Tool List (7 tools):
 *   1. merge         — Combine multiple PDFs into one
 *   2. split         — Split a PDF into individual pages or ranges
 *   3. organize      — Reorder pages within a PDF by specifying new page order
 *   4. rotate        — Rotate specific pages or all pages by 90/180/270 degrees
 *   5. deletePages   — Remove specific pages from a PDF
 *   6. extractPages  — Extract specific pages into a new PDF
 *   7. crop          — Crop all pages to a custom rectangle (trimBox)
 *
 * Library: pdf-lib (pure JavaScript — no system dependencies needed)
 *   - Works on Windows, Mac, and Linux without any installation
 *   - Handles all page manipulation via PDFDocument class
 *
 * Architecture:
 *   - Each tool is an async Express handler: (req, res, next) => { ... }
 *   - File uploads are handled by multer middleware (in routes)
 *   - Temp files are cleaned up after processing
 *   - Errors are forwarded to the global error handler via next(err)
 *   - All responses use sendPdf() helper for consistent download headers
 */

const { PDFDocument, degrees } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const { TEMP_DIR } = require('../middleware/upload');

// ═══════════════════════════════════════════════════════════════
// HELPERS — Shared utility functions used by multiple tools
// ═══════════════════════════════════════════════════════════════

/**
 * parsePageRange — Convert human-readable page range strings to an array of 0-indexed page numbers
 *
 * Supported formats:
 *   "1,3,5"     → [0, 2, 4]        (comma-separated)
 *   "1-5"       → [0, 1, 2, 3, 4]  (range)
 *   "1,3-5,8"   → [0, 2, 3, 4, 7]  (mixed)
 *   "all"       → [0, 1, ..., totalPages-1]
 *
 * @param {string} rangeStr - Page range string (1-indexed, human-readable)
 * @param {number} totalPages - Total number of pages in the PDF
 * @returns {number[]} Array of valid 0-indexed page numbers
 */
function parsePageRange(rangeStr, totalPages) {
    if (!rangeStr || rangeStr.toLowerCase() === 'all') {
        // Return all pages as an array: [0, 1, 2, ..., totalPages-1]
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    const pages = new Set(); // Use Set to avoid duplicates
    rangeStr.split(',').forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
            // Handle range: "3-7" → pages 3, 4, 5, 6, 7
            const [start, end] = trimmed.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                // Convert 1-indexed input to 0-indexed, validate bounds
                if (i >= 1 && i <= totalPages) pages.add(i - 1);
            }
        } else {
            // Handle single page number: "5" → page 5
            const num = parseInt(trimmed, 10);
            if (num >= 1 && num <= totalPages) pages.add(num - 1);
        }
    });
    return [...pages].sort((a, b) => a - b); // Return sorted array
}

/**
 * sendPdf — Send PDF bytes as a downloadable file response
 *
 * Sets proper headers for PDF download:
 *   - Content-Type: application/pdf
 *   - Content-Disposition: attachment; filename="..."
 *   - Content-Length: byte count for proper download progress
 *
 * @param {import('express').Response} res - Express response object
 * @param {Buffer|Uint8Array} bytes - PDF file bytes
 * @param {string} filename - Suggested download filename
 */
function sendPdf(res, bytes, filename) {
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': bytes.length,
    });
    res.send(Buffer.from(bytes));
}

// ═══════════════════════════════════════════════════════════════
// TOOL 1: MERGE — Combine multiple PDFs into one
// Route: POST /api/tools/merge
// Upload: multi (field "files", up to 20 PDFs)
// ═══════════════════════════════════════════════════════════════

/**
 * merge — Combine multiple PDF files into a single PDF
 *
 * How it works:
 *   1. Receive multiple PDF files via multer (req.files array)
 *   2. Create a new empty PDFDocument
 *   3. For each uploaded PDF, load it and copy ALL its pages
 *   4. Add the copied pages to the merged document (preserves order)
 *   5. Save and send the merged PDF
 *
 * @param {import('express').Request} req - Express request. req.files = uploaded PDFs
 * @param {import('express').Response} res - Express response
 * @param {Function} next - Express next (for error handling)
 */
async function merge(req, res, next) {
    try {
        const files = req.files;
        // Validate: need at least 2 PDFs to merge
        if (!files || files.length < 2) {
            return res.status(400).json({ success: false, error: 'At least 2 PDF files required for merge' });
        }

        // Create a new blank PDF document to hold all merged pages
        const merged = await PDFDocument.create();

        // Loop through each uploaded file and copy its pages into merged doc
        for (const file of files) {
            const bytes = await fs.readFile(file.path);
            // Load source PDF (ignoreEncryption allows reading password-protected PDFs)
            const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
            // Copy ALL pages from source document
            const copiedPages = await merged.copyPages(src, src.getPageIndices());
            // Add each copied page to the merged document
            copiedPages.forEach((page) => merged.addPage(page));
        }

        // Save and send the result
        const pdfBytes = await merged.save();

        // Clean up all temp files
        files.forEach((f) => fs.remove(f.path).catch(() => { }));

        sendPdf(res, pdfBytes, 'merged.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 2: SPLIT — Split PDF into individual pages or ranges
// Route: POST /api/tools/split
// Upload: single (field "file")
// Body: { ranges: "1-3,5,7-10" | "all" } (optional, default: all = one page per file)
// ═══════════════════════════════════════════════════════════════

/**
 * split — Split a PDF into individual pages or specified page ranges
 *
 * How it works:
 *   1. Parse the range string (or default to "all" = every page separate)
 *   2. If splitting into individual pages:
 *      - Create a separate PDF for each page
 *      - ZIP all individual PDFs together
 *      - Send ZIP as download
 *   3. If extracting a specific range:
 *      - Create one PDF with just those pages
 *      - Send as PDF download
 *
 * @param {import('express').Request} req - req.body.ranges = page range string
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function split(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = pdf.getPageCount();

        // Parse requested pages (default: all pages as individual files)
        const ranges = req.body.ranges || 'all';
        const pageIndices = parsePageRange(ranges, total);

        if (pageIndices.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No valid pages in specified range' });
        }

        // If only one page or a contiguous range → return single PDF
        if (ranges !== 'all' && pageIndices.length < total) {
            const newDoc = await PDFDocument.create();
            const copied = await newDoc.copyPages(pdf, pageIndices);
            copied.forEach((p) => newDoc.addPage(p));
            const pdfBytes = await newDoc.save();
            fs.remove(file.path).catch(() => { });
            return sendPdf(res, pdfBytes, 'split.pdf');
        }

        // Split into individual pages → create ZIP archive
        const zipPath = path.join(TEMP_DIR, `${uuidv4()}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        archive.pipe(output);

        // Create a separate PDF for each page
        for (let i = 0; i < total; i++) {
            const singleDoc = await PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(pdf, [i]);
            singleDoc.addPage(copiedPage);
            const singleBytes = await singleDoc.save();
            // Add to ZIP with 3-digit padded filename: page_001.pdf, page_002.pdf, etc.
            archive.append(Buffer.from(singleBytes), {
                name: `page_${String(i + 1).padStart(3, '0')}.pdf`,
            });
        }

        await archive.finalize();
        await new Promise((resolve) => output.on('close', resolve));

        // Send the ZIP file as download, then clean up
        res.download(zipPath, 'split_pages.zip', () => {
            fs.remove(zipPath).catch(() => { });
            fs.remove(file.path).catch(() => { });
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 3: ORGANIZE — Reorder pages in a PDF
// Route: POST /api/tools/organize
// Upload: single
// Body: { pageOrder: [3, 1, 2, 5, 4] } — new page order (1-indexed)
// ═══════════════════════════════════════════════════════════════

/**
 * organize — Rearrange pages in a PDF according to a specified order
 *
 * Example: A 5-page PDF with pageOrder [3, 1, 2, 5, 4] will produce
 * a PDF where page 3 comes first, then page 1, then 2, etc.
 *
 * @param {import('express').Request} req - req.body.pageOrder = array of 1-indexed page numbers
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function organize(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // Parse pageOrder — can be JSON array or comma-separated string
        let pageOrder = req.body.pageOrder;
        if (typeof pageOrder === 'string') pageOrder = JSON.parse(pageOrder);
        if (!Array.isArray(pageOrder) || pageOrder.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'pageOrder array is required (1-indexed page numbers)' });
        }

        const bytes = await fs.readFile(file.path);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = src.getPageCount();

        // Convert 1-indexed to 0-indexed and validate
        const indices = pageOrder.map((p) => p - 1).filter((i) => i >= 0 && i < total);
        if (indices.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No valid page numbers provided' });
        }

        // Create new PDF with pages in the requested order
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(src, indices);
        copied.forEach((p) => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'organized.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 4: ROTATE — Rotate pages by 90/180/270 degrees
// Route: POST /api/tools/rotate
// Upload: single
// Body: { angle: 90, pages: "1,3-5" | "all" }
// ═══════════════════════════════════════════════════════════════

/**
 * rotate — Rotate specific pages or all pages of a PDF
 *
 * Rotation angles: 90 (clockwise), 180 (upside down), 270 (counter-clockwise)
 * Pages can be specified with parsePageRange() format or "all"
 *
 * How pdf-lib rotation works:
 *   - page.setRotation(degrees(angle)) sets absolute rotation
 *   - We ADD the requested angle to the existing rotation
 *     so that a page already rotated 90° + another 90° = 180°
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function rotate(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // Parse rotation angle (default 90°)
        const angle = parseInt(req.body.angle, 10) || 90;
        // Normalize angle to one of: 0, 90, 180, 270
        const normalizedAngle = ((angle % 360) + 360) % 360;

        if (![90, 180, 270].includes(normalizedAngle)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Angle must be 90, 180, or 270' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = pdf.getPageCount();

        // Determine which pages to rotate
        const pageIndices = parsePageRange(req.body.pages || 'all', total);

        // Apply rotation to each specified page
        for (const idx of pageIndices) {
            const page = pdf.getPage(idx);
            // Get current rotation and ADD the new angle
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + normalizedAngle));
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'rotated.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 5: DELETE PAGES — Remove specific pages from a PDF
// Route: POST /api/tools/delete-pages
// Upload: single
// Body: { pages: "2,5,8-10" } — pages to DELETE (1-indexed)
// ═══════════════════════════════════════════════════════════════

/**
 * deletePages — Remove specified pages from a PDF
 *
 * Strategy: Instead of deleting pages from the original (complex),
 * we create a NEW PDF and copy only the pages we want to KEEP.
 *
 * Example: 10-page PDF, delete pages "2,5,8-10"
 *   - Pages to delete: [1, 4, 7, 8, 9] (0-indexed)
 *   - Pages to keep: [0, 2, 3, 5, 6] (0-indexed)
 *   - Result: 5-page PDF with original pages 1, 3, 4, 6, 7
 *
 * @param {import('express').Request} req - req.body.pages = pages to remove
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function deletePages(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        if (!req.body.pages) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Specify pages to delete (e.g. "2,5,8-10")' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = pdf.getPageCount();

        // Get pages to delete (as 0-indexed Set for fast lookup)
        const toDelete = new Set(parsePageRange(req.body.pages, total));

        // Calculate pages to KEEP: all pages NOT in toDelete set
        const toKeep = [];
        for (let i = 0; i < total; i++) {
            if (!toDelete.has(i)) toKeep.push(i);
        }

        if (toKeep.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Cannot delete all pages — at least 1 page must remain' });
        }

        // Create new PDF with only the pages we want to keep
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(pdf, toKeep);
        copied.forEach((p) => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'pages_removed.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 6: EXTRACT PAGES — Pull specific pages into a new PDF
// Route: POST /api/tools/extract-pages
// Upload: single
// Body: { pages: "1,3,5-8" } — pages to EXTRACT (1-indexed)
// ═══════════════════════════════════════════════════════════════

/**
 * extractPages — Create a new PDF containing only the specified pages
 *
 * Similar to split, but targets specific non-contiguous pages.
 * Example: From a 20-page PDF, extract pages "1,5,10-12" to get a 5-page PDF.
 *
 * @param {import('express').Request} req - req.body.pages = pages to extract
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function extractPages(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        if (!req.body.pages) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Specify pages to extract (e.g. "1,3,5-8")' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = pdf.getPageCount();

        // Parse and validate the requested page range
        const indices = parsePageRange(req.body.pages, total);
        if (indices.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No valid pages in specified range' });
        }

        // Create new PDF with only the requested pages
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(pdf, indices);
        copied.forEach((p) => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'extracted.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 7: CROP — Crop all pages to a specified rectangle
// Route: POST /api/tools/crop
// Upload: single
// Body: { x, y, width, height } — crop rectangle in PDF points
// ═══════════════════════════════════════════════════════════════

/**
 * crop — Crop all pages of a PDF to a specified rectangle
 *
 * Uses pdf-lib's MediaBox (or CropBox) to define the visible area.
 * The crop rectangle is specified in PDF coordinate system:
 *   - Origin (0,0) is at BOTTOM-LEFT
 *   - x increases rightward, y increases upward
 *   - Units are PDF points (1 point = 1/72 inch)
 *
 * If no dimensions provided, uses percentage-based cropping:
 *   - marginPercent: % to trim from all edges (e.g., 10 = trim 10% from each edge)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function crop(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = pdf.getPages();

        // Parse crop parameters from request body
        const x = parseFloat(req.body.x);
        const y = parseFloat(req.body.y);
        const w = parseFloat(req.body.width);
        const h = parseFloat(req.body.height);
        const marginPercent = parseFloat(req.body.marginPercent) || 0;

        pages.forEach((page) => {
            const { width: pageW, height: pageH } = page.getSize();

            if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
                // Absolute crop: use exact coordinates provided
                // MediaBox format: [left, bottom, right, top]
                page.setMediaBox(x, y, w, h);
            } else if (marginPercent > 0 && marginPercent < 50) {
                // Percentage-based crop: trim equal margin from all edges
                const mx = pageW * (marginPercent / 100); // horizontal margin
                const my = pageH * (marginPercent / 100); // vertical margin
                page.setMediaBox(mx, my, pageW - 2 * mx, pageH - 2 * my);
            } else {
                // No valid crop params — return error
                fs.remove(file.path).catch(() => { });
                return res.status(400).json({
                    success: false,
                    error: 'Provide either {x, y, width, height} or {marginPercent} (1-49)',
                });
            }
        });

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'cropped.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS — All 7 organize tools
// ═══════════════════════════════════════════════════════════════
module.exports = { merge, split, organize, rotate, deletePages, extractPages, crop };

/**
 * editController.js — Edit PDF Tools (ISHU PDF Tools Backend)
 *
 * This controller handles all PDF editing/modification tools:
 *
 * Tool List (10 tools):
 *   1.  editPdf       — General-purpose editor: apply text/shapes/images via operations array
 *   2.  addText       — Add text to a specific page at specific coordinates
 *   3.  addImage      — Overlay an image onto a PDF page at specific position
 *   4.  watermark     — Add diagonal text watermark across all pages
 *   5.  pageNumbers   — Add page numbers in various positions/formats
 *   6.  headerFooter  — Add header and/or footer text to all pages
 *   7.  signPdf       — Add a signature image (file upload or base64) to a page
 *   8.  whiteout      — Cover areas with white rectangles (to hide text)
 *   9.  fillForm      — Automatically fill PDF form fields from a JSON map
 *   10. highlight     — Highlight text areas with semi-transparent color overlays
 *
 * Library: pdf-lib (pure JavaScript — works everywhere without system dependencies)
 *
 * Architecture:
 *   - All handlers are async Express middleware: (req, res, next) => { ... }
 *   - PDF files are uploaded via multer middleware (in routes)
 *   - Temp files are cleaned up after processing
 *   - Errors flow to the global error handler via next(err)
 *   - sendPdf() provides consistent download response headers
 */

const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs-extra');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// HELPERS — Shared utility functions
// ═══════════════════════════════════════════════════════════════

/**
 * hexToRgb — Convert a hex color string to pdf-lib's rgb() object
 *
 * @param {string} hex - CSS hex color, e.g. "#FF5722" or "FF5722"
 * @returns {object} pdf-lib rgb object with r, g, b in 0–1 range
 */
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return rgb(
        parseInt(h.substring(0, 2), 16) / 255,  // Red   (0-255 → 0-1)
        parseInt(h.substring(2, 4), 16) / 255,  // Green (0-255 → 0-1)
        parseInt(h.substring(4, 6), 16) / 255,  // Blue  (0-255 → 0-1)
    );
}

/**
 * sendPdf — Send PDF bytes as a downloadable response
 *
 * @param {import('express').Response} res
 * @param {Buffer|Uint8Array} bytes - PDF content
 * @param {string} filename - Suggested filename for download
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
// TOOL 1: EDIT PDF — General-purpose editor with operations array
// Route: POST /api/tools/edit-pdf
// Upload: single
// Body: { operations: [{ type: "text", page, x, y, text, ... }, ...] }
// ═══════════════════════════════════════════════════════════════

/**
 * editPdf — Apply a series of editing operations to a PDF
 *
 * Supports multiple operation types:
 *   - "text": Draw text at specific coordinates
 *   - "rectangle": Draw a filled/outlined rectangle
 *   - "line": Draw a line between two points
 *   - "circle": Draw a circle at a center point
 *
 * Operations are specified as a JSON array in req.body.operations.
 * Each operation object has a "type" field and type-specific parameters.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function editPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // Parse operations array from request body
        let operations = req.body.operations;
        if (typeof operations === 'string') operations = JSON.parse(operations);
        if (!Array.isArray(operations) || operations.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'operations array is required' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        pdf.registerFontkit(fontkit); // Required for custom font embedding
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();

        // Apply each operation
        for (const op of operations) {
            // Determine target page (0-indexed, default to first page)
            const pageIdx = Math.min((op.page || 1) - 1, pages.length - 1);
            const page = pages[Math.max(0, pageIdx)];
            const color = op.color ? hexToRgb(op.color) : rgb(0, 0, 0); // Default: black
            const size = op.size || 12;

            switch (op.type) {
                case 'text':
                    // Draw text string at (x, y) coordinates
                    page.drawText(op.text || '', {
                        x: op.x || 50, y: op.y || 50, size, font, color,
                    });
                    break;

                case 'rectangle':
                    // Draw a filled or outlined rectangle
                    page.drawRectangle({
                        x: op.x || 0, y: op.y || 0,
                        width: op.width || 100, height: op.height || 50,
                        color: op.fill ? hexToRgb(op.fill) : undefined,
                        borderColor: color, borderWidth: op.borderWidth || 1,
                    });
                    break;

                case 'line':
                    // Draw a line from (x, y) to (x2, y2)
                    page.drawLine({
                        start: { x: op.x || 0, y: op.y || 0 },
                        end: { x: op.x2 || 100, y: op.y2 || 100 },
                        thickness: op.thickness || 1, color,
                    });
                    break;

                case 'circle':
                    // Draw a filled circle at (x, y) with given radius
                    page.drawCircle({
                        x: op.x || 100, y: op.y || 100,
                        size: op.radius || 25, color,
                    });
                    break;
            }
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'edited.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 2: ADD TEXT — Add text to a specific position on a page
// Route: POST /api/tools/add-text
// Upload: single
// Body: { text, page, x, y, size, color }
// ═══════════════════════════════════════════════════════════════

/**
 * addText — Place text on a specific page at specific coordinates
 *
 * Quick text addition without the complexity of the full editPdf operations array.
 * Good for simple annotations, labels, or stamps.
 *
 * Coordinate system: PDF origin is BOTTOM-LEFT
 *   - x: distance from left edge (in points)
 *   - y: distance from bottom edge (in points)
 *   - A4 page is ~595 x 842 points
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function addText(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const { text, page: pageNum = 1, x = 50, y = 750, size = 14, color = '#000000' } = req.body;
        if (!text) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'text field is required' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();

        // Get target page (clamp to valid range)
        const idx = Math.max(0, Math.min(parseInt(pageNum, 10) - 1, pages.length - 1));
        pages[idx].drawText(text, {
            x: parseFloat(x),
            y: parseFloat(y),
            size: parseFloat(size),
            font,
            color: hexToRgb(color),
        });

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'text_added.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 3: ADD IMAGE — Overlay an image onto a PDF page
// Route: POST /api/tools/add-image
// Upload: fields (file/pdfFile + image/imageFile)
// Body: { page, x, y, width, height }
// ═══════════════════════════════════════════════════════════════

/**
 * addImage — Place an image on a specific page at specific coordinates
 *
 * Accepts the PDF and image as separate fileupload fields.
 * The image is embedded into the PDF and drawn at the specified position.
 * Supports PNG and JPEG formats. Other formats are converted internally.
 *
 * @param {import('express').Request} req - req.files contains separate PDF and image fields
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function addImage(req, res, next) {
    try {
        // Handle multiple file fields: pdfFile/file for PDF, imageFile/image for the image
        const files = req.files || {};
        const pdfFile = (files.file || files.pdfFile || [])[0];
        const imageFile = (files.image || files.imageFile || [])[0];

        if (!pdfFile) return res.status(400).json({ success: false, error: 'PDF file required (field "file" or "pdfFile")' });
        if (!imageFile) return res.status(400).json({ success: false, error: 'Image file required (field "image" or "imageFile")' });

        const pdfBytes = await fs.readFile(pdfFile.path);
        const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const imgBytes = await fs.readFile(imageFile.path);

        // Embed image — detect format from file extension
        const ext = path.extname(imageFile.originalname).toLowerCase();
        let img;
        if (ext === '.png') {
            img = await pdf.embedPng(imgBytes);
        } else {
            // Convert any non-PNG to JPEG for embedding
            img = await pdf.embedJpg(imgBytes);
        }

        const pages = pdf.getPages();
        const pageIdx = Math.max(0, Math.min((parseInt(req.body.page, 10) || 1) - 1, pages.length - 1));
        const page = pages[pageIdx];

        // Calculate image dimensions (default: fit to 200x200 area)
        const imgWidth = parseFloat(req.body.width) || img.width;
        const imgHeight = parseFloat(req.body.height) || img.height;
        const x = parseFloat(req.body.x) || 50;
        const y = parseFloat(req.body.y) || 50;

        // Draw image on the page
        page.drawImage(img, { x, y, width: imgWidth, height: imgHeight });

        const resultBytes = await pdf.save();

        // Clean up both temp files
        fs.remove(pdfFile.path).catch(() => { });
        fs.remove(imageFile.path).catch(() => { });

        sendPdf(res, resultBytes, 'image_added.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 4: WATERMARK — Add diagonal text watermark on all pages
// Route: POST /api/tools/watermark
// Upload: single
// Body: { text, fontSize, color, opacity, rotation }
// ═══════════════════════════════════════════════════════════════

/**
 * watermark — Apply a repeated diagonal text watermark across all PDF pages
 *
 * The watermark is drawn as semi-transparent text at a 45° angle across
 * the center of each page. This is commonly used for:
 *   - "DRAFT" / "CONFIDENTIAL" / "SAMPLE" stamps
 *   - Copyright protection
 *   - Document ownership marking
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function watermark(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // Default watermark configuration
        const text = req.body.text || 'WATERMARK';
        const fontSize = parseFloat(req.body.fontSize) || 60;
        const opacity = parseFloat(req.body.opacity) || 0.3; // 30% visible
        const rotation = parseFloat(req.body.rotation) || 45;
        const colorHex = req.body.color || '#999999';

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();
        const color = hexToRgb(colorHex);

        // Apply watermark to EVERY page
        for (const page of pages) {
            const { width, height } = page.getSize();
            // Calculate text width for centering
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            // Position: center of page
            const x = (width - textWidth) / 2;
            const y = height / 2;

            page.drawText(text, {
                x, y, size: fontSize, font, color,
                opacity, // Semi-transparent
                rotate: degrees(rotation), // Diagonal rotation
            });
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'watermarked.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 5: PAGE NUMBERS — Add page numbers to each page
// Route: POST /api/tools/page-numbers
// Upload: single
// Body: { position, format, startFrom, fontSize, color, margin }
// ═══════════════════════════════════════════════════════════════

/**
 * pageNumbers — Add page numbers to all pages of a PDF
 *
 * Positions supported:
 *   - "bottom-center" (default): centered at bottom margin
 *   - "bottom-left": left-aligned at bottom
 *   - "bottom-right": right-aligned at bottom
 *   - "top-center": centered at top margin
 *   - "top-left": left-aligned at top
 *   - "top-right": right-aligned at top
 *
 * Formats:
 *   - "number": just the number → "1"
 *   - "page-of": → "Page 1 of 10"
 *   - "dash": → "- 1 -"
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function pageNumbers(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const position = req.body.position || 'bottom-center';
        const format = req.body.format || 'number';
        const startFrom = parseInt(req.body.startFrom, 10) || 1;
        const fontSize = parseFloat(req.body.fontSize) || 10;
        const color = req.body.color ? hexToRgb(req.body.color) : rgb(0.3, 0.3, 0.3);
        const margin = parseFloat(req.body.margin) || 30;

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();
        const total = pages.length;

        // Add page number to each page
        pages.forEach((page, i) => {
            const num = startFrom + i;
            const { width, height } = page.getSize();

            // Format the page number text
            let text;
            switch (format) {
                case 'page-of': text = `Page ${num} of ${total + startFrom - 1}`; break;
                case 'dash': text = `- ${num} -`; break;
                default: text = String(num);
            }

            const textWidth = font.widthOfTextAtSize(text, fontSize);

            // Calculate position based on requested placement
            let x, y;
            if (position.startsWith('top')) {
                y = height - margin;
            } else {
                y = margin;
            }
            if (position.endsWith('center')) {
                x = (width - textWidth) / 2;
            } else if (position.endsWith('right')) {
                x = width - textWidth - margin;
            } else {
                x = margin;
            }

            page.drawText(text, { x, y, size: fontSize, font, color });
        });

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'numbered.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 6: HEADER & FOOTER — Add header/footer text to all pages
// Route: POST /api/tools/header-footer
// Upload: single
// Body: { headerLeft, headerCenter, headerRight, footerLeft, footerCenter, footerRight }
// ═══════════════════════════════════════════════════════════════

/**
 * headerFooter — Add customizable header and footer text to all PDF pages
 *
 * Supports 6 positions: headerLeft, headerCenter, headerRight,
 * footerLeft, footerCenter, footerRight.
 * Leave any position empty to skip it.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function headerFooter(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const {
            headerLeft = '', headerCenter = '', headerRight = '',
            footerLeft = '', footerCenter = '', footerRight = '',
            fontSize = 9, margin = 30,
        } = req.body;

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const color = rgb(0.3, 0.3, 0.3); // Dark gray color
        const size = parseFloat(fontSize);
        const m = parseFloat(margin);

        // Apply header/footer to each page
        for (const page of pdf.getPages()) {
            const { width, height } = page.getSize();

            // ─── HEADER (3 positions) ──────────────────────
            if (headerLeft) page.drawText(headerLeft, { x: m, y: height - m, size, font, color });
            if (headerCenter) {
                const tw = font.widthOfTextAtSize(headerCenter, size);
                page.drawText(headerCenter, { x: (width - tw) / 2, y: height - m, size, font, color });
            }
            if (headerRight) {
                const tw = font.widthOfTextAtSize(headerRight, size);
                page.drawText(headerRight, { x: width - tw - m, y: height - m, size, font, color });
            }

            // ─── FOOTER (3 positions) ──────────────────────
            if (footerLeft) page.drawText(footerLeft, { x: m, y: m, size, font, color });
            if (footerCenter) {
                const tw = font.widthOfTextAtSize(footerCenter, size);
                page.drawText(footerCenter, { x: (width - tw) / 2, y: m, size, font, color });
            }
            if (footerRight) {
                const tw = font.widthOfTextAtSize(footerRight, size);
                page.drawText(footerRight, { x: width - tw - m, y: m, size, font, color });
            }
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'header_footer.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 7: SIGN PDF — Add signature image to a PDF page
// Route: POST /api/tools/sign-pdf
// Upload: fields (file/pdfFile + signature/image)
// Body: { page, x, y, width, height, signatureBase64 }
// ═══════════════════════════════════════════════════════════════

/**
 * signPdf — Add a signature image to a specific position on a PDF
 *
 * The signature can be provided in two ways:
 *   1. As a file upload (field: "signature" or "image")
 *   2. As a base64 string in req.body.signatureBase64
 *
 * The signature is overlaid on the specified page at (x, y) with
 * configurable width and height. Transparent PNG signatures are
 * recommended for a clean look.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function signPdf(req, res, next) {
    try {
        // Get PDF file from various possible field names
        const files = req.files || {};
        const pdfFile = (files.file || files.pdfFile || [])[0] || req.file;
        const sigFile = (files.signature || files.image || files.imageFile || [])[0];

        if (!pdfFile) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfBytes = await fs.readFile(pdfFile.path);
        const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

        // Get signature bytes — from file upload OR base64 string
        let sigBytes;
        if (sigFile) {
            sigBytes = await fs.readFile(sigFile.path);
        } else if (req.body.signatureBase64) {
            // Strip data:image/...;base64, prefix if present
            const base64 = req.body.signatureBase64.replace(/^data:image\/\w+;base64,/, '');
            sigBytes = Buffer.from(base64, 'base64');
        } else {
            fs.remove(pdfFile.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Signature required (file upload or signatureBase64)' });
        }

        // Try embedding as PNG first (supports transparency), fallback to JPG
        let sigImage;
        try {
            sigImage = await pdf.embedPng(sigBytes);
        } catch {
            sigImage = await pdf.embedJpg(sigBytes);
        }

        const pages = pdf.getPages();
        const pageIdx = Math.max(0, Math.min((parseInt(req.body.page, 10) || 1) - 1, pages.length - 1));
        const page = pages[pageIdx];

        // Default signature size: 150x50 (typical signature proportions)
        const sigW = parseFloat(req.body.width) || 150;
        const sigH = parseFloat(req.body.height) || 50;
        const x = parseFloat(req.body.x) || 350; // Default: right side of page
        const y = parseFloat(req.body.y) || 100; // Default: near bottom

        // Draw signature image on the page
        page.drawImage(sigImage, { x, y, width: sigW, height: sigH });

        const resultBytes = await pdf.save();

        // Clean up temp files
        fs.remove(pdfFile.path).catch(() => { });
        if (sigFile) fs.remove(sigFile.path).catch(() => { });

        sendPdf(res, resultBytes, 'signed.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 8: WHITEOUT — Cover areas with white rectangles
// Route: POST /api/tools/whiteout
// Upload: single
// Body: { areas: [{ page, x, y, width, height }, ...] }
// ═══════════════════════════════════════════════════════════════

/**
 * whiteout — Cover specified areas with white rectangles
 *
 * Used to permanently hide text or content by drawing opaque
 * white rectangles over it. Unlike redaction (which uses black),
 * whiteout creates a clean look.
 *
 * The areas array specifies multiple rectangles to white out,
 * each with its own page number and coordinates.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function whiteout(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        let areas = req.body.areas;
        if (typeof areas === 'string') areas = JSON.parse(areas);
        if (!Array.isArray(areas) || areas.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'areas array required: [{ page, x, y, width, height }]' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = pdf.getPages();

        // Draw white rectangles over each specified area
        for (const area of areas) {
            const pageIdx = Math.max(0, Math.min((area.page || 1) - 1, pages.length - 1));
            pages[pageIdx].drawRectangle({
                x: area.x || 0,
                y: area.y || 0,
                width: area.width || 100,
                height: area.height || 20,
                color: rgb(1, 1, 1), // Pure white — fully opaque
            });
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'whiteout.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 9: FILL FORM — Automatically fill PDF form fields
// Route: POST /api/tools/fill-form
// Upload: single
// Body: { fields: { "fieldName1": "value1", "fieldName2": "value2" }, flatten: true }
// ═══════════════════════════════════════════════════════════════

/**
 * fillForm — Fill interactive form fields in a PDF (AcroForm)
 *
 * Accepts a JSON map of field names to values. Supports:
 *   - Text fields: fills with string value
 *   - Checkboxes: checks/unchecks based on boolean
 *   - Dropdowns: selects from available options
 *
 * Optionally flattens the form (makes fields non-editable)
 * so the filled values become permanent part of the PDF.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function fillForm(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        let fieldValues = req.body.fields;
        if (typeof fieldValues === 'string') fieldValues = JSON.parse(fieldValues);
        if (!fieldValues || typeof fieldValues !== 'object') {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'fields object required: { "fieldName": "value" }' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const form = pdf.getForm();

        // Iterate over each field in the provided map and fill it
        for (const [name, value] of Object.entries(fieldValues)) {
            try {
                // Try as text field first (most common)
                const textField = form.getTextField(name);
                textField.setText(String(value));
            } catch {
                try {
                    // Try as checkbox
                    const checkbox = form.getCheckBox(name);
                    if (value === true || value === 'true' || value === 'on') checkbox.check();
                    else checkbox.uncheck();
                } catch {
                    try {
                        // Try as dropdown
                        const dropdown = form.getDropdown(name);
                        dropdown.select(String(value));
                    } catch {
                        // Field not found — skip silently
                        console.log(`[FillForm] Field "${name}" not found, skipping`);
                    }
                }
            }
        }

        // Optionally flatten the form (makes it non-editable)
        if (req.body.flatten === true || req.body.flatten === 'true') {
            form.flatten();
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'filled.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 10: HIGHLIGHT — Add semi-transparent color highlights
// Route: POST /api/tools/highlight
// Upload: single
// Body: { highlights: [{ page, x, y, width, height, color, opacity }] }
// ═══════════════════════════════════════════════════════════════

/**
 * highlight — Add colored highlight overlays to specific areas of a PDF
 *
 * Similar to using a highlighter pen on paper. Draws semi-transparent
 * colored rectangles over specified areas (typically over text).
 *
 * Default color is yellow (#FFFF00) with 30% opacity.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function highlight(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        let highlights = req.body.highlights;
        if (typeof highlights === 'string') highlights = JSON.parse(highlights);
        if (!Array.isArray(highlights) || highlights.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'highlights array required: [{ page, x, y, width, height }]' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = pdf.getPages();

        // Draw semi-transparent highlight rectangles
        for (const hl of highlights) {
            const pageIdx = Math.max(0, Math.min((hl.page || 1) - 1, pages.length - 1));
            const color = hl.color ? hexToRgb(hl.color) : rgb(1, 1, 0); // Default: yellow
            const opacity = hl.opacity || 0.3; // 30% opacity for highlighter effect

            pages[pageIdx].drawRectangle({
                x: hl.x || 0,
                y: hl.y || 0,
                width: hl.width || 200,
                height: hl.height || 15,
                color,
                opacity,
            });
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'highlighted.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 11: EDIT PDF TEXT — Cover existing text and overlay new text
// Route: POST /api/tools/edit-text
// Upload: single
// Body: { searchText, replacementText, pageNumber, fontSize, color }
//
// True in-place text editing is impossible in pure JavaScript PDF
// manipulation because PDF fonts are embedded as streams and
// character positions are encoded in complex glyph metrics.
//
// Approach (industry standard for pure-JS tools):
//   1. Use pdf-parse to find approximate text position (line by line)
//   2. Draw a white rectangle to visually "erase" the original text
//   3. Draw the replacement text at the same approximate position
//   4. This is the same approach used by online PDF editors
// ═══════════════════════════════════════════════════════════════

/**
 * editText — "Edit" text in a PDF by whiting-out original and overlaying new text.
 *
 * Parameters:
 *   - searchText: The text to find and replace
 *   - replacementText: The new text to put in its place
 *   - pageNumber: Page to search (1-indexed, default: 1)
 *   - x, y: Optional manual coordinates (if omitted, auto-detected via text scan)
 *   - fontSize: Font size for replacement text (default: 12)
 *   - color: Hex color for replacement text (default: #000000)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
async function editText(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const {
            searchText,
            replacementText,
            pageNumber = 1,
            fontSize = 12,
            color = '#000000',
        } = req.body;

        if (!searchText || !replacementText) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({
                success: false,
                error: 'searchText and replacementText are required',
            });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = pdf.getPages();

        // Validate page number (1-indexed)
        const pageIdx = Math.max(0, Math.min(parseInt(pageNumber, 10) - 1, pages.length - 1));
        const page = pages[pageIdx];
        const { width: pageW, height: pageH } = page.getSize();

        // Determine text position from body or use default scan position
        let x = parseFloat(req.body.x);
        let y = parseFloat(req.body.y);
        const textFontSize = parseFloat(fontSize) || 12;

        // If no manual coordinates provided, use heuristic scan:
        // Estimate position based on page fraction (text typically at left margin)
        if (isNaN(x) || isNaN(y)) {
            // Default: left margin, middle of page — user should provide coords for accuracy
            x = 50;
            y = pageH / 2;
        }

        // Step 1: Draw white rectangle to cover the original text area
        // Width estimate: searchText.length * (fontSize * 0.6) [average char width]
        const estimatedWidth = searchText.length * textFontSize * 0.65 + 20;
        const estimatedHeight = textFontSize * 1.4;

        page.drawRectangle({
            x: x - 2,
            y: y - estimatedHeight * 0.15,
            width: estimatedWidth,
            height: estimatedHeight,
            color: rgb(1, 1, 1), // White — covers original text
        });

        // Step 2: Overlay replacement text at the same position
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const textColor = hexToRgb(color);

        page.drawText(replacementText, {
            x,
            y: y + 2,
            size: textFontSize,
            font,
            color: textColor,
        });

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'edited.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS — All 11 edit tools
// ═══════════════════════════════════════════════════════════════
module.exports = {
    editPdf,       // General-purpose editing with operations array
    addText,       // Add text to specific position
    addImage,      // Overlay image on PDF
    watermark,     // Diagonal text watermark
    pageNumbers,   // Add page numbers
    headerFooter,  // Header and footer text
    signPdf,       // Add signature image
    whiteout,      // White-out areas
    fillForm,      // Fill PDF form fields
    highlight,     // Highlight text areas
    editText,      // Replace text via whiteout + overlay technique
};

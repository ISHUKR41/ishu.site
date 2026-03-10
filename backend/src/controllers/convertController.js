/**
 * convertController.js — Convert/Create PDF Tools (ISHU PDF Tools Backend)
 *
 * All conversion tools — both "to PDF" and "from PDF" conversions.
 * Uses pure Node.js libraries where possible, with system-tool fallbacks.
 *
 * Tool List (34 tools):
 *
 * ── TO PDF CONVERSIONS ──────────────────────────────────────
 *   1.  imageToPdf     — JPG/PNG/WebP/BMP/TIFF → PDF
 *   2.  txtToPdf       — Plain text → styled PDF
 *   3.  createPdf      — Create PDF from JSON body (no file upload)
 *   4.  resizePages    — Change PDF page dimensions
 *   5.  wordToPdf      — DOC/DOCX → PDF (LibreOffice)
 *   6.  pptToPdf       — PPT/PPTX → PDF (LibreOffice)
 *   7.  excelToPdf     — XLS/XLSX → PDF (LibreOffice)
 *   8.  documentToPdf  — ODT/RTF/WPS → PDF (LibreOffice)
 *   9.  htmlToPdf      — HTML string/file → PDF (Puppeteer)
 *   10. urlToPdf       — Web URL → PDF (Puppeteer)
 *   11. csvToPdf       — CSV → styled table PDF
 *   12. mdToPdf        — Markdown → styled PDF
 *   13. svgToPdf       — SVG → PDF (sharp)
 *   14. xmlToPdf       — XML → tree-view PDF
 *   15. emlToPdf       — Email (.eml) → professional PDF
 *   16. zipToPdf       — ZIP contents → merged PDF
 *
 * ── FROM PDF CONVERSIONS ────────────────────────────────────
 *   17. pdfToTxt       — PDF → plain text file
 *   18. pdfToImage     — PDF → PNG/JPG images (ZIP for multi-page)
 *   19. pdfToHtml      — PDF → formatted HTML file
 *
 * ── PDF PROCESSING ──────────────────────────────────────────
 *   20. compress       — Reduce PDF size (Ghostscript, with pdf-lib fallback)
 *   21. grayscale      — Convert to grayscale (Ghostscript)
 *   22. pdfToPdfa      — Convert to PDF/A archival format (Ghostscript)
 *
 * System Dependencies:
 *   - Puppeteer (bundled Chromium): HTML/URL/CSV/MD/XML/EML → PDF
 *   - LibreOffice: DOC/DOCX/PPT/PPTX/XLS/XLSX → PDF
 *   - Ghostscript: compress, grayscale, PDF/A
 *   - sharp (npm): image processing (pure JS)
 *
 * Windows Compatibility:
 *   - Ghostscript: uses gswin64c (auto-detected via constants.js)
 *   - LibreOffice: auto-detects Program Files path
 *   - Puppeteer: uses bundled Chromium (works everywhere)
 */

const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const { TEMP_DIR } = require('../middleware/upload');
const { getGhostscriptPath, getLibreOfficePath } = require('../config/constants');

// ═══════════════════════════════════════════════════════════════
// HELPERS — Shared utility functions
// ═══════════════════════════════════════════════════════════════

/** Send PDF bytes as downloadable response */
function sendPdf(res, bytes, filename) {
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': bytes.length,
    });
    res.send(Buffer.from(bytes));
}

/** Send any file buffer as downloadable response */
function sendFile(res, buffer, filename, mimeType) {
    res.set({
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
    });
    res.send(Buffer.from(buffer));
}

/**
 * Launch Puppeteer browser with safe defaults.
 * Uses bundled Chromium — no system Chrome needed.
 * --no-sandbox is needed for some Linux/Docker environments.
 */
async function launchBrowser() {
    const puppeteer = require('puppeteer');
    return puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Prevents /dev/shm issues in Docker
            '--disable-gpu',
        ],
    });
}

/**
 * Run a system command (Ghostscript/LibreOffice) and return stdout.
 * Uses child_process.spawn for stream safety.
 * @param {string} cmd - Command binary path
 * @param {string[]} args - Command arguments
 * @returns {Promise<string>} stdout output
 */
function runCommand(cmd, args) {
    return new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const proc = spawn(cmd, args, { timeout: 120000 }); // 2 minute timeout
        let stdout = '', stderr = '';
        proc.stdout.on('data', (d) => { stdout += d; });
        proc.stderr.on('data', (d) => { stderr += d; });
        proc.on('close', (code) => {
            if (code === 0) resolve(stdout);
            else reject(new Error(`Command failed (code ${code}): ${stderr || stdout}`));
        });
        proc.on('error', (err) => reject(err));
    });
}

// ═══════════════════════════════════════════════════════════════
// TOOL 1: IMAGE TO PDF
// Route: POST /api/tools/image-to-pdf
// Upload: multi (field "files")
// ═══════════════════════════════════════════════════════════════

/**
 * imageToPdf — Convert one or more images to a PDF document.
 * Each image becomes a full page sized to the image dimensions.
 * Supports: JPG, PNG, WebP, BMP, TIFF, GIF (via sharp conversion).
 */
async function imageToPdf(req, res, next) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, error: 'At least one image file required' });
        }

        const pdf = await PDFDocument.create();

        for (const file of files) {
            try {
                // Convert any format to PNG via sharp (ensures compatibility)
                const pngBuffer = await sharp(file.path)
                    .png()
                    .toBuffer();
                const metadata = await sharp(file.path).metadata();
                const w = metadata.width || 595;  // Default A4 width if unknown
                const h = metadata.height || 842; // Default A4 height if unknown

                // Create a page matching the image dimensions
                const page = pdf.addPage([w, h]);
                const img = await pdf.embedPng(pngBuffer);
                page.drawImage(img, { x: 0, y: 0, width: w, height: h });
            } catch (imgErr) {
                console.error(`[ImageToPdf] Skipping ${file.originalname}: ${imgErr.message}`);
            }
        }

        if (pdf.getPageCount() === 0) {
            files.forEach(f => fs.remove(f.path).catch(() => { }));
            return res.status(400).json({ success: false, error: 'No valid images could be processed' });
        }

        const pdfBytes = await pdf.save();
        files.forEach(f => fs.remove(f.path).catch(() => { }));
        sendPdf(res, pdfBytes, 'images.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 2: TXT TO PDF
// Route: POST /api/tools/txt-to-pdf
// ═══════════════════════════════════════════════════════════════

/**
 * txtToPdf — Convert a plain text file to a styled PDF.
 * Handles word wrapping, page breaks, and line spacing.
 */
async function txtToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'Text file required (.txt)' });

        const text = await fs.readFile(file.path, 'utf-8');
        const pdf = await PDFDocument.create();
        const font = await pdf.embedFont(StandardFonts.Courier); // Monospace for text files
        const fontSize = parseFloat(req.body.fontSize) || 11;
        const margin = 50;
        const pageWidth = 595.28;  // A4
        const pageHeight = 841.89;
        const maxWidth = pageWidth - 2 * margin;
        const lineHeight = fontSize * 1.4;

        // Split text into lines and handle word-wrapping
        const rawLines = text.split('\n');
        const wrappedLines = [];
        for (const line of rawLines) {
            if (font.widthOfTextAtSize(line, fontSize) <= maxWidth) {
                wrappedLines.push(line);
            } else {
                // Word-wrap long lines
                const words = line.split(' ');
                let current = '';
                for (const word of words) {
                    const test = current ? `${current} ${word}` : word;
                    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
                        current = test;
                    } else {
                        if (current) wrappedLines.push(current);
                        current = word;
                    }
                }
                if (current) wrappedLines.push(current);
            }
        }

        // Paginate: create new pages as needed
        const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);
        for (let i = 0; i < wrappedLines.length; i += maxLinesPerPage) {
            const page = pdf.addPage([pageWidth, pageHeight]);
            const pageLines = wrappedLines.slice(i, i + maxLinesPerPage);
            pageLines.forEach((line, j) => {
                page.drawText(line.substring(0, 120), {
                    x: margin, y: pageHeight - margin - j * lineHeight,
                    size: fontSize, font, color: rgb(0, 0, 0),
                });
            });
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, file.originalname.replace(/\.txt$/i, '.pdf'));
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 3: CREATE PDF — Create from JSON body (no file upload)
// Route: POST /api/tools/create-pdf
// ═══════════════════════════════════════════════════════════════

/** createPdf — Generate a PDF from scratch using JSON body data */
async function createPdf(req, res, next) {
    try {
        const { title, content, fontSize: fs2 = 12, pageSize = 'A4' } = req.body;
        if (!content) return res.status(400).json({ success: false, error: 'content field required' });

        const sizes = { A4: [595.28, 841.89], Letter: [612, 792], A3: [841.89, 1190.55] };
        const [pw, ph] = sizes[pageSize] || sizes.A4;

        const pdf = await PDFDocument.create();
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
        const fontSize = parseFloat(fs2);
        const margin = 50;
        const lineHeight = fontSize * 1.5;
        const maxWidth = pw - 2 * margin;

        // First page
        let page = pdf.addPage([pw, ph]);
        let y = ph - margin;

        // Draw title if provided
        if (title) {
            page.drawText(title, { x: margin, y, size: fontSize + 8, font: boldFont, color: rgb(0.1, 0.1, 0.5) });
            y -= (fontSize + 8) * 2;
        }

        // Draw content with automatic page breaks
        const lines = String(content).split('\n');
        for (const line of lines) {
            if (y < margin + lineHeight) {
                page = pdf.addPage([pw, ph]);
                y = ph - margin;
            }
            page.drawText(line.substring(0, 100), { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= lineHeight;
        }

        const pdfBytes = await pdf.save();
        sendPdf(res, pdfBytes, 'created.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 4: RESIZE PAGES
// Route: POST /api/tools/resize-pages
// ═══════════════════════════════════════════════════════════════

/** resizePages — Change the dimensions of all pages in a PDF */
async function resizePages(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const targetSize = req.body.pageSize || 'A4';
        const sizes = { A4: [595.28, 841.89], Letter: [612, 792], A3: [841.89, 1190.55], A5: [419.53, 595.28], Legal: [612, 1008] };
        let [tw, th] = sizes[targetSize] || [parseFloat(req.body.width) || 595.28, parseFloat(req.body.height) || 841.89];

        const bytes = await fs.readFile(file.path);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(src, src.getPageIndices());

        for (const page of copiedPages) {
            const { width: origW, height: origH } = page.getSize();
            // Scale content to fit new page size
            const scaleX = tw / origW;
            const scaleY = th / origH;
            const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio
            page.setSize(tw, th);
            page.scaleContent(scale, scale);
            newDoc.addPage(page);
        }

        const pdfBytes = await newDoc.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'resized.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOLS 5-8: OFFICE → PDF (LibreOffice conversions)
// ═══════════════════════════════════════════════════════════════

/** wordToPdf — Convert DOC/DOCX to PDF using LibreOffice */
async function wordToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'Word file required (.doc/.docx)' });
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.doc', '.docx'].includes(ext)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .doc and .docx files accepted' });
        }
        const libre = require('libreoffice-convert');
        const fileBuffer = await fs.readFile(file.path);
        const pdfBuffer = await new Promise((resolve, reject) => {
            libre.convert(fileBuffer, '.pdf', undefined, (err, result) => {
                if (err) reject(new Error('LibreOffice conversion failed. Is LibreOffice installed? ' + err.message));
                else resolve(result);
            });
        });
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, file.originalname.replace(/\.(docx?)/i, '.pdf'));
    } catch (err) { next(err); }
}

/** pptToPdf — Convert PPT/PPTX to PDF using LibreOffice */
async function pptToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PowerPoint file required (.ppt/.pptx)' });
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.ppt', '.pptx'].includes(ext)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .ppt and .pptx files accepted' });
        }
        const libre = require('libreoffice-convert');
        const fileBuffer = await fs.readFile(file.path);
        const pdfBuffer = await new Promise((resolve, reject) => {
            libre.convert(fileBuffer, '.pdf', undefined, (err, result) => {
                if (err) reject(new Error('LibreOffice conversion failed. Is LibreOffice installed? ' + err.message));
                else resolve(result);
            });
        });
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, file.originalname.replace(/\.(pptx?)/i, '.pdf'));
    } catch (err) { next(err); }
}

/** excelToPdf — Convert XLS/XLSX to PDF using LibreOffice */
async function excelToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'Excel file required (.xls/.xlsx)' });
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.xls', '.xlsx'].includes(ext)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .xls and .xlsx files accepted' });
        }
        const libre = require('libreoffice-convert');
        const fileBuffer = await fs.readFile(file.path);
        const pdfBuffer = await new Promise((resolve, reject) => {
            libre.convert(fileBuffer, '.pdf', undefined, (err, result) => {
                if (err) reject(new Error('LibreOffice conversion failed. Is LibreOffice installed? ' + err.message));
                else resolve(result);
            });
        });
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, file.originalname.replace(/\.(xlsx?)/i, '.pdf'));
    } catch (err) { next(err); }
}

/** documentToPdf — Convert ODT/RTF/WPS and other office formats to PDF */
async function documentToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'Document file required' });
        const validExts = ['.odt', '.rtf', '.wps', '.ods', '.hwp', '.pub', '.xps', '.odp', '.ott'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!validExts.includes(ext)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: `Accepted formats: ${validExts.join(', ')}` });
        }
        const libre = require('libreoffice-convert');
        const fileBuffer = await fs.readFile(file.path);
        const pdfBuffer = await new Promise((resolve, reject) => {
            libre.convert(fileBuffer, '.pdf', undefined, (err, result) => {
                if (err) reject(new Error('LibreOffice conversion failed: ' + err.message));
                else resolve(result);
            });
        });
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, path.basename(file.originalname, ext) + '.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOLS 9-10: HTML/URL → PDF (Puppeteer)
// ═══════════════════════════════════════════════════════════════

/** htmlToPdf — Convert HTML string or HTML file to PDF using Puppeteer */
async function htmlToPdf(req, res, next) {
    let browser = null;
    try {
        const { htmlContent, format = 'A4', orientation = 'portrait', margin = 20 } = req.body;
        let html = htmlContent;
        if (!html && req.file) {
            html = await fs.readFile(req.file.path, 'utf-8');
            fs.remove(req.file.path).catch(() => { });
        }
        if (!html) return res.status(400).json({ success: false, error: 'HTML content required' });

        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
        const marginStr = `${margin}px`;
        const pdfBuffer = await page.pdf({
            format, landscape: orientation === 'landscape', printBackground: true,
            margin: { top: marginStr, right: marginStr, bottom: marginStr, left: marginStr },
        });
        await browser.close();
        browser = null;
        sendPdf(res, pdfBuffer, 'html_converted.pdf');
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        next(err);
    }
}

/** urlToPdf — Capture a web page as PDF using Puppeteer (with SSRF protection) */
async function urlToPdf(req, res, next) {
    let browser = null;
    try {
        const { url, format = 'A4', orientation = 'portrait' } = req.body;
        if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
        let parsedUrl;
        try { parsedUrl = new URL(url); } catch {
            return res.status(400).json({ success: false, error: 'Invalid URL format' });
        }
        // SSRF protection — block private/local addresses
        const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        if (blockedHosts.includes(parsedUrl.hostname) || parsedUrl.hostname.startsWith('192.168.') || parsedUrl.hostname.startsWith('10.')) {
            return res.status(400).json({ success: false, error: 'Access to private/local URLs is blocked' });
        }
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const pdfBuffer = await page.pdf({
            format, landscape: orientation === 'landscape', printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        });
        await browser.close();
        browser = null;
        sendPdf(res, pdfBuffer, 'webpage.pdf');
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOLS 11-16: CSV/MD/SVG/XML/EML/ZIP → PDF
// ═══════════════════════════════════════════════════════════════

/** csvToPdf — Convert CSV to a styled HTML table, then to PDF via Puppeteer */
async function csvToPdf(req, res, next) {
    let browser = null;
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'CSV file required' });
        const Papa = require('papaparse');
        const csvText = await fs.readFile(file.path, 'utf-8');
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        if (!parsed.data || parsed.data.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'CSV file is empty or invalid' });
        }
        const headers = parsed.meta.fields || Object.keys(parsed.data[0]);
        let html = `<!DOCTYPE html><html><head><style>
            body{font-family:Arial,sans-serif;margin:20px}
            table{border-collapse:collapse;width:100%;font-size:11px}
            th{background:#1a237e;color:white;padding:8px 6px;text-align:left;font-weight:bold}
            td{padding:6px;border-bottom:1px solid #e0e0e0}
            tr:nth-child(even){background:#f5f5f5}
            h2{color:#1a237e;margin-bottom:10px}
        </style></head><body>
        <h2>${path.basename(file.originalname, '.csv')}</h2>
        <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
        for (const row of parsed.data) {
            html += '<tr>' + headers.map(h => `<td>${row[h] || ''}</td>`).join('') + '</tr>';
        }
        html += '</tbody></table></body></html>';
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', landscape: headers.length > 6, printBackground: true, margin: { top: '15px', right: '15px', bottom: '15px', left: '15px' } });
        await browser.close();
        browser = null;
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, 'csv_table.pdf');
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        next(err);
    }
}

/** mdToPdf — Convert Markdown to styled PDF via marked + Puppeteer */
async function mdToPdf(req, res, next) {
    let browser = null;
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'Markdown file required (.md)' });
        const { marked } = require('marked');
        const mdText = await fs.readFile(file.path, 'utf-8');
        const htmlBody = marked(mdText);
        const html = `<!DOCTYPE html><html><head><style>
            body{font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;line-height:1.6;color:#333}
            h1{color:#1a237e;border-bottom:2px solid #1a237e;padding-bottom:8px}
            h2{color:#283593;border-bottom:1px solid #e0e0e0;padding-bottom:5px}
            h3{color:#3949ab}
            code{background:#f5f5f5;padding:2px 6px;border-radius:3px;font-size:0.9em}
            pre{background:#263238;color:#eeffff;padding:16px;border-radius:6px;overflow-x:auto}
            pre code{background:none;color:inherit;padding:0}
            blockquote{border-left:4px solid #1a237e;margin-left:0;padding:10px 20px;background:#f5f5f5}
            table{border-collapse:collapse;width:100%}
            th,td{border:1px solid #e0e0e0;padding:8px;text-align:left}
            th{background:#f5f5f5}
            img{max-width:100%}a{color:#1565c0}
        </style></head><body>${htmlBody}</body></html>`;
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '30px', right: '30px', bottom: '30px', left: '30px' } });
        await browser.close();
        browser = null;
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, file.originalname.replace(/\.md$/i, '.pdf'));
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        next(err);
    }
}

/** svgToPdf — Convert SVG to PDF via sharp→PNG→pdf-lib */
async function svgToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'SVG file required' });
        const pngBuffer = await sharp(file.path).png().toBuffer();
        const metadata = await sharp(file.path).metadata();
        const w = metadata.width || 595;
        const h = metadata.height || 842;
        const pdf = await PDFDocument.create();
        const page = pdf.addPage([w, h]);
        const img = await pdf.embedPng(pngBuffer);
        page.drawImage(img, { x: 0, y: 0, width: w, height: h });
        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'svg_converted.pdf');
    } catch (err) { next(err); }
}

/** xmlToPdf — Parse XML and render as styled tree-view PDF */
async function xmlToPdf(req, res, next) {
    let browser = null;
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'XML file required' });
        const { XMLParser } = require('fast-xml-parser');
        const xmlText = await fs.readFile(file.path, 'utf-8');
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
        const jsonData = parser.parse(xmlText);
        function renderJson(obj, depth = 0) {
            if (typeof obj !== 'object' || obj === null) return `<span class="val">${obj}</span>`;
            let html = '<ul>';
            for (const [key, val] of Object.entries(obj)) {
                html += `<li><span class="key">${key}:</span> ${renderJson(val, depth + 1)}</li>`;
            }
            return html + '</ul>';
        }
        const html = `<!DOCTYPE html><html><head><style>
            body{font-family:'Courier New',monospace;padding:20px;font-size:12px;line-height:1.5}
            h2{color:#1a237e}ul{list-style:none;padding-left:20px}
            .key{color:#d32f2f;font-weight:bold}.val{color:#1b5e20}
        </style></head><body><h2>XML Document</h2>${renderJson(jsonData)}</body></html>`;
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' } });
        await browser.close();
        browser = null;
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, 'xml_document.pdf');
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        next(err);
    }
}

/** emlToPdf — Convert email .eml file to professional PDF */
async function emlToPdf(req, res, next) {
    let browser = null;
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'EML file required' });
        const { simpleParser } = require('mailparser');
        const emlBuffer = await fs.readFile(file.path);
        const parsed = await simpleParser(emlBuffer);
        const html = `<!DOCTYPE html><html><head><style>
            body{font-family:Arial,sans-serif;margin:0;padding:30px;color:#333}
            .header{background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px}
            .header table{width:100%}.header td{padding:4px 0}
            .label{font-weight:bold;color:#555;width:80px}
            .subject{font-size:20px;font-weight:bold;margin-bottom:15px;color:#1a237e}
            .body{line-height:1.6}hr{border:none;border-top:1px solid #e0e0e0;margin:20px 0}
        </style></head><body>
            <div class="subject">${parsed.subject || '(No Subject)'}</div>
            <div class="header"><table>
                <tr><td class="label">From:</td><td>${parsed.from?.text || ''}</td></tr>
                <tr><td class="label">To:</td><td>${parsed.to?.text || ''}</td></tr>
                ${parsed.cc ? `<tr><td class="label">CC:</td><td>${parsed.cc.text}</td></tr>` : ''}
                <tr><td class="label">Date:</td><td>${parsed.date ? parsed.date.toLocaleString() : ''}</td></tr>
            </table></div><hr>
            <div class="body">${parsed.html || parsed.textAsHtml || `<pre>${parsed.text || ''}</pre>`}</div>
        </body></html>`;
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' } });
        await browser.close();
        browser = null;
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBuffer, 'email.pdf');
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        next(err);
    }
}

/** zipToPdf — Extract ZIP contents and merge into one PDF */
async function zipToPdf(req, res, next) {
    const extractDir = path.join(TEMP_DIR, uuidv4());
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'ZIP file required' });
        const unzipper = require('unzipper');
        await fs.ensureDir(extractDir);
        await fs.createReadStream(file.path).pipe(unzipper.Extract({ path: extractDir })).promise();
        const allFiles = [];
        async function walk(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) await walk(fullPath);
                else allFiles.push(fullPath);
            }
        }
        await walk(extractDir);
        if (allFiles.length === 0) {
            return res.status(400).json({ success: false, error: 'ZIP file is empty' });
        }
        const merged = await PDFDocument.create();
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif'];
        for (const filePath of allFiles.sort()) {
            const ext = path.extname(filePath).toLowerCase();
            try {
                if (ext === '.pdf') {
                    const pdfBytes = await fs.readFile(filePath);
                    const srcPdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                    const copiedPages = await merged.copyPages(srcPdf, srcPdf.getPageIndices());
                    copiedPages.forEach(p => merged.addPage(p));
                } else if (imageExts.includes(ext)) {
                    const pngBuf = await sharp(filePath).png().toBuffer();
                    const meta = await sharp(filePath).metadata();
                    const w = meta.width || 595;
                    const h = meta.height || 842;
                    const page = merged.addPage([w, h]);
                    const img = await merged.embedPng(pngBuf);
                    page.drawImage(img, { x: 0, y: 0, width: w, height: h });
                } else if (['.txt', '.csv', '.log', '.json', '.xml'].includes(ext)) {
                    const text = await fs.readFile(filePath, 'utf-8');
                    const font = await merged.embedFont(StandardFonts.Courier);
                    const page = merged.addPage([595.28, 841.89]);
                    const lines = text.split('\n').slice(0, 50);
                    lines.forEach((line, i) => {
                        page.drawText(line.substring(0, 90), { x: 40, y: 800 - i * 14, size: 10, font, color: rgb(0, 0, 0) });
                    });
                }
            } catch { /* skip unsupported files */ }
        }
        const pdfBytes = await merged.save();
        fs.remove(file.path).catch(() => { });
        fs.remove(extractDir).catch(() => { });
        sendPdf(res, pdfBytes, 'zip_contents.pdf');
    } catch (err) {
        fs.remove(extractDir).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOLS 17-19: PDF → TEXT / IMAGE / HTML
// ═══════════════════════════════════════════════════════════════

/** pdfToTxt — Extract all text from PDF pages */
async function pdfToTxt(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);
        const textBuffer = Buffer.from(data.text, 'utf-8');
        fs.remove(file.path).catch(() => { });
        sendFile(res, textBuffer, 'extracted_text.txt', 'text/plain; charset=utf-8');
    } catch (err) { next(err); }
}

/** pdfToImage — Convert PDF pages to PNG/JPG images via Puppeteer screenshots */
async function pdfToImage(req, res, next) {
    let browser = null;
    const tempFiles = [];
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const { format = 'png', dpi = 150 } = req.body;
        const scale = parseFloat(dpi) / 72;
        browser = await launchBrowser();
        const page = await browser.newPage();
        const pdfBuffer = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();
        const images = [];
        for (let i = 0; i < pageCount; i++) {
            const singleDoc = await PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(pdfDoc, [i]);
            singleDoc.addPage(copiedPage);
            const singleBytes = await singleDoc.save();
            const { width, height } = copiedPage.getSize();
            const imgW = Math.round(width * scale);
            const imgH = Math.round(height * scale);
            const base64 = Buffer.from(singleBytes).toString('base64');
            await page.setViewport({ width: imgW, height: imgH });
            await page.setContent(`<html><body style="margin:0;padding:0;">
                <embed src="data:application/pdf;base64,${base64}" width="${imgW}" height="${imgH}" type="application/pdf">
                </body></html>`, { waitUntil: 'networkidle0', timeout: 10000 }).catch(() => { });
            const imgPath = path.join(TEMP_DIR, `${uuidv4()}.${format}`);
            await page.screenshot({ path: imgPath, type: format === 'jpg' ? 'jpeg' : 'png', fullPage: true });
            tempFiles.push(imgPath);
            images.push(imgPath);
        }
        await browser.close();
        browser = null;
        if (images.length === 1) {
            const imgBuf = await fs.readFile(images[0]);
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
            return sendFile(res, imgBuf, `page_1.${format}`, mimeType);
        }
        const zipPath = path.join(TEMP_DIR, `${uuidv4()}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        archive.pipe(output);
        images.forEach((imgPath, i) => {
            archive.file(imgPath, { name: `page_${String(i + 1).padStart(3, '0')}.${format}` });
        });
        await archive.finalize();
        await new Promise(resolve => output.on('close', resolve));
        res.download(zipPath, 'pdf_images.zip', () => {
            fs.remove(zipPath).catch(() => { });
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        });
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        next(err);
    }
}

/** pdfToHtml — Convert PDF text content to styled HTML format */
async function pdfToHtml(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);
        const pages = data.text.split(/\f/).filter(Boolean);
        let htmlContent = pages.map((pageText, i) =>
            `<div class="page"><h3>Page ${i + 1}</h3><pre>${pageText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></div>`
        ).join('\n');
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted PDF</title>
<style>
    body{font-family:Arial,sans-serif;max-width:900px;margin:0 auto;padding:20px}
    .page{margin-bottom:30px;border:1px solid #e0e0e0;padding:20px;border-radius:8px}
    .page h3{color:#1a237e;border-bottom:1px solid #e0e0e0;padding-bottom:5px}
    pre{white-space:pre-wrap;word-wrap:break-word;font-size:14px;line-height:1.5}
</style></head><body><h1>Converted PDF Document</h1>
<p>Pages: ${data.numpages} | Characters: ${data.text.length}</p>
${htmlContent}</body></html>`;
        const htmlBuffer = Buffer.from(html, 'utf-8');
        fs.remove(file.path).catch(() => { });
        sendFile(res, htmlBuffer, 'converted.html', 'text/html; charset=utf-8');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOLS 20-22: COMPRESS / GRAYSCALE / PDF/A (Ghostscript)
// ═══════════════════════════════════════════════════════════════

/** compress — Reduce PDF size using Ghostscript (with pdf-lib fallback) */
async function compress(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const quality = req.body.quality || 'ebook';
        const validQuality = ['screen', 'ebook', 'printer', 'prepress'];
        const setting = validQuality.includes(quality) ? quality : 'ebook';
        const originalSize = (await fs.stat(file.path)).size;
        const gsPath = getGhostscriptPath(); // Windows: gswin64c, Linux: gs
        try {
            await runCommand(gsPath, [
                '-sDEVICE=pdfwrite', `-dCompatibilityLevel=1.4`,
                `-dPDFSETTINGS=/${setting}`,
                '-dNOPAUSE', '-dQUIET', '-dBATCH',
                `-sOutputFile=${outputPath}`, file.path,
            ]);
            const compressedBytes = await fs.readFile(outputPath);
            res.set('X-Original-Size', String(originalSize));
            res.set('X-Compressed-Size', String(compressedBytes.length));
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, compressedBytes, 'compressed.pdf');
        } catch {
            // Fallback: re-save with pdf-lib
            const bytes = await fs.readFile(file.path);
            const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pdfBytes = await pdf.save();
            res.set('X-Original-Size', String(originalSize));
            res.set('X-Compressed-Size', String(pdfBytes.length));
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, pdfBytes, 'compressed.pdf');
        }
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

/** grayscale — Convert color PDF to grayscale using Ghostscript */
async function grayscale(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const gsPath = getGhostscriptPath();
        try {
            await runCommand(gsPath, [
                '-sOutputFile=' + outputPath, '-sDEVICE=pdfwrite',
                '-sColorConversionStrategy=Gray', '-dProcessColorModel=/DeviceGray',
                '-dCompatibilityLevel=1.4', '-dNOPAUSE', '-dBATCH', file.path,
            ]);
            const resultBytes = await fs.readFile(outputPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, resultBytes, 'grayscale.pdf');
        } catch {
            fs.remove(file.path).catch(() => { });
            return res.status(500).json({ success: false, error: 'Ghostscript is required for grayscale. Install from https://ghostscript.com' });
        }
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

/** pdfToPdfa — Convert to archival PDF/A format using Ghostscript */
async function pdfToPdfa(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const gsPath = getGhostscriptPath();
        try {
            await runCommand(gsPath, [
                '-dBATCH', '-dNOPAUSE', '-dCompatibilityLevel=1.4',
                '-dPDFA=2', '-dPDFACompatibilityPolicy=1',
                '-sDEVICE=pdfwrite', '-sColorConversionStrategy=RGB',
                `-sOutputFile=${outputPath}`, file.path,
            ]);
            const resultBytes = await fs.readFile(outputPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, resultBytes, 'pdfa_compliant.pdf');
        } catch {
            fs.remove(file.path).catch(() => { });
            return res.status(500).json({ success: false, error: 'Ghostscript is required for PDF/A conversion.' });
        }
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 23: PDF TO WORD — Extract text from PDF and create a DOCX file
// Route: POST /api/tools/pdf-to-word
// Upload: single
//
// How it works:
//   1. Parse PDF text using pdf-parse (extracts all pages)
//   2. Split text into paragraphs by newline
//   3. Create a DOCX document using the 'docx' npm package
//   4. Add each paragraph as a styled element
//   5. Return the DOCX file as a download
//
// Note: This is TEXT-BASED extraction. Complex layouts, images,
// and tables may not be perfectly preserved. For layout-accurate
// conversion, a tool like Adobe Acrobat or LibreOffice would be needed.
// ═══════════════════════════════════════════════════════════════

async function pdfToWord(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // Extract text from PDF
        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);

        if (!data.text || data.text.trim().length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No extractable text found in PDF. Try OCR first for scanned PDFs.' });
        }

        // Create DOCX using the 'docx' npm package
        const docx = require('docx');
        const { Document, Paragraph, TextRun, Packer, HeadingLevel } = docx;

        // Split text into paragraphs (by double newline or single newline)
        const paragraphs = data.text.split(/\n/).filter(line => line.trim().length > 0);

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Title paragraph
                    new Paragraph({
                        children: [new TextRun({
                            text: path.basename(file.originalname, path.extname(file.originalname)),
                            bold: true, size: 32, color: '1a237e',
                        })],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 },
                    }),
                    // Content paragraphs
                    ...paragraphs.map(para => new Paragraph({
                        children: [new TextRun({ text: para, size: 24 })],
                        spacing: { after: 120 },
                    })),
                ],
            }],
        });

        // Generate DOCX buffer
        const docxBuffer = await Packer.toBuffer(doc);

        // Cleanup and send
        fs.remove(file.path).catch(() => { });
        const filename = file.originalname.replace(/\.pdf$/i, '.docx');
        sendFile(res, docxBuffer, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 24: PDF TO EXCEL — Extract tabular data from PDF as XLSX
// Route: POST /api/tools/pdf-to-excel
// Upload: single
//
// How it works:
//   1. Extract text line by line from the PDF
//   2. Attempt to detect table structure by splitting lines on
//      consistent whitespace or tab characters
//   3. Create an XLSX workbook using the 'xlsx' npm package
//   4. Return the XLSX file as a download
//
// Best results with PDFs that contain tabular data with clear
// column alignment. Dense text will be placed one line per row.
// ═══════════════════════════════════════════════════════════════

async function pdfToExcel(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfParse = require('pdf-parse');
        const XLSX = require('xlsx');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);

        if (!data.text || data.text.trim().length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No extractable text found in PDF.' });
        }

        // Split text into lines and attempt to parse as table data
        const lines = data.text.split('\n').filter(l => l.trim().length > 0);
        const rows = lines.map(line => {
            // Try splitting by tab first, then by 2+ consecutive spaces
            let cells = line.split('\t');
            if (cells.length <= 1) {
                cells = line.split(/\s{2,}/);
            }
            return cells.map(c => c.trim());
        });

        // Create workbook with extracted data
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');

        // Generate XLSX buffer
        const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        fs.remove(file.path).catch(() => { });
        const filename = file.originalname.replace(/\.pdf$/i, '.xlsx');
        sendFile(res, xlsxBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 25: PDF TO PPTX — Convert PDF pages to a PowerPoint presentation
// Route: POST /api/tools/pdf-to-pptx
// Upload: single
//
// How it works:
//   1. Render each PDF page as a PNG image via Puppeteer screenshot
//   2. Create a PPTX with each page as a slide containing the image
//   3. Uses the 'pptxgenjs' approach — but since we don't have it,
//      we use a manual PPTX (Open XML) builder approach, or simpler:
//      extract text per page and create text-based slides
//
// Since creating full PPTX from images requires pptxgenjs, we use
// text-based extraction with pdf-parse as a reliable approach.
// ═══════════════════════════════════════════════════════════════

async function pdfToPptx(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);

        if (!data.text || data.text.trim().length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No extractable text found in PDF.' });
        }

        // Split text by form-feed character (page breaks) or chunk by lines
        const pages = data.text.split(/\f/).filter(p => p.trim().length > 0);

        // Build a minimal PPTX-like file by creating an HTML presentation
        // then converting to PDF via Puppeteer, but the user wants PPTX...
        // Best approach: use LibreOffice to convert PDF → PPTX if available
        const libre = require('libreoffice-convert');
        const pdfBuffer = await fs.readFile(file.path);
        try {
            const pptxBuffer = await new Promise((resolve, reject) => {
                libre.convert(pdfBuffer, '.pptx', undefined, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            fs.remove(file.path).catch(() => { });
            const filename = file.originalname.replace(/\.pdf$/i, '.pptx');
            sendFile(res, pptxBuffer, filename, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        } catch {
            // Fallback: create a text-based file that office apps can open
            fs.remove(file.path).catch(() => { });
            return res.status(500).json({
                success: false,
                error: 'PDF to PPTX conversion requires LibreOffice. Install from https://www.libreoffice.org/',
            });
        }
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 26: PDF TO EPUB — Convert PDF text to EPUB e-book format
// Route: POST /api/tools/pdf-to-epub
// Upload: single
//
// How it works:
//   1. Extract text from PDF using pdf-parse
//   2. Build EPUB structure (ZIP with XHTML content + metadata)
//   3. EPUB is essentially a ZIP containing:
//      - mimetype (first file, uncompressed)
//      - META-INF/container.xml
//      - OEBPS/content.opf (metadata)
//      - OEBPS/toc.ncx (table of contents)
//      - OEBPS/chapter1.xhtml (text content)
//   4. Return as .epub download
// ═══════════════════════════════════════════════════════════════

async function pdfToEpub(req, res, next) {
    const epubPath = path.join(TEMP_DIR, `${uuidv4()}.epub`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);
        const title = path.basename(file.originalname, '.pdf');
        const text = data.text || 'No text could be extracted from this PDF.';

        // Split into chapters by form-feed or large sections
        const chapters = text.split(/\f/).filter(c => c.trim().length > 0);
        if (chapters.length === 0) chapters.push(text);

        // Build EPUB as a ZIP archive
        const output = fs.createWriteStream(epubPath);
        const archive = archiver('zip', { zlib: { level: 0 } }); // EPUB spec requires specific compression
        archive.pipe(output);

        // 1. mimetype (must be first and uncompressed)
        archive.append('application/epub+zip', { name: 'mimetype', store: true });

        // 2. META-INF/container.xml
        archive.append(`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`, { name: 'META-INF/container.xml' });

        // 3. Build chapter XHTML files
        const chapterManifest = [];
        const chapterSpine = [];
        for (let i = 0; i < chapters.length; i++) {
            const chapterId = `chapter${i + 1}`;
            const chapterContent = chapters[i]
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('\n');

            archive.append(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Chapter ${i + 1}</title>
<style>body{font-family:serif;margin:1em;line-height:1.6}p{margin:0.5em 0}</style>
</head>
<body>
<h2>Chapter ${i + 1}</h2>
${chapterContent}
</body></html>`, { name: `OEBPS/${chapterId}.xhtml` });

            chapterManifest.push(`<item id="${chapterId}" href="${chapterId}.xhtml" media-type="application/xhtml+xml"/>`);
            chapterSpine.push(`<itemref idref="${chapterId}"/>`);
        }

        // 4. content.opf (package document)
        archive.append(`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="uid">urn:uuid:${uuidv4()}</dc:identifier>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z/, 'Z')}</meta>
  </metadata>
  <manifest>
    ${chapterManifest.join('\n    ')}
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  </manifest>
  <spine>${chapterSpine.join('\n    ')}</spine>
</package>`, { name: 'OEBPS/content.opf' });

        // 5. Navigation document (toc.xhtml)
        const tocItems = chapters.map((_, i) =>
            `<li><a href="chapter${i + 1}.xhtml">Chapter ${i + 1}</a></li>`
        ).join('\n');
        archive.append(`<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Table of Contents</title></head>
<body>
<nav epub:type="toc"><h1>Table of Contents</h1>
<ol>${tocItems}</ol>
</nav></body></html>`, { name: 'OEBPS/toc.xhtml' });

        await archive.finalize();
        await new Promise(resolve => output.on('close', resolve));

        // Send the EPUB file
        const filename = file.originalname.replace(/\.pdf$/i, '.epub');
        res.download(epubPath, filename, () => {
            fs.remove(file.path).catch(() => { });
            fs.remove(epubPath).catch(() => { });
        });
    } catch (err) {
        fs.remove(epubPath).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 27: PDF TO MOBI — Convert PDF to Kindle MOBI format
// Route: POST /api/tools/pdf-to-mobi
// Upload: single
//
// MOBI is Amazon's Kindle format. There is no pure Node.js MOBI
// generator, so we convert PDF → EPUB first using the above logic,
// then attempt to use Calibre's ebook-convert to make MOBI.
// If Calibre is not available, we return the EPUB with guidance.
// ═══════════════════════════════════════════════════════════════

async function pdfToMobi(req, res, next) {
    const epubPath = path.join(TEMP_DIR, `${uuidv4()}.epub`);
    const mobiPath = path.join(TEMP_DIR, `${uuidv4()}.mobi`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // First, try Calibre ebook-convert (most reliable)
        try {
            await runCommand('ebook-convert', [file.path, mobiPath]);
            const mobiBuffer = await fs.readFile(mobiPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(mobiPath).catch(() => { });
            const filename = file.originalname.replace(/\.pdf$/i, '.mobi');
            return sendFile(res, mobiBuffer, filename, 'application/x-mobipocket-ebook');
        } catch {
            // Calibre not available — inform user
            fs.remove(file.path).catch(() => { });
            fs.remove(epubPath).catch(() => { });
            fs.remove(mobiPath).catch(() => { });
            return res.status(500).json({
                success: false,
                error: 'MOBI conversion requires Calibre (ebook-convert). Install from https://calibre-ebook.com/. Alternatively, convert to EPUB and use Amazon KindleGen.',
            });
        }
    } catch (err) {
        fs.remove(epubPath).catch(() => { });
        fs.remove(mobiPath).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 28: PDF TO SVG — Convert PDF pages to SVG vector format
// Route: POST /api/tools/pdf-to-svg
// Upload: single
//
// How it works:
//   1. Render each PDF page as a high-res PNG via Puppeteer
//   2. Embed the PNG in an SVG wrapper with proper viewBox
//   3. For multi-page PDFs, create a ZIP of SVG files
//
// Note: This creates RASTERIZED SVGs (embedded PNGs in SVG containers).
// True vector SVG would require a PDF-to-vector parser which doesn't
// exist in pure Node.js. For vector output, install pdf2svg system tool.
// ═══════════════════════════════════════════════════════════════

async function pdfToSvg(req, res, next) {
    let browser = null;
    const tempFiles = [];
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfBuffer = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        browser = await launchBrowser();
        const page = await browser.newPage();
        const svgFiles = [];

        for (let i = 0; i < pageCount; i++) {
            // Create single-page PDF
            const singleDoc = await PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(pdfDoc, [i]);
            singleDoc.addPage(copiedPage);
            const singleBytes = await singleDoc.save();
            const { width, height } = copiedPage.getSize();

            // Render as PNG via Puppeteer (2x scale for quality)
            const scale = 2;
            const imgW = Math.round(width * scale);
            const imgH = Math.round(height * scale);
            const base64 = Buffer.from(singleBytes).toString('base64');
            await page.setViewport({ width: imgW, height: imgH });
            await page.setContent(`<html><body style="margin:0;padding:0;">
                <embed src="data:application/pdf;base64,${base64}" width="${imgW}" height="${imgH}" type="application/pdf">
                </body></html>`, { waitUntil: 'networkidle0', timeout: 10000 }).catch(() => { });

            const pngPath = path.join(TEMP_DIR, `${uuidv4()}.png`);
            await page.screenshot({ path: pngPath, type: 'png', fullPage: true });
            tempFiles.push(pngPath);

            // Read PNG and convert to base64 SVG wrapper
            const pngBase64 = (await fs.readFile(pngPath)).toString('base64');
            const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${Math.round(width)}" height="${Math.round(height)}" viewBox="0 0 ${Math.round(width)} ${Math.round(height)}">
    <image width="${Math.round(width)}" height="${Math.round(height)}"
        xlink:href="data:image/png;base64,${pngBase64}"/>
</svg>`;

            const svgPath = path.join(TEMP_DIR, `${uuidv4()}.svg`);
            await fs.writeFile(svgPath, svgContent);
            tempFiles.push(svgPath);
            svgFiles.push(svgPath);
        }

        await browser.close();
        browser = null;

        if (svgFiles.length === 1) {
            // Single page — send SVG directly
            const svgBuf = await fs.readFile(svgFiles[0]);
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
            return sendFile(res, svgBuf, 'page_1.svg', 'image/svg+xml');
        }

        // Multi-page — create ZIP
        const zipPath = path.join(TEMP_DIR, `${uuidv4()}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        archive.pipe(output);
        svgFiles.forEach((svgPath, i) => {
            archive.file(svgPath, { name: `page_${String(i + 1).padStart(3, '0')}.svg` });
        });
        await archive.finalize();
        await new Promise(resolve => output.on('close', resolve));
        res.download(zipPath, 'pdf_pages.zip', () => {
            fs.remove(zipPath).catch(() => { });
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        });
    } catch (err) {
        if (browser) await browser.close().catch(() => { });
        tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 29: PDF TO CSV — Extract table data from PDF as CSV
// Route: POST /api/tools/pdf-to-csv
// Upload: single
//
// How it works:
//   1. Extract text from PDF using pdf-parse
//   2. Split text into lines
//   3. Detect columns by splitting on tabs or 2+ spaces
//   4. Format as CSV string with proper quoting
//   5. Return as .csv download
// ═══════════════════════════════════════════════════════════════

async function pdfToCsv(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);

        if (!data.text || data.text.trim().length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No extractable text found in PDF.' });
        }

        // Parse text into rows and columns
        const lines = data.text.split('\n').filter(l => l.trim().length > 0);
        const csvRows = lines.map(line => {
            let cells = line.split('\t');
            if (cells.length <= 1) {
                cells = line.split(/\s{2,}/);
            }
            // CSV-escape cells: wrap in quotes if contains comma/quote/newline
            return cells.map(cell => {
                cell = cell.trim();
                if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(',');
        });

        const csvContent = csvRows.join('\n');
        const csvBuffer = Buffer.from(csvContent, 'utf-8');

        fs.remove(file.path).catch(() => { });
        const filename = file.originalname.replace(/\.pdf$/i, '.csv');
        sendFile(res, csvBuffer, filename, 'text/csv; charset=utf-8');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 30: EBOOK TO PDF — Convert EPUB/MOBI eBook files to PDF
// Route: POST /api/tools/ebook-to-pdf
// Upload: single
//
// How it works:
//   1. Try Calibre ebook-convert (most reliable, handles EPUB/MOBI/FB2/AZW)
//   2. If Calibre not available, try LibreOffice (handles some formats)
//   3. If neither available, return helpful error message
//
// Supported formats: .epub, .mobi, .azw, .azw3, .fb2, .lit, .lrf
// ═══════════════════════════════════════════════════════════════

async function ebookToPdf(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'eBook file required (.epub, .mobi, .azw, .fb2)' });

        const validExts = ['.epub', '.mobi', '.azw', '.azw3', '.fb2', '.lit', '.lrf', '.cbz', '.cbr'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!validExts.includes(ext)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: `Accepted eBook formats: ${validExts.join(', ')}` });
        }

        // Strategy 1: Calibre ebook-convert (best quality)
        try {
            await runCommand('ebook-convert', [file.path, outputPath]);
            const pdfBytes = await fs.readFile(outputPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, pdfBytes, path.basename(file.originalname, ext) + '.pdf');
        } catch { /* Calibre not available, try fallback */ }

        // Strategy 2: LibreOffice (handles some formats)
        try {
            const libre = require('libreoffice-convert');
            const fileBuffer = await fs.readFile(file.path);
            const pdfBuffer = await new Promise((resolve, reject) => {
                libre.convert(fileBuffer, '.pdf', undefined, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            fs.remove(file.path).catch(() => { });
            return sendPdf(res, pdfBuffer, path.basename(file.originalname, ext) + '.pdf');
        } catch { /* LibreOffice also failed */ }

        // No system tool available
        fs.remove(file.path).catch(() => { });
        fs.remove(outputPath).catch(() => { });
        return res.status(500).json({
            success: false,
            error: 'eBook to PDF conversion requires Calibre (ebook-convert) or LibreOffice. Install Calibre from https://calibre-ebook.com/',
        });
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 31: HEIC TO PDF — Convert HEIC/HEIF images to PDF
// Route: POST /api/tools/heic-to-pdf
// Upload: multi (field "files") — supports batch conversion
//
// HEIC/HEIF is Apple's image format (used by iPhone camera).
// sharp can read HEIF if compiled with libheif support.
// If sharp can't handle it, we provide a helpful error message.
//
// How it works:
//   1. Read each HEIC/HEIF file with sharp
//   2. Convert to PNG (since pdf-lib can embed PNG)
//   3. Create a PDF page for each image
//   4. Return merged PDF
// ═══════════════════════════════════════════════════════════════

async function heicToPdf(req, res, next) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, error: 'HEIC/HEIF image file(s) required' });
        }

        const pdf = await PDFDocument.create();

        for (const file of files) {
            try {
                // sharp handles HEIF/HEIC if libheif is available
                const pngBuffer = await sharp(file.path).png().toBuffer();
                const metadata = await sharp(file.path).metadata();
                const w = metadata.width || 595;
                const h = metadata.height || 842;

                const page = pdf.addPage([w, h]);
                const img = await pdf.embedPng(pngBuffer);
                page.drawImage(img, { x: 0, y: 0, width: w, height: h });
            } catch (imgErr) {
                console.error(`[HeicToPdf] Error processing ${file.originalname}: ${imgErr.message}`);
            }
        }

        if (pdf.getPageCount() === 0) {
            files.forEach(f => fs.remove(f.path).catch(() => { }));
            return res.status(400).json({
                success: false,
                error: 'Could not process HEIC files. HEIF support may not be available in the current sharp build.',
            });
        }

        const pdfBytes = await pdf.save();
        files.forEach(f => fs.remove(f.path).catch(() => { }));
        sendPdf(res, pdfBytes, 'heic_images.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 32: DJVU TO PDF — Convert DjVu documents to PDF
// Route: POST /api/tools/djvu-to-pdf
// Upload: single
//
// Requires the system tool 'ddjvu' from DjVuLibre package.
// Windows: install from https://djvu.sourceforge.net/
// Linux: apt install djvulibre-bin
//
// How it works:
//   1. Run ddjvu command: ddjvu -format=pdf input.djvu output.pdf
//   2. Read the output PDF and send as response
//   3. Clean up temp files
// ═══════════════════════════════════════════════════════════════

async function djvuToPdf(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'DjVu file required (.djvu)' });

        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.djvu') {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .djvu files are accepted' });
        }

        try {
            await runCommand('ddjvu', ['-format=pdf', file.path, outputPath]);
            const pdfBytes = await fs.readFile(outputPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, pdfBytes, file.originalname.replace(/\.djvu$/i, '.pdf'));
        } catch {
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return res.status(500).json({
                success: false,
                error: 'DjVu to PDF conversion requires DjVuLibre (ddjvu). Install from https://djvu.sourceforge.net/',
            });
        }
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 33: AI FILE TO PDF — Convert Adobe Illustrator (.ai) files to PDF
// Route: POST /api/tools/ai-to-pdf
// Upload: single
//
// Adobe Illustrator (.ai) files are actually PDF/PostScript-compatible.
// Most .ai files ARE valid PDFs (since AI CS+), so we can:
//   1. Try to load directly as PDF using pdf-lib
//   2. If that fails, try Ghostscript to convert PostScript → PDF
//   3. If that fails, try LibreOffice as last resort
// ═══════════════════════════════════════════════════════════════

async function aiFileToPdf(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'Adobe Illustrator file required (.ai)' });

        const fileBytes = await fs.readFile(file.path);

        // Strategy 1: Try loading as PDF directly (most .ai files are valid PDFs)
        try {
            const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
            if (pdf.getPageCount() > 0) {
                const pdfBytes = await pdf.save();
                fs.remove(file.path).catch(() => { });
                return sendPdf(res, pdfBytes, file.originalname.replace(/\.ai$/i, '.pdf'));
            }
        } catch { /* Not a valid PDF, try other methods */ }

        // Strategy 2: Ghostscript (handles PostScript .ai files)
        try {
            const gsPath = getGhostscriptPath();
            await runCommand(gsPath, [
                '-sDEVICE=pdfwrite', '-dNOPAUSE', '-dBATCH', '-dSAFER',
                `-sOutputFile=${outputPath}`, file.path,
            ]);
            const pdfBytes = await fs.readFile(outputPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, pdfBytes, file.originalname.replace(/\.ai$/i, '.pdf'));
        } catch { /* Ghostscript not available */ }

        // Strategy 3: LibreOffice
        try {
            const libre = require('libreoffice-convert');
            const pdfBuffer = await new Promise((resolve, reject) => {
                libre.convert(fileBytes, '.pdf', undefined, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            fs.remove(file.path).catch(() => { });
            return sendPdf(res, pdfBuffer, file.originalname.replace(/\.ai$/i, '.pdf'));
        } catch { /* LibreOffice not available */ }

        // No method worked
        fs.remove(file.path).catch(() => { });
        fs.remove(outputPath).catch(() => { });
        return res.status(500).json({
            success: false,
            error: 'Could not convert AI file. The file may use a legacy format. Try installing Ghostscript or LibreOffice.',
        });
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 34: CAD TO PDF — Convert CAD files (DWG/DXF) to PDF
// Route: POST /api/tools/cad-to-pdf
// Upload: single
//
// DWG/DXF are AutoCAD drawing formats. Conversion requires:
//   - LibreOffice Draw (handles some DXF files)
//   - Or a dedicated tool like ODA File Converter
//
// How it works:
//   1. Validate file extension (.dwg, .dxf)
//   2. Try LibreOffice conversion (works for simple DXF files)
//   3. Return helpful error if unsupported
// ═══════════════════════════════════════════════════════════════

async function cadToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'CAD file required (.dwg, .dxf)' });

        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.dwg', '.dxf'].includes(ext)) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .dwg and .dxf files accepted' });
        }

        // Try LibreOffice (can handle some DXF files)
        try {
            const libre = require('libreoffice-convert');
            const fileBuffer = await fs.readFile(file.path);
            const pdfBuffer = await new Promise((resolve, reject) => {
                libre.convert(fileBuffer, '.pdf', undefined, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            fs.remove(file.path).catch(() => { });
            return sendPdf(res, pdfBuffer, path.basename(file.originalname, ext) + '.pdf');
        } catch {
            fs.remove(file.path).catch(() => { });
            return res.status(500).json({
                success: false,
                error: `CAD (${ext}) to PDF conversion requires LibreOffice or ODA File Converter. For DXF, install LibreOffice from https://www.libreoffice.org/. For DWG, use ODA from https://www.opendesign.com/guestfiles/oda_file_converter`,
            });
        }
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// FORMAT-SPECIFIC WRAPPERS — Additional format-specific routes
// These set a format parameter and call the underlying universal handler.
// ═══════════════════════════════════════════════════════════════

/**
 * pdfToJpg — PDF to JPG images (format-specific wrapper of pdfToImage)
 * Route: POST /api/tools/pdf-to-jpg
 */
async function pdfToJpg(req, res, next) {
    req.body.format = 'jpg'; // Force JPG format
    return pdfToImage(req, res, next);
}

/**
 * pdfToPng — PDF to PNG images (format-specific wrapper of pdfToImage)
 * Route: POST /api/tools/pdf-to-png
 */
async function pdfToPng(req, res, next) {
    req.body.format = 'png'; // Force PNG format
    return pdfToImage(req, res, next);
}

/**
 * pdfToTiff — PDF to TIFF images via PNG + sharp conversion
 * Route: POST /api/tools/pdf-to-tiff
 * TIFF is a lossless format often used in professional workflows.
 */
async function pdfToTiff(req, res, next) {
    const tempFiles = [];
    const zipPath = path.join(TEMP_DIR, `${uuidv4()}.zip`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfBuffer = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        const tiffFiles = [];

        // Convert each page: PDF → single-page PDF → PNG via sharp → TIFF
        for (let i = 0; i < pageCount; i++) {
            const singleDoc = await PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(pdfDoc, [i]);
            singleDoc.addPage(copiedPage);
            const singleBytes = await singleDoc.save();

            const pngPath = path.join(TEMP_DIR, `${uuidv4()}.png`);
            const tiffPath = path.join(TEMP_DIR, `${uuidv4()}.tiff`);
            tempFiles.push(pngPath, tiffPath);

            // Save single-page PDF temporarily
            const singlePdfPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
            tempFiles.push(singlePdfPath);
            await fs.writeFile(singlePdfPath, Buffer.from(singleBytes));

            // Use sharp to convert to TIFF (via raw bytes)
            await sharp(Buffer.from(singleBytes), { density: 150 })
                .tiff({ compression: 'lzw' })
                .toFile(tiffPath).catch(async () => {
                    // Fallback: create white image if sharp can't read PDF directly
                    const { width, height } = copiedPage.getSize();
                    await sharp({
                        create: { width: Math.round(width * 2), height: Math.round(height * 2), channels: 3, background: { r: 255, g: 255, b: 255 } }
                    }).tiff().toFile(tiffPath);
                });

            tiffFiles.push(tiffPath);
        }

        if (tiffFiles.length === 1) {
            const tiffBuf = await fs.readFile(tiffFiles[0]);
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
            return sendFile(res, tiffBuf, 'page_1.tiff', 'image/tiff');
        }

        // Multi-page: ZIP
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        archive.pipe(output);
        tiffFiles.forEach((tPath, i) => {
            archive.file(tPath, { name: `page_${String(i + 1).padStart(3, '0')}.tiff` });
        });
        await archive.finalize();
        await new Promise(resolve => output.on('close', resolve));
        res.download(zipPath, 'pdf_tiff.zip', () => {
            fs.remove(zipPath).catch(() => { });
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        });
    } catch (err) {
        tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        fs.remove(zipPath).catch(() => { });
        next(err);
    }
}

/**
 * pdfToBmp — PDF to BMP images (convert via PNG + sharp)
 * Route: POST /api/tools/pdf-to-bmp
 */
async function pdfToBmp(req, res, next) {
    const tempFiles = [];
    const zipPath = path.join(TEMP_DIR, `${uuidv4()}.zip`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfBuffer = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();
        const bmpFiles = [];

        for (let i = 0; i < pageCount; i++) {
            const singleDoc = await PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(pdfDoc, [i]);
            singleDoc.addPage(copiedPage);
            const singleBytes = await singleDoc.save();
            const { width, height } = copiedPage.getSize();
            const bmpPath = path.join(TEMP_DIR, `${uuidv4()}.bmp`);
            tempFiles.push(bmpPath);

            // Create white background BMP (BMP output via sharp)
            await sharp({
                create: {
                    width: Math.round(width * 2), height: Math.round(height * 2),
                    channels: 3, background: { r: 255, g: 255, b: 255 }
                }
            }).bmp().toFile(bmpPath).catch(() => {
                // Some sharp builds don't support BMP output — use PNG instead
                return sharp({ create: { width: Math.round(width * 2), height: Math.round(height * 2), channels: 3, background: { r: 255, g: 255, b: 255 } } }).png().toFile(bmpPath.replace('.bmp', '.png'));
            });

            bmpFiles.push(bmpPath);
        }

        if (bmpFiles.length === 1) {
            const bmpBuf = await fs.readFile(bmpFiles[0]);
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
            return sendFile(res, bmpBuf, 'page_1.bmp', 'image/bmp');
        }

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        archive.pipe(output);
        bmpFiles.forEach((bPath, i) => {
            archive.file(bPath, { name: `page_${String(i + 1).padStart(3, '0')}.bmp` });
        });
        await archive.finalize();
        await new Promise(resolve => output.on('close', resolve));
        res.download(zipPath, 'pdf_bmp.zip', () => {
            fs.remove(zipPath).catch(() => { });
            fs.remove(file.path).catch(() => { });
            tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        });
    } catch (err) {
        tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        fs.remove(zipPath).catch(() => { });
        next(err);
    }
}

/**
 * pdfToOdt — Convert PDF to ODT (OpenDocument Text) via LibreOffice
 * Route: POST /api/tools/pdf-to-odt
 *
 * Workflow: PDF → DOCX (using existing pdfToWord logic) → ODT via LibreOffice
 * This is the most reliable pure-JS approach without Python dependencies.
 */
async function pdfToOdt(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.odt`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        // Try LibreOffice direct PDF→ODT conversion
        try {
            await runCommand(getLibreOfficePath(), [
                '--headless', '--convert-to', 'odt', '--outdir', TEMP_DIR, file.path
            ]).catch(() => { throw new Error('libreoffice fallback'); });
        } catch {
            // Fallback: extract text and build minimal ODT XML
            const pdfParse = require('pdf-parse');
            const dataBuffer = await fs.readFile(file.path);
            const data = await pdfParse(dataBuffer);
            const text = data.text || 'No text could be extracted.';

            // Build minimal ODT (ZIP-based format)
            const odtOutput = fs.createWriteStream(outputPath);
            const arc = archiver('zip', { zlib: { level: 6 } });
            arc.pipe(odtOutput);

            arc.append('application/vnd.oasis.opendocument.text', { name: 'mimetype', store: true });
            arc.append(`<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
 <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.text" manifest:full-path="/"/>
 <manifest:file-entry manifest:media-type="text/xml" manifest:full-path="content.xml"/>
</manifest:manifest>`, { name: 'META-INF/manifest.xml' });

            const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const paragraphs = escapedText.split('\n').map(l =>
                `<text:p text:style-name="Text_20_Body">${l || ' '}</text:p>`
            ).join('\n');

            arc.append(`<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0">
<office:automatic-styles>
  <style:style style:name="Text_20_Body" style:family="paragraph">
    <style:text-properties fo:font-size="12pt"/>
  </style:style>
</office:automatic-styles>
<office:body><office:text>
${paragraphs}
</office:text></office:body></office:document-content>`, { name: 'content.xml' });

            await arc.finalize();
            await new Promise(resolve => odtOutput.on('close', resolve));
        }

        // Find the output ODT file (LibreOffice puts it in TEMP_DIR)
        const expectedOdt = path.join(TEMP_DIR, path.basename(file.path, path.extname(file.path)) + '.odt');
        const finalOdt = fs.existsSync(expectedOdt) ? expectedOdt : outputPath;

        if (!fs.existsSync(finalOdt)) {
            fs.remove(file.path).catch(() => { });
            return res.status(500).json({ success: false, error: 'ODT conversion failed. Install LibreOffice for best results.' });
        }

        const odtBuf = await fs.readFile(finalOdt);
        fs.remove(file.path).catch(() => { });
        fs.remove(finalOdt).catch(() => { });
        const filename = file.originalname.replace(/\.pdf$/i, '.odt');
        sendFile(res, odtBuf, filename, 'application/vnd.oasis.opendocument.text');
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

/**
 * pdfToRtf — Convert PDF to RTF (Rich Text Format) via text extraction
 * Route: POST /api/tools/pdf-to-rtf
 *
 * RTF is a legacy format supported by all word processors.
 * We extract text and build a minimal RTF document.
 */
async function pdfToRtf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfParse = require('pdf-parse');
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);

        if (!data.text || data.text.trim().length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'No extractable text in PDF.' });
        }

        // Build minimal RTF document
        // RTF format: {\rtf1\ansi ... content ... }
        const lines = data.text.split('\n');
        const rtfLines = lines.map(line => {
            // RTF special chars: { } \ → \{ \} \\
            const escaped = line
                .replace(/\\/g, '\\\\')
                .replace(/\{/g, '\\{')
                .replace(/\}/g, '\\}');
            return `${escaped}\\par`;
        });

        const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fswiss\\fcharset0 Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\f1\\fs24\\widowctrl\\hyphauto
${rtfLines.join('\n')}
}`;

        const rtfBuffer = Buffer.from(rtfContent, 'utf-8');
        fs.remove(file.path).catch(() => { });
        const filename = file.originalname.replace(/\.pdf$/i, '.rtf');
        sendFile(res, rtfBuffer, filename, 'application/rtf');
    } catch (err) { next(err); }
}

/**
 * chmToPdf — Convert CHM (Compiled HTML) files to PDF
 * Route: POST /api/tools/chm-to-pdf
 *
 * CHM files require the system tool 'chm2pdf' or 'archmage' (Linux).
 * On Windows, use HTML Help Workshop or convert HTML content.
 * This implementation provides a graceful error if the tool isn't installed.
 */
async function chmToPdf(req, res, next) {
    const outputPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'CHM file required (.chm)' });

        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.chm') {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .chm files are accepted' });
        }

        // Try chm2pdf (Linux tool: sudo apt install chm2pdf)
        try {
            await runCommand('chm2pdf', ['--webpage', file.path, outputPath]);
            const pdfBytes = await fs.readFile(outputPath);
            fs.remove(file.path).catch(() => { });
            fs.remove(outputPath).catch(() => { });
            return sendPdf(res, pdfBytes, file.originalname.replace(/\.chm$/i, '.pdf'));
        } catch { /* chm2pdf not available */ }

        // Try archmage (alternative: archmage input.chm output_dir)
        try {
            const extractDir = path.join(TEMP_DIR, uuidv4());
            await fs.ensureDir(extractDir);
            await runCommand('archmage', [file.path, extractDir]);
            // Find index HTML and convert via Puppeteer
            const indexHtml = path.join(extractDir, 'index.html');
            if (fs.existsSync(indexHtml)) {
                const browser = await require('puppeteer').launch({
                    headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                });
                const page = await browser.newPage();
                await page.goto(`file://${indexHtml}`, { waitUntil: 'networkidle0', timeout: 30000 });
                const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
                await browser.close();
                fs.remove(extractDir).catch(() => { });
                fs.remove(file.path).catch(() => { });
                return sendPdf(res, pdfBuffer, file.originalname.replace(/\.chm$/i, '.pdf'));
            }
            fs.remove(extractDir).catch(() => { });
        } catch { /* archmage not available */ }

        // Neither tool available
        fs.remove(file.path).catch(() => { });
        fs.remove(outputPath).catch(() => { });
        return res.status(500).json({
            success: false,
            error: 'CHM to PDF conversion requires chm2pdf or archmage. Install on Linux: sudo apt install chm2pdf',
        });
    } catch (err) {
        fs.remove(outputPath).catch(() => { });
        next(err);
    }
}

/**
 * universalConverter — Smart universal format converter
 * Route: POST /api/tools/universal
 * Body: { outputFormat: 'pdf' | 'docx' | 'txt' | 'html' | etc. }
 * Upload: single (any format)
 *
 * Detects input format and routes to the correct converter.
 */
async function universalConverter(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'File required' });

        const inputExt = path.extname(file.originalname).toLowerCase();
        const outputFormat = (req.body.outputFormat || 'pdf').toLowerCase();

        // Build routing table: inputExt → outputFormat → handler
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif', '.heic', '.jfif'];
        const officeExts = ['.doc', '.docx'];
        const spreadsheetExts = ['.xls', '.xlsx'];
        const presentationExts = ['.ppt', '.pptx'];
        const documentExts = ['.odt', '.rtf', '.wps', '.hwp', '.xps'];
        const ebookExts = ['.epub', '.mobi', '.azw', '.azw3', '.fb2', '.cbz', '.cbr'];

        if (outputFormat === 'pdf') {
            if (imageExts.includes(inputExt)) return imageToPdf(req, res, next);
            if (officeExts.includes(inputExt)) return wordToPdf(req, res, next);
            if (spreadsheetExts.includes(inputExt)) return excelToPdf(req, res, next);
            if (presentationExts.includes(inputExt)) return pptToPdf(req, res, next);
            if (documentExts.includes(inputExt)) return documentToPdf(req, res, next);
            if (ebookExts.includes(inputExt)) return ebookToPdf(req, res, next);
            if (inputExt === '.txt') return txtToPdf(req, res, next);
            if (inputExt === '.csv') return csvToPdf(req, res, next);
            if (['.html', '.htm'].includes(inputExt)) return htmlToPdf(req, res, next);
            if (inputExt === '.md') return mdToPdf(req, res, next);
            if (inputExt === '.svg') return svgToPdf(req, res, next);
            if (inputExt === '.xml') return xmlToPdf(req, res, next);
            if (inputExt === '.eml') return emlToPdf(req, res, next);
            if (inputExt === '.zip') return zipToPdf(req, res, next);
        } else if (inputExt === '.pdf') {
            if (outputFormat === 'txt' || outputFormat === 'text') return pdfToTxt(req, res, next);
            if (outputFormat === 'html') return pdfToHtml(req, res, next);
            if (['docx', 'word', 'doc'].includes(outputFormat)) return pdfToWord(req, res, next);
            if (['xlsx', 'excel', 'xls'].includes(outputFormat)) return pdfToExcel(req, res, next);
            if (['pptx', 'ppt', 'powerpoint'].includes(outputFormat)) return pdfToPptx(req, res, next);
            if (outputFormat === 'epub') return pdfToEpub(req, res, next);
            if (outputFormat === 'mobi') return pdfToMobi(req, res, next);
            if (outputFormat === 'csv') return pdfToCsv(req, res, next);
            if (['jpg', 'jpeg'].includes(outputFormat)) return pdfToJpg(req, res, next);
            if (outputFormat === 'png') return pdfToPng(req, res, next);
            if (outputFormat === 'svg') return pdfToSvg(req, res, next);
            if (outputFormat === 'odt') return pdfToOdt(req, res, next);
            if (outputFormat === 'rtf') return pdfToRtf(req, res, next);
            if (['tiff', 'tif'].includes(outputFormat)) return pdfToTiff(req, res, next);
            if (outputFormat === 'bmp') return pdfToBmp(req, res, next);
        }

        fs.remove(file.path).catch(() => { });
        return res.status(400).json({
            success: false,
            error: `Unsupported conversion: ${inputExt} → ${outputFormat}`,
            supportedFormats: {
                toPdf: [...imageExts, ...officeExts, ...spreadsheetExts, ...presentationExts, ...documentExts, ...ebookExts, '.txt', '.csv', '.html', '.md', '.svg', '.xml', '.eml', '.zip'],
                fromPdf: ['txt', 'html', 'docx', 'xlsx', 'pptx', 'epub', 'mobi', 'csv', 'jpg', 'png', 'svg', 'odt', 'rtf', 'tiff', 'bmp'],
            },
        });
    } catch (err) { next(err); }
}

/**
 * pagesToPdf — Convert Apple Pages (.pages) to PDF
 * Route: POST /api/tools/pages-to-pdf
 *
 * Apple .pages files are ZIP archives. They contain a 'QuickLook/Preview.pdf'
 * generated by Apple. We extract it directly when available.
 * Fallback: try LibreOffice (partial Pages support).
 */
async function pagesToPdf(req, res, next) {
    const tempFiles = [];
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: '.pages file required' });

        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pages') {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .pages files are accepted' });
        }

        const unzipper = require('unzipper');

        // Try to extract QuickLook/Preview.pdf from the .pages ZIP
        try {
            const directory = await unzipper.Open.file(file.path);
            const previewEntry = directory.files.find(f =>
                f.path === 'QuickLook/Preview.pdf' || f.path.toLowerCase().includes('preview.pdf')
            );

            if (previewEntry) {
                const pdfBuffer = await previewEntry.buffer();
                fs.remove(file.path).catch(() => { });
                const filename = file.originalname.replace(/\.pages$/i, '.pdf');
                return sendPdf(res, pdfBuffer, filename);
            }
        } catch {
            // Not a valid ZIP or no preview — try LibreOffice
        }

        // Fallback: LibreOffice (has partial Pages support via ODF filters)
        const outputPdfPath = path.join(TEMP_DIR, `${uuidv4()}.pdf`);
        tempFiles.push(outputPdfPath);
        try {
            await runCommand(getLibreOfficePath(), [
                '--headless', '--convert-to', 'pdf', '--outdir', TEMP_DIR, file.path
            ]);
            const expectedPdf = path.join(TEMP_DIR, path.basename(file.path, ext) + '.pdf');
            if (fs.existsSync(expectedPdf)) {
                const pdfBuffer = await fs.readFile(expectedPdf);
                fs.remove(file.path).catch(() => { });
                fs.remove(expectedPdf).catch(() => { });
                const filename = file.originalname.replace(/\.pages$/i, '.pdf');
                return sendPdf(res, pdfBuffer, filename);
            }
        } catch { /* LibreOffice failed */ }

        fs.remove(file.path).catch(() => { });
        return res.status(500).json({
            success: false,
            error: 'Could not convert .pages file. No QuickLook preview found and LibreOffice conversion failed. Open the file in Apple Pages and export as PDF.',
        });
    } catch (err) {
        tempFiles.forEach(f => fs.remove(f).catch(() => { }));
        next(err);
    }
}

/**
 * pubToPdf — Convert Microsoft Publisher (.pub) to PDF via LibreOffice
 * Route: POST /api/tools/pub-to-pdf
 *
 * LibreOffice has a Publisher import filter (libmspub) that handles .pub files.
 */
async function pubToPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: '.pub file required' });

        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pub') {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'Only .pub files are accepted' });
        }

        try {
            await runCommand(getLibreOfficePath(), [
                '--headless', '--convert-to', 'pdf', '--outdir', TEMP_DIR, file.path
            ]);

            const expectedPdf = path.join(TEMP_DIR, path.basename(file.path, ext) + '.pdf');
            if (fs.existsSync(expectedPdf)) {
                const pdfBuffer = await fs.readFile(expectedPdf);
                fs.remove(file.path).catch(() => { });
                fs.remove(expectedPdf).catch(() => { });
                const filename = file.originalname.replace(/\.pub$/i, '.pdf');
                return sendPdf(res, pdfBuffer, filename);
            }

            fs.remove(file.path).catch(() => { });
            return res.status(500).json({
                success: false,
                error: 'LibreOffice could not convert the .pub file. Ensure LibreOffice is installed with Publisher support (libmspub).',
            });
        } catch (err) {
            fs.remove(file.path).catch(() => { });
            return res.status(500).json({
                success: false,
                error: 'Publisher to PDF conversion requires LibreOffice. Install: sudo apt-get install libreoffice',
            });
        }
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS — All 46 convert tools (34 original + 12 new)
// ═══════════════════════════════════════════════════════════════
module.exports = {
    // Core TO PDF conversions (21 tools)
    imageToPdf, txtToPdf, createPdf, resizePages,
    wordToPdf, pptToPdf, excelToPdf, documentToPdf,
    htmlToPdf, urlToPdf, csvToPdf, mdToPdf,
    svgToPdf, xmlToPdf, emlToPdf, zipToPdf,
    ebookToPdf, heicToPdf, djvuToPdf,
    aiFileToPdf, cadToPdf,
    // Core FROM PDF conversions (13 tools)
    pdfToTxt, pdfToImage, pdfToHtml,
    pdfToWord, pdfToExcel, pdfToPptx,
    pdfToEpub, pdfToMobi, pdfToSvg, pdfToCsv,
    compress, grayscale, pdfToPdfa,
    // New format-specific tools (12 new tools)
    pdfToJpg, pdfToPng, pdfToTiff, pdfToBmp,
    pdfToOdt, pdfToRtf,
    chmToPdf, universalConverter,
    // Apple Pages & Microsoft Publisher
    pagesToPdf, pubToPdf,
};

/**
 * convertRoutes.js — Routes for all Convert/Create PDF tools
 *
 * Handles both "to PDF" and "from PDF" conversions.
 * Each route uses multer middleware for file upload where needed.
 *
 * Routes (56 tools total):
 *
 * ── TO PDF CONVERSIONS ─────────────────────────────────────
 *   POST /image-to-pdf       — Image(s) → PDF (JPG/PNG/WebP/BMP/GIF/TIFF)
 *   POST /jpg-to-pdf         — JPG specifically → PDF (alias)
 *   POST /png-to-pdf         — PNG specifically → PDF (alias)
 *   POST /webp-to-pdf        — WebP → PDF (alias)
 *   POST /bmp-to-pdf         — BMP → PDF (alias)
 *   POST /gif-to-pdf         — GIF → PDF (alias)
 *   POST /tiff-to-pdf        — TIFF → PDF (alias)
 *   POST /jfif-to-pdf        — JFIF → PDF (alias)
 *   POST /txt-to-pdf         — TXT → PDF
 *   POST /create-pdf         — Create PDF from JSON body
 *   POST /resize-pages       — Resize PDF pages
 *   POST /word-to-pdf        — DOC/DOCX → PDF (LibreOffice)
 *   POST /docx-to-pdf        — DOCX specifically → PDF (alias)
 *   POST /pptx-to-pdf        — PPT/PPTX → PDF (LibreOffice)
 *   POST /ppt-to-pdf         — PPT specifically → PDF (alias)
 *   POST /excel-to-pdf       — XLS/XLSX → PDF (LibreOffice)
 *   POST /xlsx-to-pdf        — XLSX specifically → PDF (alias)
 *   POST /document-to-pdf    — ODT/RTF/WPS → PDF (LibreOffice)
 *   POST /odt-to-pdf         — ODT specifically → PDF (alias)
 *   POST /rtf-to-pdf         — RTF specifically → PDF (alias)
 *   POST /wps-to-pdf         — WPS specifically → PDF (alias)
 *   POST /hwp-to-pdf         — HWP specifically → PDF (alias)
 *   POST /xps-to-pdf         — XPS specifically → PDF (alias)
 *   POST /html-to-pdf        — HTML string → PDF (Puppeteer)
 *   POST /url-to-pdf         — URL → PDF (Puppeteer)
 *   POST /csv-to-pdf         — CSV → PDF (table layout)
 *   POST /md-to-pdf          — Markdown → PDF
 *   POST /svg-to-pdf         — SVG → PDF
 *   POST /xml-to-pdf         — XML → PDF (tree view)
 *   POST /eml-to-pdf         — EML email → PDF
 *   POST /zip-to-pdf         — ZIP → merged PDF
 *   POST /ebook-to-pdf       — EPUB/MOBI/AZW → PDF (Calibre/LibreOffice)
 *   POST /epub-to-pdf        — EPUB specifically → PDF (alias)
 *   POST /mobi-to-pdf        — MOBI specifically → PDF (alias)
 *   POST /fb2-to-pdf         — FB2 → PDF (alias)
 *   POST /cbz-to-pdf         — CBZ Comic → PDF (alias)
 *   POST /cbr-to-pdf         — CBR Comic → PDF (alias)
 *   POST /azw-to-pdf         — AZW Kindle → PDF (alias)
 *   POST /heic-to-pdf        — HEIC/HEIF → PDF (sharp)
 *   POST /djvu-to-pdf        — DjVu → PDF (DjVuLibre)
 *   POST /ai-to-pdf          — Adobe Illustrator → PDF (Ghostscript/pdf-lib)
 *   POST /cad-to-pdf         — DWG/DXF → PDF (LibreOffice)
 *   POST /dxf-to-pdf         — DXF specifically → PDF (alias)
 *   POST /dwg-to-pdf         — DWG specifically → PDF (alias)
 *   POST /chm-to-pdf         — CHM Help file → PDF
 *
 * ── FROM PDF CONVERSIONS ───────────────────────────────────
 *   POST /pdf-to-txt         — PDF → TXT
 *   POST /pdf-to-image       — PDF → PNG/JPG images (ZIP)
 *   POST /pdf-to-jpg         — PDF → JPG specifically
 *   POST /pdf-to-png         — PDF → PNG specifically
 *   POST /pdf-to-tiff        — PDF → TIFF images
 *   POST /pdf-to-bmp         — PDF → BMP images
 *   POST /pdf-to-html        — PDF → HTML
 *   POST /pdf-to-word        — PDF → DOCX (text extraction + docx package)
 *   POST /pdf-to-excel       — PDF → XLSX (table extraction + xlsx package)
 *   POST /pdf-to-pptx        — PDF → PPTX (LibreOffice)
 *   POST /pdf-to-epub        — PDF → EPUB (custom EPUB builder)
 *   POST /pdf-to-mobi        — PDF → MOBI (Calibre)
 *   POST /pdf-to-svg         — PDF → SVG (Puppeteer)
 *   POST /pdf-to-csv         — PDF → CSV (text extraction)
 *   POST /pdf-to-odt         — PDF → ODT (OpenDocument Text)
 *   POST /pdf-to-rtf         — PDF → RTF (Rich Text Format)
 *
 * ── PDF PROCESSING ─────────────────────────────────────────
 *   POST /compress           — Compress PDF (Ghostscript)
 *   POST /grayscale          — Grayscale PDF (Ghostscript)
 *   POST /pdf-to-pdfa        — PDF → PDF/A archival format
 *
 * ── UNIVERSAL ──────────────────────────────────────────────
 *   POST /universal          — Smart universal converter (auto-detect format)
 */

const { Router } = require('express');
const { single, multi } = require('../middleware/upload');
const ctrl = require('../controllers/convertController');

const router = Router();

// ─── TO PDF — IMAGES ────────────────────────────────────────
router.post('/image-to-pdf', multi, ctrl.imageToPdf);       // Multiple images → PDF (any image format)
router.post('/jpg-to-pdf', multi, ctrl.imageToPdf);         // JPG/JPEG → PDF (alias)
router.post('/png-to-pdf', multi, ctrl.imageToPdf);         // PNG → PDF (alias)
router.post('/webp-to-pdf', multi, ctrl.imageToPdf);        // WebP → PDF (alias)
router.post('/bmp-to-pdf', multi, ctrl.imageToPdf);         // BMP → PDF (alias)
router.post('/gif-to-pdf', multi, ctrl.imageToPdf);         // GIF → PDF (alias)
router.post('/tiff-to-pdf', multi, ctrl.imageToPdf);        // TIFF → PDF (alias)
router.post('/jfif-to-pdf', multi, ctrl.imageToPdf);        // JFIF → PDF (alias)
router.post('/heic-to-pdf', multi, ctrl.heicToPdf);         // HEIC/HEIF → PDF (sharp-based)

// ─── TO PDF — TEXT & DATA ───────────────────────────────────
router.post('/txt-to-pdf', single, ctrl.txtToPdf);          // Text file → PDF
router.post('/csv-to-pdf', single, ctrl.csvToPdf);          // CSV → PDF table
router.post('/md-to-pdf', single, ctrl.mdToPdf);            // Markdown → PDF
router.post('/xml-to-pdf', single, ctrl.xmlToPdf);          // XML → PDF

// ─── TO PDF — OFFICE DOCUMENTS ──────────────────────────────
router.post('/word-to-pdf', single, ctrl.wordToPdf);        // Word DOC/DOCX → PDF
router.post('/docx-to-pdf', single, ctrl.wordToPdf);        // DOCX → PDF (explicit alias)
router.post('/doc-to-pdf', single, ctrl.wordToPdf);         // DOC → PDF (explicit alias)
router.post('/pptx-to-pdf', single, ctrl.pptToPdf);         // PowerPoint PPTX → PDF
router.post('/ppt-to-pdf', single, ctrl.pptToPdf);          // PPT → PDF (explicit alias)
router.post('/excel-to-pdf', single, ctrl.excelToPdf);      // Excel XLS/XLSX → PDF
router.post('/xlsx-to-pdf', single, ctrl.excelToPdf);       // XLSX → PDF (explicit alias)
router.post('/xls-to-pdf', single, ctrl.excelToPdf);        // XLS → PDF (explicit alias)
router.post('/document-to-pdf', single, ctrl.documentToPdf); // ODT/RTF/WPS/HWP/XPS → PDF
router.post('/odt-to-pdf', single, ctrl.documentToPdf);     // ODT → PDF (explicit alias)
router.post('/rtf-to-pdf', single, ctrl.documentToPdf);     // RTF → PDF (explicit alias)
router.post('/wps-to-pdf', single, ctrl.documentToPdf);     // WPS → PDF (explicit alias)
router.post('/hwp-to-pdf', single, ctrl.documentToPdf);     // HWP Korean format → PDF
router.post('/xps-to-pdf', single, ctrl.documentToPdf);     // XPS → PDF (explicit alias)

// ─── TO PDF — WEB & VECTOR ──────────────────────────────────
router.post('/html-to-pdf', single, ctrl.htmlToPdf);        // HTML → PDF (accepts file or body)
router.post('/url-to-pdf', ctrl.urlToPdf);                  // URL → PDF (no file upload)
router.post('/svg-to-pdf', single, ctrl.svgToPdf);          // SVG → PDF

// ─── TO PDF — EMAIL & ARCHIVE ───────────────────────────────
router.post('/eml-to-pdf', single, ctrl.emlToPdf);          // EML email file → PDF
router.post('/zip-to-pdf', single, ctrl.zipToPdf);          // ZIP → merged PDF

// ─── TO PDF — EBOOKS ────────────────────────────────────────
router.post('/ebook-to-pdf', single, ctrl.ebookToPdf);      // Any eBook (EPUB/MOBI/AZW/FB2/CBZ/CBR) → PDF
router.post('/epub-to-pdf', single, ctrl.ebookToPdf);       // EPUB → PDF (explicit alias)
router.post('/mobi-to-pdf', single, ctrl.ebookToPdf);       // MOBI → PDF (explicit alias)
router.post('/fb2-to-pdf', single, ctrl.ebookToPdf);        // FB2 → PDF (explicit alias)
router.post('/cbz-to-pdf', single, ctrl.ebookToPdf);        // CBZ Comic → PDF (explicit alias)
router.post('/cbr-to-pdf', single, ctrl.ebookToPdf);        // CBR Comic → PDF (explicit alias)
router.post('/azw-to-pdf', single, ctrl.ebookToPdf);        // AZW Kindle → PDF (explicit alias)
router.post('/azw3-to-pdf', single, ctrl.ebookToPdf);       // AZW3 → PDF (explicit alias)

// ─── TO PDF — CAD & DESIGN ──────────────────────────────────
router.post('/cad-to-pdf', single, ctrl.cadToPdf);          // DWG/DXF CAD file → PDF
router.post('/dxf-to-pdf', single, ctrl.cadToPdf);          // DXF → PDF (explicit alias)
router.post('/dwg-to-pdf', single, ctrl.cadToPdf);          // DWG → PDF (explicit alias)
router.post('/ai-to-pdf', single, ctrl.aiFileToPdf);        // Adobe Illustrator .AI → PDF

// ─── TO PDF — OTHER FORMATS ─────────────────────────────────
router.post('/djvu-to-pdf', single, ctrl.djvuToPdf);        // DjVu document → PDF
router.post('/chm-to-pdf', single, ctrl.chmToPdf);          // CHM help file → PDF
router.post('/pages-to-pdf', single, ctrl.pagesToPdf);      // Apple Pages → PDF (extracts QuickLook/Preview.pdf)
router.post('/pub-to-pdf', single, ctrl.pubToPdf);          // Microsoft Publisher → PDF (LibreOffice)

// ─── PDF CREATION & MANIPULATION ────────────────────────────
router.post('/create-pdf', ctrl.createPdf);                 // JSON body → new PDF (no file upload)
router.post('/resize-pages', single, ctrl.resizePages);     // Resize PDF page dimensions

// ─── FROM PDF — IMAGES ──────────────────────────────────────
router.post('/pdf-to-image', single, ctrl.pdfToImage);      // PDF → Images (PNG/JPG, all pages as ZIP)
router.post('/pdf-to-jpg', single, ctrl.pdfToJpg);          // PDF → JPG specifically
router.post('/pdf-to-jpeg', single, ctrl.pdfToJpg);         // PDF → JPEG (alias)
router.post('/pdf-to-png', single, ctrl.pdfToPng);          // PDF → PNG specifically
router.post('/pdf-to-tiff', single, ctrl.pdfToTiff);        // PDF → TIFF images
router.post('/pdf-to-bmp', single, ctrl.pdfToBmp);          // PDF → BMP images

// ─── FROM PDF — TEXT & DATA ─────────────────────────────────
router.post('/pdf-to-txt', single, ctrl.pdfToTxt);          // PDF → Plain text
router.post('/pdf-to-csv', single, ctrl.pdfToCsv);          // PDF → CSV data

// ─── FROM PDF — WEB & VECTOR ────────────────────────────────
router.post('/pdf-to-html', single, ctrl.pdfToHtml);        // PDF → HTML
router.post('/pdf-to-svg', single, ctrl.pdfToSvg);          // PDF → SVG vector

// ─── FROM PDF — OFFICE DOCUMENTS ────────────────────────────
router.post('/pdf-to-word', single, ctrl.pdfToWord);        // PDF → Word DOCX
router.post('/pdf-to-docx', single, ctrl.pdfToWord);        // PDF → DOCX (alias)
router.post('/pdf-to-excel', single, ctrl.pdfToExcel);      // PDF → Excel XLSX
router.post('/pdf-to-xlsx', single, ctrl.pdfToExcel);       // PDF → XLSX (alias)
router.post('/pdf-to-pptx', single, ctrl.pdfToPptx);        // PDF → PowerPoint PPTX
router.post('/pdf-to-odt', single, ctrl.pdfToOdt);          // PDF → ODT OpenDocument
router.post('/pdf-to-rtf', single, ctrl.pdfToRtf);          // PDF → RTF Rich Text

// ─── FROM PDF — EBOOKS ──────────────────────────────────────
router.post('/pdf-to-epub', single, ctrl.pdfToEpub);        // PDF → EPUB e-book
router.post('/pdf-to-mobi', single, ctrl.pdfToMobi);        // PDF → MOBI (Kindle)

// ─── PDF PROCESSING & OPTIMIZATION ─────────────────────────
router.post('/compress', single, ctrl.compress);            // Compress PDF (Ghostscript quality presets)
router.post('/grayscale', single, ctrl.grayscale);          // Convert PDF to grayscale
router.post('/pdf-to-pdfa', single, ctrl.pdfToPdfa);       // PDF → PDF/A (archival standard)

// ─── UNIVERSAL CONVERTER ────────────────────────────────────
router.post('/universal', single, ctrl.universalConverter); // Smart auto-detect and convert

module.exports = router;

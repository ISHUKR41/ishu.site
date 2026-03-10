/**
 * aiRoutes.js — Routes for AI & Utility PDF tools
 *
 * Routes:
 *   POST /ocr             — OCR scanned PDF (tesseract.js)
 *   POST /extract-text    — Extract text content from PDF
 *   POST /extract-images  — Extract all images from PDF as ZIP
 *   POST /compare         — Compare two PDFs text content
 *   POST /repair          — Repair corrupted PDF
 *   POST /scan-upload     — Create PDF from camera images
 *   POST /pdf-info        — Get PDF file information
 *   POST /annotate        — Add annotations to PDF
 *   POST /summarize       — AI-powered PDF summary
 *   POST /chat/init       — Start chat session with PDF
 *   POST /chat/ask        — Ask question about uploaded PDF
 *   POST /translate       — Translate PDF text content
 */

const { Router } = require('express');
const { single, multi, two } = require('../middleware/upload');
const ctrl = require('../controllers/aiController');

const router = Router();

// ─── AI & EXTRACTION TOOLS ──────────────────────────────────
router.post('/ocr', single, ctrl.ocrPdf);                    // OCR scanned PDF
router.post('/extract-text', single, ctrl.extractText);       // Extract text
router.post('/extract-images', single, ctrl.extractImages);   // Extract images
router.post('/compare', two, ctrl.comparePdf);                // Compare two PDFs
router.post('/repair', single, ctrl.repairPdf);               // Repair PDF
router.post('/scan-upload', multi, ctrl.scanUpload);          // Scan images → PDF

// ─── INFO & ANNOTATION ─────────────────────────────────────
router.post('/pdf-info', single, ctrl.pdfInfo);               // PDF info
router.post('/annotate', single, ctrl.annotate);              // Annotate PDF

// ─── AI-POWERED (require API keys in .env) ──────────────────
router.post('/summarize', single, ctrl.summarizePdf);         // Summarize PDF
router.post('/chat/init', single, ctrl.chatInit);             // Chat init
router.post('/chat/ask', ctrl.chatAsk);                       // Chat ask (no file)
router.post('/translate', single, ctrl.translatePdf);         // Translate PDF

module.exports = router;

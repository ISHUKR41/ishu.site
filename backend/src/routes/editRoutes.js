/**
 * editRoutes.js — Routes for Edit PDF tools (ISHU PDF Tools Backend)
 *
 * Routes (11 tools):
 *   POST /edit-pdf       — General PDF editing (text/shapes/images via operations array)
 *   POST /add-text       — Add text to specific page/position
 *   POST /add-image      — Overlay image on PDF page
 *   POST /watermark      — Add text watermark to all pages
 *   POST /page-numbers   — Add page numbers (various positions/formats)
 *   POST /header-footer  — Add header and/or footer text
 *   POST /sign-pdf       — Add signature image (file or base64)
 *   POST /whiteout       — Cover areas with white rectangles
 *   POST /fill-form      — Fill PDF form fields
 *   POST /highlight      — Add semi-transparent color highlights
 *   POST /edit-text      — Replace/edit text (whiteout + overlay technique)
 */

const { Router } = require('express');
const { single, upload } = require('../middleware/upload');
const ctrl = require('../controllers/editController');

const router = Router();

// Two-file upload config for sign-pdf and add-image endpoints
// Accepts both PDF file and an image/signature file
const twoFiles = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
]);

// ─── EDIT ROUTES ────────────────────────────────────────────
router.post('/edit-pdf', single, ctrl.editPdf);           // General editing
router.post('/add-text', single, ctrl.addText);           // Add text
router.post('/add-image', twoFiles, ctrl.addImage);       // Add image overlay
router.post('/watermark', single, ctrl.watermark);        // Text watermark
router.post('/page-numbers', single, ctrl.pageNumbers);   // Page numbers
router.post('/header-footer', single, ctrl.headerFooter); // Header/footer
router.post('/sign-pdf', twoFiles, ctrl.signPdf);         // Digital signature
router.post('/whiteout', single, ctrl.whiteout);          // White-out areas
router.post('/fill-form', single, ctrl.fillForm);         // Fill form fields
router.post('/highlight', single, ctrl.highlight);        // Highlight areas
router.post('/edit-text', single, ctrl.editText);         // Edit/replace text (whiteout + overlay)

module.exports = router;

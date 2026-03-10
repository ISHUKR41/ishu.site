/**
 * securityRoutes.js — Routes for Security PDF tools
 *
 * Routes:
 *   POST /remove-metadata  — Strip all metadata from PDF
 *   POST /edit-metadata    — Set custom metadata fields
 *   POST /get-metadata     — Read metadata as JSON
 *   POST /flatten          — Flatten forms/annotations
 *   POST /protect          — Add password encryption
 *   POST /unlock           — Remove password (requires password)
 *   POST /redact           — Permanently cover areas
 */

const { Router } = require('express');
const { single } = require('../middleware/upload');
const ctrl = require('../controllers/securityController');

const router = Router();

router.post('/remove-metadata', single, ctrl.removeMetadata);  // Strip metadata
router.post('/edit-metadata', single, ctrl.editMetadata);      // Set metadata
router.post('/get-metadata', single, ctrl.getMetadata);        // Read metadata
router.post('/flatten', single, ctrl.flatten);                 // Flatten forms
router.post('/protect', single, ctrl.protect);                 // Add password
router.post('/unlock', single, ctrl.unlock);                   // Remove password
router.post('/redact', single, ctrl.redact);                   // Redact areas

module.exports = router;

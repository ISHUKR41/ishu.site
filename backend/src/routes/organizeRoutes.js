/**
 * organizeRoutes.js — Routes for Organize PDF tools
 *
 * Routes (9 tools):
 *   POST /merge         — Combine multiple PDFs into one
 *   POST /split         — Split PDF into pages/ranges
 *   POST /organize      — Reorder pages by specifying new order
 *   POST /rearrange     — Alias of /organize (drag-drop UI variant)
 *   POST /rotate        — Rotate pages 90/180/270 degrees
 *   POST /delete-pages  — Remove specific pages
 *   POST /extract-pages — Extract specific pages into new PDF
 *   POST /crop          — Crop pages to a rectangle
 *   POST /rearrange-pages — Alias of /organize (same functionality)
 */

const { Router } = require('express');
const { single, multi } = require('../middleware/upload');
const ctrl = require('../controllers/organizeController');

const router = Router();

router.post('/merge', multi, ctrl.merge);                      // Merge multiple PDFs
router.post('/split', single, ctrl.split);                     // Split PDF into pages
router.post('/organize', single, ctrl.organize);               // Reorder pages
router.post('/rearrange', single, ctrl.organize);              // Alias — frontend drag-drop reorder
router.post('/rearrange-pages', single, ctrl.organize);        // Alias — alternate naming
router.post('/rotate', single, ctrl.rotate);                   // Rotate pages
router.post('/delete-pages', single, ctrl.deletePages);        // Delete specific pages
router.post('/extract-pages', single, ctrl.extractPages);      // Extract specific pages
router.post('/crop', single, ctrl.crop);                       // Crop page boundaries

module.exports = router;

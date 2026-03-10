/**
 * constants.js — Shared configuration constants for ISHU PDF Tools Backend
 *
 * Contains:
 *   - Standard page sizes (A4, A3, Letter, Legal) in PDF points
 *   - Supported file format lists for validation
 *   - Ghostscript quality presets
 *   - Default styling constants for PDF generation
 *
 * Usage:
 *   const { PAGE_SIZES, SUPPORTED_IMAGE_FORMATS } = require('./constants');
 */

// ═══════════════════════════════════════════════════════════════
// PAGE SIZES — Standard page dimensions in PDF points (1 inch = 72 points)
// ═══════════════════════════════════════════════════════════════
const PAGE_SIZES = {
    A4: { width: 595.28, height: 841.89 },       // 210mm × 297mm (most common worldwide)
    A3: { width: 841.89, height: 1190.55 },       // 297mm × 420mm
    A5: { width: 419.53, height: 595.28 },        // 148mm × 210mm
    Letter: { width: 612, height: 792 },           // 8.5in × 11in (US standard)
    Legal: { width: 612, height: 1008 },           // 8.5in × 14in
    Tabloid: { width: 792, height: 1224 },         // 11in × 17in
};

// ═══════════════════════════════════════════════════════════════
// SUPPORTED FILE FORMATS — Used for input validation across tools
// ═══════════════════════════════════════════════════════════════

/** Image formats accepted by image-to-pdf and other image tools */
const SUPPORTED_IMAGE_FORMATS = [
    '.jpg', '.jpeg', '.png', '.webp', '.bmp',
    '.tiff', '.tif', '.gif', '.heic', '.heif', '.jfif',
];

/** Office document formats handled by LibreOffice conversion */
const SUPPORTED_OFFICE_FORMATS = [
    '.doc', '.docx',       // Word
    '.ppt', '.pptx',       // PowerPoint
    '.xls', '.xlsx',       // Excel
    '.odt', '.ods', '.odp', // OpenDocument
    '.rtf',                // Rich Text Format
    '.wps',                // WPS Writer
    '.hwp',                // Hangul Word Processor
    '.pub',                // Microsoft Publisher
    '.xps',                // XML Paper Specification
    '.ott',                // OpenDocument Template
];

/** eBook formats handled by Calibre (ebook-convert) */
const SUPPORTED_EBOOK_FORMATS = [
    '.epub', '.mobi', '.azw', '.azw3',
    '.fb2', '.lit', '.lrf',
    '.cbz', '.cbr',  // Comic book archives
];

// ═══════════════════════════════════════════════════════════════
// GHOSTSCRIPT QUALITY PRESETS — Used by compress tool
// ═══════════════════════════════════════════════════════════════
const GS_QUALITY_PRESETS = {
    screen: '/screen',       // 72 DPI — smallest filesize, lowest quality
    ebook: '/ebook',         // 150 DPI — good balance (default)
    printer: '/printer',     // 300 DPI — high quality for printing
    prepress: '/prepress',   // 300 DPI — highest quality, color-accurate
};

// ═══════════════════════════════════════════════════════════════
// DEFAULT STYLING — Consistent look across generated PDFs
// ═══════════════════════════════════════════════════════════════
const DEFAULT_FONT_SIZE = 12;          // Default text size in points
const DEFAULT_MARGIN = 50;             // Default page margin in points
const DEFAULT_LINE_HEIGHT = 1.5;       // Line height multiplier
const HEADER_FONT_SIZE = 20;           // Default header text size
const MAX_CHARS_PER_LINE = 90;         // Word wrap limit for text-to-PDF
const MAX_LINES_PER_PAGE = 45;         // Auto page-break threshold

// ═══════════════════════════════════════════════════════════════
// SYSTEM TOOL PATHS — Windows-aware defaults
// ═══════════════════════════════════════════════════════════════

/**
 * Detect the correct Ghostscript binary name for the current OS.
 * Windows: gswin64c (or gswin32c)
 * Linux/Mac: gs
 */
const getGhostscriptPath = () => {
    if (process.env.GHOSTSCRIPT_PATH) return process.env.GHOSTSCRIPT_PATH;
    return process.platform === 'win32' ? 'gswin64c' : 'gs';
};

/**
 * Detect the correct LibreOffice path for the current OS.
 * Windows: soffice.exe (usually in Program Files)
 * Linux: libreoffice or soffice
 */
const getLibreOfficePath = () => {
    if (process.env.LIBREOFFICE_PATH) return process.env.LIBREOFFICE_PATH;
    if (process.platform === 'win32') {
        // Common Windows installation paths
        const possiblePaths = [
            'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
            'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
        ];
        const fs = require('fs');
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) return p;
        }
        return 'soffice'; // Fallback — hope it's on PATH
    }
    return '/usr/bin/libreoffice';
};

// ═══════════════════════════════════════════════════════════════
// SYSTEM TOOL DETECTION — Check if a CLI tool is actually available
// ═══════════════════════════════════════════════════════════════

/**
 * isCommandAvailable — Test if a system CLI command exists on this machine.
 *
 * Uses `where` on Windows and `which` on Linux/Mac.
 * Returns true if the command is found, false otherwise.
 *
 * @param {string} cmd - Binary name, e.g. 'gswin64c' or 'libreoffice'
 * @returns {boolean} Whether the command is available on PATH
 */
const isCommandAvailable = (cmd) => {
    try {
        const { execSync } = require('child_process');
        const check = process.platform === 'win32' ? 'where' : 'which';
        execSync(`${check} ${cmd}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
};

/**
 * Detect Calibre's ebook-convert binary path.
 * Windows: usually in C:\Program Files\Calibre2\ebook-convert.exe
 * Linux: /usr/bin/ebook-convert
 * Returns null if not found.
 */
const getCalibrePath = () => {
    if (process.platform === 'win32') {
        const fs = require('fs');
        const possiblePaths = [
            'C:\\Program Files\\Calibre2\\ebook-convert.exe',
            'C:\\Program Files (x86)\\Calibre2\\ebook-convert.exe',
        ];
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) return p;
        }
        if (isCommandAvailable('ebook-convert')) return 'ebook-convert';
        return null;
    }
    if (isCommandAvailable('ebook-convert')) return 'ebook-convert';
    return null;
};

/**
 * Detect Inkscape binary path (used for SVG/AI/DXF → PDF).
 * Returns null if not found.
 */
const getInkscapePath = () => {
    if (process.platform === 'win32') {
        const fs = require('fs');
        const possiblePaths = [
            'C:\\Program Files\\Inkscape\\bin\\inkscape.exe',
            'C:\\Program Files (x86)\\Inkscape\\bin\\inkscape.exe',
        ];
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) return p;
        }
        if (isCommandAvailable('inkscape')) return 'inkscape';
        return null;
    }
    if (isCommandAvailable('inkscape')) return 'inkscape';
    return null;
};

/**
 * Detect DjVuLibre's ddjvu binary path (used for DjVu → PDF).
 * Returns null if not found.
 */
const getDjvuPath = () => {
    if (isCommandAvailable('ddjvu')) return 'ddjvu';
    return null;
};

/**
 * Detect Pandoc binary path (used for Markdown/HTML/EPUB conversions).
 * Returns null if not found.
 */
const getPandocPath = () => {
    if (isCommandAvailable('pandoc')) return 'pandoc';
    return null;
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════
module.exports = {
    PAGE_SIZES,
    SUPPORTED_IMAGE_FORMATS,
    SUPPORTED_OFFICE_FORMATS,
    SUPPORTED_EBOOK_FORMATS,
    GS_QUALITY_PRESETS,
    DEFAULT_FONT_SIZE,
    DEFAULT_MARGIN,
    DEFAULT_LINE_HEIGHT,
    HEADER_FONT_SIZE,
    MAX_CHARS_PER_LINE,
    MAX_LINES_PER_PAGE,
    getGhostscriptPath,
    getLibreOfficePath,
    isCommandAvailable,
    getCalibrePath,
    getInkscapePath,
    getDjvuPath,
    getPandocPath,
};

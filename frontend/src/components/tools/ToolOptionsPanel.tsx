/**
 * ToolOptionsPanel.tsx - Tool-Specific Options UI (290 lines)
 * 
 * Renders different option controls based on which tool is being used.
 * Each tool has specific settings (e.g., rotation angle, compression quality).
 * Options are passed back to ToolPage via onChange callback.
 */
import { useState, useEffect } from "react";
import type { ToolOptions } from "@/lib/pdf-processor";

interface ToolOptionsPanelProps {
  toolSlug: string;
  totalPages?: number;
  onChange: (options: ToolOptions) => void;
}

const ToolOptionsPanel = ({ toolSlug, totalPages, onChange }: ToolOptionsPanelProps) => {
  const [options, setOptions] = useState<ToolOptions>({});

  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  const update = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelClass = "block text-sm font-medium text-foreground mb-1";
  const selectClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  switch (toolSlug) {
    case 'rotate-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Rotation Angle</label>
          <div className="flex gap-2">
            {[90, 180, 270].map(deg => (
              <button
                key={deg}
                onClick={() => update('degrees', deg)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  options.degrees === deg
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary/30'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      );

    case 'split-pdf':
    case 'extract-pages':
    case 'delete-pages':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>
            {toolSlug === 'delete-pages' ? 'Pages to Delete' : 'Page Range'}
            {totalPages ? ` (1-${totalPages})` : ''}
          </label>
          <input
            type="text"
            placeholder="e.g., 1-3, 5, 7-10"
            className={inputClass}
            onChange={e => update('pageRange', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use commas for individual pages, dashes for ranges
          </p>
        </div>
      );

    case 'organize-pdf':
    case 'rearrange-pages':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>New Page Order{totalPages ? ` (1-${totalPages})` : ''}</label>
          <input
            type="text"
            placeholder="e.g., 3, 1, 2, 5, 4"
            className={inputClass}
            onChange={e => update('pageRange', e.target.value)}
          />
        </div>
      );

    case 'watermark':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Watermark Text</label>
          <input
            type="text"
            placeholder="e.g., CONFIDENTIAL"
            className={inputClass}
            onChange={e => update('watermarkText', e.target.value)}
          />
          <label className={labelClass}>Font Size</label>
          <input
            type="number"
            placeholder="60"
            className={inputClass}
            onChange={e => update('fontSize', parseInt(e.target.value) || 60)}
          />
          <label className={labelClass}>Opacity (0.05 - 1.0)</label>
          <input
            type="number"
            step="0.05"
            min="0.05"
            max="1"
            placeholder="0.15"
            className={inputClass}
            onChange={e => update('opacity', parseFloat(e.target.value) || 0.15)}
          />
        </div>
      );

    case 'page-numbers':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Position</label>
          <select className={selectClass} onChange={e => update('position', e.target.value)}>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-center">Top Center</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
          </select>
        </div>
      );

    case 'header-and-footer':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Header Text</label>
          <input
            type="text"
            placeholder="Header text..."
            className={inputClass}
            onChange={e => update('headerText', e.target.value)}
          />
          <label className={labelClass}>Footer Text</label>
          <input
            type="text"
            placeholder="Footer text..."
            className={inputClass}
            onChange={e => update('footerText', e.target.value)}
          />
        </div>
      );

    case 'add-text':
    case 'edit-pdf':
    case 'edit-pdf-text':
    case 'annotate-pdf':
    case 'pdf-filler':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Text to Add</label>
          <textarea
            placeholder="Enter text..."
            className={inputClass + " min-h-[80px]"}
            onChange={e => update('text', e.target.value)}
          />
          <label className={labelClass}>Font Size</label>
          <input
            type="number"
            placeholder="16"
            className={inputClass}
            onChange={e => update('fontSize', parseInt(e.target.value) || 16)}
          />
        </div>
      );

    case 'sign-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Signature Name</label>
          <input
            type="text"
            placeholder="Your name"
            className={inputClass}
            onChange={e => update('text', e.target.value)}
          />
        </div>
      );

    case 'protect-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className={inputClass}
            onChange={e => update('password', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Note: Basic protection applied. For enterprise-level encryption, use a dedicated PDF security tool.
          </p>
        </div>
      );

    case 'unlock-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Password (if known)</label>
          <input
            type="password"
            placeholder="Enter password"
            className={inputClass}
            onChange={e => update('password', e.target.value)}
          />
        </div>
      );

    case 'resize-pages':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Page Size</label>
          <select className={selectClass} onChange={e => update('pageSize', e.target.value)}>
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="A3">A3 (297 × 420 mm)</option>
            <option value="Letter">US Letter (8.5 × 11 in)</option>
            <option value="Legal">US Legal (8.5 × 14 in)</option>
          </select>
        </div>
      );

    case 'compress-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Compression Level</label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map(level => (
              <button
                key={level}
                onClick={() => update('quality', level.toLowerCase())}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  options.quality === level.toLowerCase()
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      );

    case 'create-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Document Content</label>
          <textarea
            placeholder="Enter text for your PDF..."
            className={inputClass + " min-h-[120px]"}
            onChange={e => update('text', e.target.value)}
          />
        </div>
      );

    case 'url-to-pdf':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            className={inputClass}
            onChange={e => update('text', e.target.value)}
          />
        </div>
      );

    case 'edit-metadata':
      return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <label className={labelClass}>Title</label>
          <input type="text" placeholder="Document title" className={inputClass} onChange={e => update('title', e.target.value)} />
          <label className={labelClass}>Author</label>
          <input type="text" placeholder="Author name" className={inputClass} onChange={e => update('author', e.target.value)} />
          <label className={labelClass}>Subject</label>
          <input type="text" placeholder="Subject" className={inputClass} onChange={e => update('subject', e.target.value)} />
        </div>
      );

    default:
      return null;
  }
};

export default ToolOptionsPanel;

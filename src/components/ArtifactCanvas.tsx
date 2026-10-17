import React, { useState } from 'react';
import {
  X,
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { Artifact } from '../types';
import { highlightCode } from '../utils/markdown';

interface ArtifactCanvasProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  artifact,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  if (!isOpen || !artifact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    let extension = '.txt';
    if (artifact.type === 'html') extension = '.html';
    else if (artifact.type === 'react') extension = '.tsx';
    else if (artifact.type === 'svg') extension = '.svg';

    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '-')}${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewContent = () => {
    if (artifact.type === 'svg') {
      return `<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1918;color:#fff;">${artifact.content}</body></html>`;
    }
    if (artifact.type === 'html') {
      return artifact.content;
    }
    // For React/JS snippet fallback wrapper
    return `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="p-6 bg-[#1a1918] text-[#ecebe8]"><pre class="text-xs font-mono p-4 bg-black/40 rounded-xl">${artifact.content.replace(/</g, '&lt;')}</pre></body></html>`;
  };

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 bg-[var(--bg-card)] border-l border-[var(--border-color)] flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${
        isFullscreen
          ? 'w-full'
          : 'w-full sm:w-[500px] md:w-[600px] lg:w-[650px] xl:w-[720px]'
      }`}
    >
      {/* Canvas Top Bar */}
      <div className="h-13 border-b border-[var(--border-color)] px-4 flex items-center justify-between shrink-0 bg-[var(--bg-page)]/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-[#d97757]/15 text-[#d97757]">
            <Code2 size={16} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {artifact.title}
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">
              {artifact.type} · version 1.0
            </span>
          </div>
        </div>

        {/* Center Mode Switcher (Preview / Code) */}
        <div className="flex items-center p-0.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-[#d97757] text-white shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-[#d97757] text-white shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Code2 size={13} />
            <span>Code</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1">
          {activeTab === 'preview' && (
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              title="Refresh preview"
            >
              <RotateCcw size={14} />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            title="Copy code"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            title="Download file"
          >
            <Download size={14} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hidden sm:block"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] ml-1"
            title="Close Canvas"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Canvas Body */}
      <div className="flex-1 overflow-hidden relative bg-[var(--bg-page)]">
        {activeTab === 'preview' ? (
          <iframe
            key={reloadKey}
            srcDoc={getPreviewContent()}
            title={artifact.title}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full border-none bg-white dark:bg-[#151515]"
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-4 font-mono-code text-xs leading-relaxed text-[var(--text-primary)]">
            <pre className="m-0">
              <code
                className="hljs"
                dangerouslySetInnerHTML={{
                  __html: highlightCode(artifact.content, artifact.language),
                }}
              />
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
};

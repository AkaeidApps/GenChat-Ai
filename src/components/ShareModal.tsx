import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  FileCode,
  Link2,
} from 'lucide-react';
import { Chat } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  chat,
}) => {
  const [copiedType, setCopiedType] = useState<'link' | 'markdown' | null>(null);

  if (!isOpen || !chat) return null;

  const generateMarkdown = () => {
    let md = `# ${chat.title}\n\n`;
    md += `*Exported from GenChat on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    chat.messages.forEach((msg) => {
      const author = msg.role === 'user' ? 'User' : 'GenChat';
      md += `### ${author}\n\n${msg.content}\n\n`;
      if (msg.artifact) {
        md += `#### Artifact: ${msg.artifact.title} (${msg.artifact.type})\n\`\`\`${msg.artifact.language}\n${msg.artifact.content}\n\`\`\`\n\n`;
      }
    });

    return md;
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/chat/${chat.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chat.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Share2 size={18} className="text-[#d97757]" />
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Share Conversation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-[var(--text-primary)]">
          <div>
            <h3 className="font-medium text-[var(--text-secondary)] mb-1">
              Conversation Title
            </h3>
            <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] font-medium text-[var(--text-primary)]">
              {chat.title}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[#d97757] font-medium transition-all group"
            >
              <Link2 size={15} className="text-[#d97757]" />
              <span>{copiedType === 'link' ? 'Link Copied!' : 'Copy Share Link'}</span>
              {copiedType === 'link' && <Check size={14} className="text-emerald-400" />}
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[#d97757] font-medium transition-all group"
            >
              <FileCode size={15} className="text-[#d97757]" />
              <span>
                {copiedType === 'markdown' ? 'Markdown Copied!' : 'Copy as Markdown'}
              </span>
              {copiedType === 'markdown' && <Check size={14} className="text-emerald-400" />}
            </button>
          </div>

          <div className="pt-2 border-t border-[var(--border-color)]">
            <button
              onClick={handleDownloadMarkdown}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)] transition-all"
            >
              <Download size={14} />
              <span>Download .md File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

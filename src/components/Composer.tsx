import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  Brain,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Attachment } from '../types';
import { AVAILABLE_MODELS } from '../constants/initialData';

interface ComposerProps {
  onSendMessage: (
    content: string,
    attachments: Attachment[],
    options: { enableThinking: boolean; enableWebSearch: boolean }
  ) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  activeModelId: string;
  onSelectModel: (modelId: string) => void;
  placeholder?: string;
  isCentered?: boolean;
}

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  activeModelId,
  onSelectModel,
  placeholder = 'How can I help you today?',
  isCentered = false,
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [enableThinking, setEnableThinking] = useState(
    activeModelId === 'genchat-thinker'
  );
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync thinking toggle with model
  useEffect(() => {
    if (activeModelId === 'genchat-thinker') {
      setEnableThinking(true);
    }
  }, [activeModelId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 240);
      textareaRef.current.style.height = `${Math.max(newHeight, 48)}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isStreaming) {
      onStopStreaming();
      return;
    }

    if (!content.trim() && attachments.length === 0) return;

    onSendMessage(content.trim(), attachments, {
      enableThinking,
      enableWebSearch,
    });

    setContent('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(Array.from(files));
    e.target.value = '';
  };

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          mimeType: file.type || 'application/octet-stream',
          data: dataUrl,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === activeModelId) || AVAILABLE_MODELS[0];

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isCentered ? 'max-w-2xl mx-auto' : 'max-w-3xl mx-auto'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`relative rounded-[22px] bg-[var(--bg-card)] border transition-all duration-200 shadow-lg ${
          isDragging
            ? 'border-[#d97757] ring-4 ring-[#d97757]/20'
            : 'border-[var(--border-color)] hover:border-[var(--border-strong)] focus-within:border-[#d97757]/60 focus-within:ring-2 focus-within:ring-[#d97757]/15'
        }`}
      >
        {/* Attached Files Preview Strip */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3 pb-1 border-b border-[var(--border-color)]">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              >
                {file.type === 'image' ? (
                  <div className="w-5 h-5 rounded overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={file.data}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <FileText size={15} className="text-[#d97757] shrink-0" />
                )}
                <div className="flex flex-col min-w-0 max-w-[140px]">
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.id)}
                  className="p-1 rounded-full text-[var(--text-muted)] hover:text-red-400 hover:bg-black/10 dark:hover:bg-white/10"
                  title="Remove attachment"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-transparent resize-none focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[15px] leading-relaxed py-1 px-1 min-h-[48px]"
          />
        </div>

        {/* Composer Controls Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--border-color)]/50">
          {/* Left Tools */}
          <div className="flex items-center gap-1.5">
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
              title="Add image or document"
            >
              <Paperclip size={16} />
            </button>

            {/* Extended Thinking Toggle */}
            <button
              type="button"
              onClick={() => setEnableThinking(!enableThinking)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                enableThinking
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
              title="Toggle extended step-by-step thinking trace"
            >
              <Brain size={14} />
              <span className="hidden sm:inline">Think</span>
            </button>

            {/* Web Search Grounding Toggle */}
            <button
              type="button"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                enableWebSearch
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
              title="Ground response with live web search"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Right Action: Send / Stop Button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
              {currentModel.name.split(' ')[1] || 'Flash'}
            </span>

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-all shadow-sm"
                title="Stop generation"
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() && attachments.length === 0}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  content.trim() || attachments.length > 0
                    ? 'bg-[#d97757] text-white hover:bg-[#c96442] shadow-sm hover:scale-105 active:scale-95'
                    : 'bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
                }`}
                title="Send message (Enter)"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Hint */}
      {isCentered && (
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-2.5">
          GenChat can make mistakes. Verify important information.
        </p>
      )}
    </div>
  );
};

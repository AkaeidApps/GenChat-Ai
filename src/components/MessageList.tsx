import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Brain,
  Code2,
  Edit2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Artifact, Message } from '../types';
import { GenChatLogo } from './GenChatLogo';
import { renderMarkdown } from '../utils/markdown';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  onRegenerate: () => void;
  onEditMessage?: (id: string, newContent: string) => void;
  onOpenArtifact: (artifact: Artifact) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  onRegenerate,
  onEditMessage,
  onOpenArtifact,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [collapsedThinking, setCollapsedThinking] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  const toggleThinking = (id: string) => {
    setCollapsedThinking((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const saveEdit = (id: string) => {
    if (editContent.trim() && onEditMessage) {
      onEditMessage(id, editContent.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 max-w-3xl mx-auto w-full">
      {messages.map((message, index) => {
        const isUser = message.role === 'user';
        const isLast = index === messages.length - 1;

        if (isUser) {
          return (
            <div key={message.id} className="flex justify-end group">
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 shadow-xs text-sm text-[var(--text-primary)]">
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {message.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-page)] max-w-[200px]"
                      >
                        {att.type === 'image' ? (
                          <img
                            src={att.data}
                            alt={att.name}
                            className="max-h-36 w-auto object-cover"
                          />
                        ) : (
                          <div className="p-2 text-xs font-mono text-[var(--text-muted)] truncate">
                            📄 {att.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Edit Mode or Normal Text */}
                {editingId === message.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-[var(--bg-page)] border border-[#d97757] rounded-lg p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(message.id)}
                        className="px-3 py-1 bg-[#d97757] text-white rounded-md hover:bg-[#c96442]"
                      >
                        Save & Resubmit
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}

                {/* Quick actions for user */}
                {editingId !== message.id && (
                  <div className="flex items-center justify-end gap-1.5 mt-2 pt-1 border-t border-[var(--border-color)]/30 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]">
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="p-1 hover:text-[var(--text-primary)] rounded"
                      title="Copy text"
                    >
                      {copiedId === message.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => startEdit(message)}
                      className="p-1 hover:text-[var(--text-primary)] rounded"
                      title="Edit query"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Assistant Message
        return (
          <div key={message.id} className="flex items-start gap-3.5 group">
            {/* GenChat Avatar */}
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs hover:border-[#00e5ff]/40 transition-colors">
              <GenChatLogo size={22} />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Thinking Accordion (Extended reasoning) */}
              {message.thinking && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/50 overflow-hidden text-xs">
                  <button
                    onClick={() => toggleThinking(message.id)}
                    className="w-full px-3 py-2 flex items-center justify-between text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-card)]"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Brain size={13} className="text-purple-400" />
                      <span>Thinking Process</span>
                    </div>
                    {collapsedThinking[message.id] ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronUp size={14} />
                    )}
                  </button>
                  {!collapsedThinking[message.id] && (
                    <div className="px-3 py-2.5 font-mono text-[11px] text-[var(--text-muted)] bg-[var(--bg-page)]/50 border-t border-[var(--border-color)] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {message.thinking}
                    </div>
                  )}
                </div>
              )}

              {/* Rendered Markdown Body */}
              <div
                className="prose dark:prose-invert max-w-none text-sm text-[var(--text-primary)] leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(message.content),
                }}
              />

              {/* Artifact Card Banner */}
              {message.artifact && (
                <div
                  onClick={() => onOpenArtifact(message.artifact!)}
                  className="mt-3 p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[#d97757]/30 hover:border-[#d97757] transition-all cursor-pointer shadow-xs group/art flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#d97757]/10 text-[#d97757] group-hover/art:scale-105 transition-transform">
                      <Code2 size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <span>{message.artifact.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#d97757]/15 text-[#d97757] uppercase font-mono">
                          {message.artifact.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Click to interact with live preview in GenChat Canvas
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-[#d97757] shrink-0">
                    <span>Open Canvas</span>
                    <ExternalLink size={13} />
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center gap-1 pt-1 text-[var(--text-muted)] text-xs">
                <button
                  onClick={() => handleCopy(message.content, message.id)}
                  className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  title="Copy response"
                >
                  {copiedId === message.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>

                <button
                  onClick={() => handleSpeak(message.content, message.id)}
                  className={`p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors ${
                    speakingId === message.id ? 'text-[#d97757]' : ''
                  }`}
                  title={speakingId === message.id ? 'Stop reading' : 'Read aloud'}
                >
                  {speakingId === message.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                {isLast && !isStreaming && (
                  <button
                    onClick={onRegenerate}
                    className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                    title="Regenerate response"
                  >
                    <RotateCw size={14} />
                  </button>
                )}

                <div className="h-3 w-px bg-[var(--border-color)] mx-1" />

                <button
                  className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  title="Helpful"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  title="Unhelpful"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Streaming Indicator */}
      {isStreaming && (
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] animate-pulse pl-11">
          <GenChatLogo size={16} />
          <span>GenChat is generating response...</span>
        </div>
      )}
    </div>
  );
};

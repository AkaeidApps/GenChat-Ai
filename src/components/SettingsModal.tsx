import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Sliders,
  Sparkles,
  Download,
  Trash2,
  Check,
  User,
  MessageSquare,
} from 'lucide-react';
import { AppSettings, ModelOption } from '../types';
import { AVAILABLE_MODELS } from '../constants/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onExportData: () => void;
  onClearAllChats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExportData,
  onClearAllChats,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'instructions' | 'data'>('general');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders size={18} className="text-[#d97757]" />
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-[var(--border-color)] text-xs font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-[#d97757] text-[#d97757]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'instructions'
                ? 'border-[#d97757] text-[#d97757]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Custom Instructions
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 px-3 border-b-2 transition-all ${
              activeTab === 'data'
                ? 'border-[#d97757] text-[#d97757]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Data & Privacy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[var(--text-primary)]">
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Theme Preference */}
              <div>
                <label className="block font-medium mb-2 text-[var(--text-secondary)]">
                  Appearance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: 'dark' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.theme === 'dark'
                        ? 'border-[#d97757] bg-[#d97757]/10 font-semibold text-[#d97757]'
                        : 'border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <Moon size={15} />
                    <span>Dark Theme</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: 'light' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.theme === 'light'
                        ? 'border-[#d97757] bg-[#d97757]/10 font-semibold text-[#d97757]'
                        : 'border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <Sun size={15} />
                    <span>Light Theme</span>
                  </button>
                </div>
              </div>

              {/* User Display Name */}
              <div>
                <label className="block font-medium mb-1.5 text-[var(--text-secondary)]">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#d97757]"
                />
              </div>

              {/* Default Model */}
              <div>
                <label className="block font-medium mb-1.5 text-[var(--text-secondary)]">
                  Default Model
                </label>
                <select
                  value={formData.defaultModel}
                  onChange={(e) => setFormData({ ...formData, defaultModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#d97757]"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.badge})
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-[var(--border-color)] space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text-secondary)]">Send message on Enter key</span>
                  <input
                    type="checkbox"
                    checked={formData.sendOnEnter}
                    onChange={(e) =>
                      setFormData({ ...formData, sendOnEnter: e.target.checked })
                    }
                    className="accent-[#d97757]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[var(--text-secondary)]">
                    Enable Extended Thinking traces by default
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.enableThinkingByDefault}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableThinkingByDefault: e.target.checked,
                      })
                    }
                    className="accent-[#d97757]"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-[var(--text-secondary)]">
                  What would you like GenChat to know about you to provide better responses?
                </label>
                <p className="text-[11px] text-[var(--text-muted)] mb-2">
                  These system instructions are quietly appended to every new chat.
                </p>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) =>
                    setFormData({ ...formData, systemPrompt: e.target.value })
                  }
                  rows={6}
                  placeholder="e.g. I am a software architect using TypeScript and React. Prefer concise explanations and complete working code."
                  className="w-full p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#d97757] leading-relaxed resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] space-y-3">
                <div className="font-semibold text-[var(--text-primary)]">Export Conversations</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Download all your GenChat conversations, messages, and artifacts as a JSON backup.
                </p>
                <button
                  onClick={onExportData}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#d97757] font-medium text-[var(--text-primary)] transition-all"
                >
                  <Download size={14} className="text-[#d97757]" />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
                <div className="font-semibold text-red-400">Clear All History</div>
                <p className="text-[11px] text-red-300/70">
                  Permanently delete all stored chats from your local browser storage. This action cannot be undone.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all conversations?')) {
                      onClearAllChats();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition-all"
                >
                  <Trash2 size={14} />
                  <span>Delete All Chats</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-end gap-3 bg-[var(--bg-page)]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#d97757] hover:bg-[#c96442] text-white shadow-xs transition-all"
          >
            {isSaved ? <Check size={14} /> : null}
            <span>{isSaved ? 'Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

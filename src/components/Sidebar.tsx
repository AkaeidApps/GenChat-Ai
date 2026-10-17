import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Star,
  Trash2,
  Edit2,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Chat, Project } from '../types';
import { GenChatLogo } from './GenChatLogo';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onOpenProjectsModal: () => void;
  onOpenSettings: () => void;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onToggleStar,
  onRenameChat,
  projects,
  activeProjectId,
  onSelectProject,
  onOpenProjectsModal,
  onOpenSettings,
  userName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter chats by search query
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group chats chronologically
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  const starredChats = filteredChats.filter((c) => c.isStarred);
  const todayChats = filteredChats.filter(
    (c) => !c.isStarred && now - c.updatedAt < oneDay
  );
  const yesterdayChats = filteredChats.filter(
    (c) => !c.isStarred && now - c.updatedAt >= oneDay && now - c.updatedAt < 2 * oneDay
  );
  const pastWeekChats = filteredChats.filter(
    (c) => !c.isStarred && now - c.updatedAt >= 2 * oneDay && now - c.updatedAt < sevenDays
  );
  const olderChats = filteredChats.filter(
    (c) => !c.isStarred && now - c.updatedAt >= sevenDays
  );

  const startRename = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setActiveMenuId(null);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const renderChatItem = (chat: Chat) => {
    const isActive = chat.id === activeChatId;
    const isEditing = chat.id === editingChatId;

    if (isEditing) {
      return (
        <div
          key={chat.id}
          className="px-2 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-strong)] flex items-center gap-1 my-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveRename(chat.id, e);
              if (e.key === 'Escape') setEditingChatId(null);
            }}
            className="flex-1 bg-transparent text-xs text-[var(--text-primary)] focus:outline-none px-1"
            autoFocus
          />
          <button
            onClick={(e) => handleSaveRename(chat.id, e)}
            className="p-1 hover:text-[#d97757] text-[var(--text-secondary)]"
            title="Save"
          >
            <Check size={13} />
          </button>
          <button
            onClick={() => setEditingChatId(null)}
            className="p-1 hover:text-red-400 text-[var(--text-muted)]"
            title="Cancel"
          >
            <X size={13} />
          </button>
        </div>
      );
    }

    return (
      <div
        key={chat.id}
        onClick={() => onSelectChat(chat.id)}
        className={`group relative flex items-center justify-between px-2.5 py-2 my-0.5 rounded-lg cursor-pointer text-xs transition-colors ${
          isActive
            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-medium shadow-xs border border-[var(--border-color)]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageSquare size={14} className="shrink-0 opacity-60 group-hover:opacity-100" />
          <span className="truncate">{chat.title || 'Untitled chat'}</span>
        </div>

        {/* Hover Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
          <button
            onClick={(e) => onToggleStar(chat.id, e)}
            className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${
              chat.isStarred ? 'text-[#d97757] opacity-100' : 'text-[var(--text-muted)]'
            }`}
            title={chat.isStarred ? 'Unstar' : 'Star'}
          >
            <Star size={12} fill={chat.isStarred ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => startRename(chat, e)}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10"
            title="Rename"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => onDeleteChat(chat.id, e)}
            className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 hover:bg-black/10 dark:hover:bg-white/10"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out select-none ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'
        }`}
      >
        {/* Top Wordmark & Collapse Button */}
        <div className="p-3.5 flex items-center justify-between border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNewChat}>
            <GenChatLogo size={26} showText={true} />
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            title="Close sidebar (Ctrl+[)"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Start New Chat CTA */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] hover:border-[#d97757]/40 hover:bg-[var(--bg-card-hover)] transition-all shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Plus size={15} className="text-[#d97757]" />
              <span>Start new chat</span>
            </div>
            <kbd className="text-[10px] text-[var(--text-muted)] border border-[var(--border-color)] px-1.5 py-0.5 rounded bg-[var(--bg-sidebar)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Search Chats Input */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#d97757]/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="px-3 py-1.5 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Projects
            </span>
            <button
              onClick={onOpenProjectsModal}
              className="p-1 text-[var(--text-muted)] hover:text-[#d97757] rounded"
              title="Manage projects"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="space-y-0.5">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(activeProjectId === proj.id ? null : proj.id)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  activeProjectId === proj.id
                    ? 'bg-[#d97757]/15 text-[#d97757] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color || '#d97757' }}
                  />
                  <span className="truncate">{proj.name}</span>
                </div>
                {activeProjectId === proj.id && (
                  <span className="text-[10px] text-[#d97757] font-medium">Active</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conversations Scroll Area */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
          {starredChats.length > 0 && (
            <div>
              <div className="px-2 text-[10px] font-medium uppercase tracking-wider text-[#d97757] flex items-center gap-1 mb-1">
                <Star size={10} fill="currentColor" />
                <span>Starred</span>
              </div>
              <div className="space-y-0.5">{starredChats.map(renderChatItem)}</div>
            </div>
          )}

          {todayChats.length > 0 && (
            <div>
              <div className="px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Today
              </div>
              <div className="space-y-0.5">{todayChats.map(renderChatItem)}</div>
            </div>
          )}

          {yesterdayChats.length > 0 && (
            <div>
              <div className="px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Yesterday
              </div>
              <div className="space-y-0.5">{yesterdayChats.map(renderChatItem)}</div>
            </div>
          )}

          {pastWeekChats.length > 0 && (
            <div>
              <div className="px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Previous 7 Days
              </div>
              <div className="space-y-0.5">{pastWeekChats.map(renderChatItem)}</div>
            </div>
          )}

          {olderChats.length > 0 && (
            <div>
              <div className="px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Older
              </div>
              <div className="space-y-0.5">{olderChats.map(renderChatItem)}</div>
            </div>
          )}

          {filteredChats.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </div>
          )}
        </div>

        {/* User Account Footer */}
        <div className="p-3 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#d97757] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {userName}
                </div>
                <div className="text-[10px] text-[#d97757] font-medium flex items-center gap-1">
                  <span>GenChat Pro</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
              title="Settings"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

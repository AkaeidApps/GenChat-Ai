import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Share2,
  Sliders,
  Moon,
  Sun,
  Code2,
  Sparkles,
  Zap,
  Brain,
  Edit3,
  Check,
  UserCheck,
  Feather,
} from 'lucide-react';
import { ChatPersona, ModelOption } from '../types';
import { AVAILABLE_MODELS, CHAT_PERSONAS } from '../constants/initialData';
import { SparkIcon } from './SparkIcon';
import { GenChatLogo } from './GenChatLogo';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeModelId: string;
  onSelectModel: (modelId: string) => void;
  activePersonaId: string;
  onSelectPersona: (personaId: string) => void;
  chatTitle?: string;
  onRenameChat?: (newTitle: string) => void;
  onOpenShareModal: () => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
  hasArtifact: boolean;
  canvasOpen: boolean;
  onToggleCanvas: () => void;
  activeProjectName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  activeModelId,
  onSelectModel,
  activePersonaId,
  onSelectPersona,
  chatTitle,
  onRenameChat,
  onOpenShareModal,
  onOpenSettings,
  theme,
  onToggleTheme,
  hasArtifact,
  canvasOpen,
  onToggleCanvas,
  activeProjectName,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const personaDropdownRef = useRef<HTMLDivElement>(null);

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === activeModelId) || AVAILABLE_MODELS[0];

  const currentPersona =
    CHAT_PERSONAS.find((p) => p.id === activePersonaId) || CHAT_PERSONAS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(e.target as Node)
      ) {
        setModelDropdownOpen(false);
      }
      if (
        personaDropdownRef.current &&
        !personaDropdownRef.current.contains(e.target as Node)
      ) {
        setPersonaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartRename = () => {
    if (chatTitle && onRenameChat) {
      setTitleInput(chatTitle);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = () => {
    if (titleInput.trim() && onRenameChat) {
      onRenameChat(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const getModelIcon = (modelId: string) => {
    if (modelId === 'gemini-4-argon') return <Sparkles size={14} className="text-[#d97757]" />;
    if (modelId === 'gemini-3.1-flash-lite') return <Zap size={14} className="text-amber-400" />;
    return <Zap size={14} className="text-emerald-400" />;
  };

  const getPersonaIcon = (iconName: string) => {
    if (iconName === 'Code2') return <Code2 size={13} className="text-[#d97757]" />;
    if (iconName === 'Brain') return <Brain size={13} className="text-purple-400" />;
    if (iconName === 'Feather') return <Feather size={13} className="text-blue-400" />;
    return <Sparkles size={13} className="text-amber-400" />;
  };

  return (
    <header className="h-13 border-b border-[var(--border-color)] bg-[var(--bg-page)]/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left: Sidebar Toggle & Model/Persona Selectors */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!sidebarOpen && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
              title="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="hidden xs:flex items-center">
              <GenChatLogo size={22} />
            </div>
          </div>
        )}

        {/* Model Selector Dropdown */}
        <div className="relative" ref={modelDropdownRef}>
          <button
            onClick={() => {
              setModelDropdownOpen(!modelDropdownOpen);
              setPersonaDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#d97757]/40 text-xs font-medium text-[var(--text-primary)] transition-all shadow-xs"
          >
            {getModelIcon(currentModel.id)}
            <span className="font-semibold">{currentModel.name}</span>
            <ChevronDown size={13} className="text-[var(--text-muted)]" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-76 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-strong)] shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Select Gemini Model
              </div>
              {AVAILABLE_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setModelDropdownOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeModelId === model.id
                      ? 'bg-[#d97757]/10 border border-[#d97757]/30'
                      : 'hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-[var(--text-primary)]">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--border-color)] text-[var(--text-secondary)]">
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Persona / Role Selector Dropdown */}
        <div className="relative hidden sm:block" ref={personaDropdownRef}>
          <button
            onClick={() => {
              setPersonaDropdownOpen(!personaDropdownOpen);
              setModelDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#d97757]/40 text-xs text-[var(--text-secondary)] transition-all shadow-xs"
            title="Chatbot Role & System Persona"
          >
            {getPersonaIcon(currentPersona.iconName)}
            <span className="font-medium text-[var(--text-primary)]">
              {currentPersona.name}
            </span>
            <ChevronDown size={12} className="text-[var(--text-muted)]" />
          </button>

          {personaDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-strong)] shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Chatbot Role & Persona
              </div>
              {CHAT_PERSONAS.map((persona) => (
                <div
                  key={persona.id}
                  onClick={() => {
                    onSelectPersona(persona.id);
                    setPersonaDropdownOpen(false);
                  }}
                  className={`p-2 rounded-xl cursor-pointer transition-colors ${
                    activePersonaId === persona.id
                      ? 'bg-[#d97757]/10 border border-[#d97757]/30'
                      : 'hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-[var(--text-primary)]">
                      {getPersonaIcon(persona.iconName)}
                      <span>{persona.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {persona.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-1">
                    {persona.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Project Tag */}
        {activeProjectName && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d97757]/10 text-[#d97757] text-xs font-medium border border-[#d97757]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
            <span className="truncate max-w-[120px]">{activeProjectName}</span>
          </div>
        )}

        {/* Chat Title with Inline Edit */}
        {chatTitle && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[var(--text-muted)] pl-2 border-l border-[var(--border-color)]">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="bg-[var(--bg-card)] border border-[#d97757] rounded px-1.5 py-0.5 text-xs text-[var(--text-primary)] focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveTitle} className="text-[#d97757] hover:opacity-80">
                  <Check size={13} />
                </button>
              </div>
            ) : (
              <div
                onClick={handleStartRename}
                className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-primary)] max-w-xs truncate group"
                title="Click to rename"
              >
                <span className="truncate">{chatTitle}</span>
                <Edit3 size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Artifacts Canvas Toggle */}
        <button
          onClick={onToggleCanvas}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            canvasOpen
              ? 'bg-[#d97757] text-white shadow-xs'
              : hasArtifact
              ? 'bg-[#d97757]/15 text-[#d97757] hover:bg-[#d97757]/25 border border-[#d97757]/30'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
          }`}
          title="Toggle GenChat Canvas (Artifacts)"
        >
          <Code2 size={15} />
          <span className="hidden sm:inline">Canvas</span>
          {hasArtifact && !canvasOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757] animate-pulse" />
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          title="Share conversation"
        >
          <Share2 size={16} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          title="Settings"
        >
          <Sliders size={16} />
        </button>
      </div>
    </header>
  );
};

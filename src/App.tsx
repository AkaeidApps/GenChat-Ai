/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  loadChats,
  saveChats,
  loadActiveChatId,
  saveActiveChatId,
  loadSettings,
  saveSettings,
  loadProjects,
  saveProjects,
} from './utils/storage';
import { AppSettings, Artifact, Attachment, Chat, ChatPersona, Message, Project } from './types';
import { AVAILABLE_MODELS, CHAT_PERSONAS, PROMPT_STARTERS } from './constants/initialData';
import { extractArtifact } from './utils/markdown';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Composer } from './components/Composer';
import { MessageList } from './components/MessageList';
import { ArtifactCanvas } from './components/ArtifactCanvas';
import { SettingsModal } from './components/SettingsModal';
import { ProjectsModal } from './components/ProjectsModal';
import { ShareModal } from './components/ShareModal';
import { SparkIcon } from './components/SparkIcon';
import { GenChatLogo } from './components/GenChatLogo';
import { Code2, Brain, Feather, Sparkles, Zap } from 'lucide-react';

export default function App() {
  const [chats, setChats] = useState<Chat[]>(() => loadChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(() => loadActiveChatId());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [activeModelId, setActiveModelId] = useState<string>(
    settings.defaultModel || 'gemini-3.8-flash'
  );
  const [activePersonaId, setActivePersonaId] = useState<string>(
    settings.defaultPersonaId || 'general-assistant'
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Abort controller for streaming
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Persist chats
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Persist activeChatId
  useEffect(() => {
    saveActiveChatId(activeChatId);
  }, [activeChatId]);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist projects
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '[') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsProjectsOpen(false);
        setIsShareOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Sync active artifact and model/persona when chat loads
  useEffect(() => {
    if (activeChat) {
      if (activeChat.modelId) {
        setActiveModelId(activeChat.modelId);
      }
      if (activeChat.personaId) {
        setActivePersonaId(activeChat.personaId);
      }
      const msgWithArt = [...activeChat.messages]
        .reverse()
        .find((m) => m.artifact);
      if (msgWithArt?.artifact) {
        setActiveArtifact(msgWithArt.artifact);
      } else {
        setActiveArtifact(null);
        setCanvasOpen(false);
      }
    } else {
      setActiveArtifact(null);
      setCanvasOpen(false);
    }
  }, [activeChatId]);

  const handleNewChat = () => {
    if (isStreaming) handleStopStreaming();
    setActiveChatId(null);
    setActiveArtifact(null);
    setCanvasOpen(false);
    setActivePersonaId(settings.defaultPersonaId || 'general-assistant');
  };

  const handleSelectChat = (id: string) => {
    if (isStreaming) handleStopStreaming();
    setActiveChatId(id);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setActiveArtifact(null);
      setCanvasOpen(false);
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isStarred: !c.isStarred } : c))
    );
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleSendMessage = async (
    userContent: string,
    attachments: Attachment[] = [],
    options: { enableThinking: boolean; enableWebSearch: boolean }
  ) => {
    if (isStreaming) return;

    let currentChat = activeChat;
    let chatId = activeChatId;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userContent,
      attachments,
      timestamp: Date.now(),
    };

    // If new chat, initialize it with current model and persona
    if (!currentChat || !chatId) {
      chatId = `chat-${Date.now()}`;
      const title =
        userContent.slice(0, 42).replace(/\n/g, ' ') || 'New Conversation';
      const newChat: Chat = {
        id: chatId,
        title,
        messages: [userMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: activeModelId,
        personaId: activePersonaId,
        projectId: activeProjectId || undefined,
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(chatId);
      currentChat = newChat;
    } else {
      // Append user message to current chat
      const updatedMessages = [...currentChat.messages, userMessage];
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: updatedMessages, updatedAt: Date.now() }
            : c
        )
      );
    }

    // Prepare assistant placeholder message
    const assistantMessageId = `msg-${Date.now() + 1}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      thinking: options.enableThinking ? '' : undefined,
      timestamp: Date.now() + 1,
      modelUsed: activeModelId,
      isStreaming: true,
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    // Combine system prompt with chatbot persona role and project instructions
    const activePersona =
      CHAT_PERSONAS.find((p) => p.id === activePersonaId) || CHAT_PERSONAS[0];
    const activeProject = projects.find((p) => p.id === activeProjectId);

    const combinedSystemPrompt = [
      activePersona.systemInstruction,
      settings.systemPrompt,
      activeProject
        ? `Project Workspace Context (${activeProject.name}): ${activeProject.customInstructions}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...(currentChat?.messages || []),
            userMessage,
          ].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: activeModelId,
          systemInstruction: combinedSystemPrompt,
          enableThinking: options.enableThinking,
          enableWebSearch: options.enableWebSearch,
          attachments,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let fullThinking = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = 'chunk';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (currentEvent === 'chunk' && data.text) {
                fullContent += data.text;
              } else if (currentEvent === 'thinking' && data.text) {
                fullThinking += data.text;
              }

              // Update assistant message state
              setChats((prev) =>
                prev.map((c) => {
                  if (c.id !== chatId) return c;
                  const msgs = c.messages.map((m) => {
                    if (m.id === assistantMessageId) {
                      return {
                        ...m,
                        content: fullContent,
                        thinking: fullThinking || m.thinking,
                      };
                    }
                    return m;
                  });
                  return { ...c, messages: msgs };
                })
              );
            } catch (err) {
              console.error('Error parsing SSE data line:', err);
            }
          }
        }
      }

      // Check if an artifact was generated in the response!
      const detectedArtifact = extractArtifact(fullContent);

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          const msgs = c.messages.map((m) => {
            if (m.id === assistantMessageId) {
              return {
                ...m,
                content: fullContent,
                thinking: fullThinking || undefined,
                artifact: detectedArtifact || undefined,
                isStreaming: false,
              };
            }
            return m;
          });
          return { ...c, messages: msgs };
        })
      );

      if (detectedArtifact) {
        setActiveArtifact(detectedArtifact);
        setCanvasOpen(true);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat streaming failed:', error);
        setChats((prev) =>
          prev.map((c) => {
            if (c.id !== chatId) return c;
            const msgs = c.messages.map((m) => {
              if (m.id === assistantMessageId) {
                return {
                  ...m,
                  content:
                    m.content ||
                    'Sorry, I encountered an issue generating a response. Please check your network connection or try again.',
                  isStreaming: false,
                };
              }
              return m;
            });
            return { ...c, messages: msgs };
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (!activeChat || activeChat.messages.length < 2 || isStreaming) return;
    const lastUserMessage = [...activeChat.messages]
      .reverse()
      .find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message and re-send
    const prunedMessages = activeChat.messages.slice(0, -1);
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: prunedMessages } : c
      )
    );

    handleSendMessage(
      lastUserMessage.content,
      lastUserMessage.attachments || [],
      {
        enableThinking: activeModelId === 'gemini-4-argon',
        enableWebSearch: false,
      }
    );
  };

  const handleEditMessage = (id: string, newContent: string) => {
    if (!activeChat) return;
    const msgIndex = activeChat.messages.findIndex((m) => m.id === id);
    if (msgIndex === -1) return;

    // Keep messages up to edited message, update it, and resubmit
    const pruned = activeChat.messages.slice(0, msgIndex);
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: pruned } : c
      )
    );

    handleSendMessage(newContent, [], {
      enableThinking: activeModelId === 'gemini-4-argon',
      enableWebSearch: false,
    });
  };

  const handleExportData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ chats, projects, settings }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `genchat-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearAllChats = () => {
    setChats([]);
    setActiveChatId(null);
    setActiveArtifact(null);
    setCanvasOpen(false);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonaIcon = (iconName: string) => {
    if (iconName === 'Code2') return <Code2 size={14} className="text-[#d97757]" />;
    if (iconName === 'Brain') return <Brain size={14} className="text-purple-400" />;
    if (iconName === 'Feather') return <Feather size={14} className="text-blue-400" />;
    return <Sparkles size={14} className="text-amber-400" />;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onToggleStar={handleToggleStar}
        onRenameChat={handleRenameChat}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        onOpenProjectsModal={() => setIsProjectsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userName={settings.userName}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Top Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(true)}
          activeModelId={activeModelId}
          onSelectModel={(id) => setActiveModelId(id)}
          activePersonaId={activePersonaId}
          onSelectPersona={(id) => setActivePersonaId(id)}
          chatTitle={activeChat?.title}
          onRenameChat={(newTitle) =>
            activeChat && handleRenameChat(activeChat.id, newTitle)
          }
          onOpenShareModal={() => setIsShareOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          theme={settings.theme}
          onToggleTheme={() =>
            setSettings((s) => ({
              ...s,
              theme: s.theme === 'dark' ? 'light' : 'dark',
            }))
          }
          hasArtifact={!!activeArtifact}
          canvasOpen={canvasOpen}
          onToggleCanvas={() => setCanvasOpen(!canvasOpen)}
          activeProjectName={activeProject?.name}
        />

        {/* Chat / Welcome Viewport */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {!activeChat || activeChat.messages.length === 0 ? (
            /* Claude-Style Centered Hero Welcome View */
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
              <div className="text-center mb-6 space-y-3 flex flex-col items-center">
                <GenChatLogo
                  size={68}
                  showText={true}
                  showTagline={true}
                  className="flex flex-col items-center justify-center gap-2 mb-1"
                />
                <h1 className="font-serif-claude text-2xl sm:text-3xl font-normal tracking-tight text-[var(--text-primary)]">
                  {getGreeting()},{' '}
                  <span className="italic font-light">{settings.userName}</span>
                </h1>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  Ask anything or collaborate with Gemini on code, science, analysis, and writing.
                </p>
              </div>

              {/* Chatbot Persona / Role Selector Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 max-w-xl">
                {CHAT_PERSONAS.map((persona) => {
                  const isSelected = activePersonaId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => setActivePersonaId(persona.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#d97757] text-white shadow-xs'
                          : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {getPersonaIcon(persona.iconName)}
                      <span>{persona.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Centered Composer */}
              <div className="w-full mb-8">
                <Composer
                  onSendMessage={handleSendMessage}
                  isStreaming={isStreaming}
                  onStopStreaming={handleStopStreaming}
                  activeModelId={activeModelId}
                  onSelectModel={setActiveModelId}
                  placeholder={`Ask ${
                    CHAT_PERSONAS.find((p) => p.id === activePersonaId)?.name || 'Gemini'
                  } anything...`}
                  isCentered={true}
                />
              </div>

              {/* Prompt Starters Cards */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROMPT_STARTERS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (item.category === 'Code') {
                        setActiveModelId('gemini-3.8-flash');
                        setActivePersonaId('software-architect');
                      } else if (item.category === 'Learn') {
                        setActiveModelId('gemini-4-argon');
                        setActivePersonaId('stem-researcher');
                      } else if (item.category === 'Design') {
                        setActiveModelId('gemini-4-argon');
                        setActivePersonaId('software-architect');
                      } else {
                        setActiveModelId('gemini-3.8-flash');
                        setActivePersonaId('creative-writer');
                      }
                      handleSendMessage(item.prompt, [], {
                        enableThinking: false,
                        enableWebSearch: false,
                      });
                    }}
                    className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#d97757]/40 hover:bg-[var(--bg-card-hover)] text-left transition-all shadow-xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs text-[var(--text-primary)] group-hover:text-[#d97757] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Multi-Turn Conversation View */
            <div className="flex-1 flex flex-col min-h-0">
              <MessageList
                messages={activeChat.messages}
                isStreaming={isStreaming}
                onRegenerate={handleRegenerate}
                onEditMessage={handleEditMessage}
                onOpenArtifact={(art) => {
                  setActiveArtifact(art);
                  setCanvasOpen(true);
                }}
              />

              {/* Bottom Pinned Composer */}
              <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-page)]/80 backdrop-blur-md">
                <Composer
                  onSendMessage={handleSendMessage}
                  isStreaming={isStreaming}
                  onStopStreaming={handleStopStreaming}
                  activeModelId={activeModelId}
                  onSelectModel={setActiveModelId}
                  placeholder={`Reply to ${
                    CHAT_PERSONAS.find((p) => p.id === activePersonaId)?.name || 'Gemini'
                  }...`}
                  isCentered={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Artifact Canvas */}
        <ArtifactCanvas
          artifact={activeArtifact}
          isOpen={canvasOpen}
          onClose={() => setCanvasOpen(false)}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(s) => setSettings(s)}
        onExportData={handleExportData}
        onClearAllChats={handleClearAllChats}
      />

      {/* Projects Modal */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        onCreateProject={(p) =>
          setProjects((prev) => [
            ...prev,
            { ...p, id: `proj-${Date.now()}`, createdAt: Date.now() },
          ])
        }
        onDeleteProject={(id) => {
          setProjects((prev) => prev.filter((p) => p.id !== id));
          if (activeProjectId === id) setActiveProjectId(null);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        chat={activeChat}
      />
    </div>
  );
}

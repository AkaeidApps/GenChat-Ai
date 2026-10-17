export type Role = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  data: string; // Base64 data URL
}

export interface Artifact {
  id: string;
  title: string;
  type: 'html' | 'react' | 'svg' | 'markdown' | 'code';
  language: string;
  content: string;
  createdAt: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  thinking?: string;
  attachments?: Attachment[];
  artifact?: Artifact;
  timestamp: number;
  modelUsed?: string;
  isStreaming?: boolean;
}

export interface ChatPersona {
  id: string;
  name: string;
  badge: string;
  description: string;
  iconName: string;
  systemInstruction: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  isStarred?: boolean;
  projectId?: string;
  modelId: string;
  personaId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  customInstructions: string;
  color: string;
  files: {
    id: string;
    name: string;
    content: string;
    size: number;
  }[];
  createdAt: number;
}

export interface ModelOption {
  id: string;
  geminiModel: string;
  name: string;
  badge: string;
  description: string;
  contextWindow: string;
  isDefault?: boolean;
  supportsThinking?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  defaultModel: string;
  defaultPersonaId: string;
  systemPrompt: string;
  userName: string;
  fontSize: 'compact' | 'normal' | 'comfortable';
  sendOnEnter: boolean;
  enableThinkingByDefault: boolean;
}

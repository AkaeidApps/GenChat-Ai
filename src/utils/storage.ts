import { AppSettings, Chat, Project } from '../types';
import { DEFAULT_SETTINGS, INITIAL_CHATS } from '../constants/initialData';

const STORAGE_KEYS = {
  CHATS: 'genchat_chats_v1',
  ACTIVE_CHAT: 'genchat_active_chat_v1',
  SETTINGS: 'genchat_settings_v1',
  PROJECTS: 'genchat_projects_v1',
};

export function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load chats from localStorage', e);
  }
  return INITIAL_CHATS;
}

export function saveChats(chats: Chat[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats to localStorage', e);
  }
}

export function loadActiveChatId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT);
  } catch {
    return null;
  }
}

export function saveActiveChatId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT);
    }
  } catch (e) {
    console.error('Failed to save active chat ID', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load projects', e);
  }
  return [
    {
      id: 'proj-1',
      name: 'Design System & UI',
      description: 'Guidelines and components for modern warm-minimal interfaces',
      customInstructions: 'Focus on high aesthetic restraint, clean typography, and zero-pill discipline.',
      color: '#d97757',
      files: [],
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
    },
  ];
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

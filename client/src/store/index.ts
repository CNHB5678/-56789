import { create } from 'zustand';
import { User, StyleModel, Content, Comment, HotTopic, AnalyticsData } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  styleModels: StyleModel[];
  contents: Content[];
  comments: Comment[];
  hotTopics: HotTopic[];
  analyticsData: AnalyticsData[];
  
  // Actions
  setUser: (user: User | null) => void;
  addStyleModel: (model: StyleModel) => void;
  updateStyleModel: (id: string, updates: Partial<StyleModel>) => void;
  deleteStyleModel: (id: string) => void;
  addContent: (content: Content) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  setHotTopics: (topics: HotTopic[]) => void;
  setComments: (comments: Comment[]) => void;
  setAnalyticsData: (data: AnalyticsData[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  styleModels: [],
  contents: [],
  comments: [],
  hotTopics: [],
  analyticsData: [],
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  addStyleModel: (model) => set((state) => ({ styleModels: [...state.styleModels, model] })),
  updateStyleModel: (id, updates) => set((state) => ({
    styleModels: state.styleModels.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),
  deleteStyleModel: (id) => set((state) => ({
    styleModels: state.styleModels.filter((m) => m.id !== id)
  })),
  addContent: (content) => set((state) => ({ contents: [...state.contents, content] })),
  updateContent: (id, updates) => set((state) => ({
    contents: state.contents.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteContent: (id) => set((state) => ({
    contents: state.contents.filter((c) => c.id !== id)
  })),
  setHotTopics: (topics) => set({ hotTopics: topics }),
  setComments: (comments) => set({ comments }),
  setAnalyticsData: (data) => set({ analyticsData: data }),
}));

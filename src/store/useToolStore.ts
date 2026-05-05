import { create } from 'zustand';
import { Tool, Category, Topic } from '../types';
import { tools, categories, topics } from '../utils/mockData';

interface ToolStore {
  tools: Tool[];
  categories: Category[];
  topics: Topic[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  sortBy: 'rating' | 'views' | 'date';
  favorites: string[];
  history: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleTag: (tag: string) => void;
  setSortBy: (sortBy: 'rating' | 'views' | 'date') => void;
  toggleFavorite: (toolId: string) => void;
  addToHistory: (toolId: string) => void;
  getFilteredTools: () => Tool[];
  getToolById: (id: string) => Tool | undefined;
  getToolsByCategory: (categoryId: string) => Tool[];
  getToolsByIds: (ids: string[]) => Tool[];
}

export const useToolStore = create<ToolStore>((set, get) => ({
  tools,
  categories,
  topics,
  searchQuery: '',
  selectedCategory: null,
  selectedTags: [],
  sortBy: 'rating',
  favorites: JSON.parse(localStorage.getItem('qishui-favorites') || '[]'),
  history: JSON.parse(localStorage.getItem('qishui-history') || '[]'),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleTag: (tag) =>
    set((state) => {
      const newTags = state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag];
      return { selectedTags: newTags };
    }),

  setSortBy: (sortBy) => set({ sortBy }),

  toggleFavorite: (toolId) =>
    set((state) => {
      const newFavorites = state.favorites.includes(toolId)
        ? state.favorites.filter((id) => id !== toolId)
        : [...state.favorites, toolId];
      localStorage.setItem('qishui-favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    }),

  addToHistory: (toolId) =>
    set((state) => {
      const newHistory = [toolId, ...state.history.filter((id) => id !== toolId)].slice(0, 50);
      localStorage.setItem('qishui-history', JSON.stringify(newHistory));
      return { history: newHistory };
    }),

  getFilteredTools: () => {
    const state = get();
    let filtered = [...state.tools];

    // Search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (state.selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === state.selectedCategory);
    }

    // Tags filter
    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((tool) =>
        state.selectedTags.some((tag) => tool.tags.includes(tag))
      );
    }

    // Sort
    if (state.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (state.sortBy === 'date') {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filtered;
  },

  getToolById: (id) => {
    return get().tools.find((tool) => tool.id === id);
  },

  getToolsByCategory: (categoryId) => {
    return get().tools.filter((tool) => tool.category === categoryId);
  },

  getToolsByIds: (ids) => {
    const state = get();
    return ids.map((id) => state.tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[];
  }
}));

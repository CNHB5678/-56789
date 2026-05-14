import { create } from 'zustand';
import { MediaFile, MediaType } from '@/types';

interface MediaFilters {
  type: MediaType | 'all';
  format: string | 'all';
  source: 'all' | 'scraped' | 'generated' | 'local';
  searchQuery: string;
}

interface MediaState {
  mediaFiles: MediaFile[];
  filters: MediaFilters;
  selectedMediaIds: string[];
  isLoading: boolean;

  setMediaFiles: (files: MediaFile[]) => void;
  addMediaFile: (file: MediaFile) => void;
  removeMediaFile: (id: string) => void;
  setFilters: (filters: Partial<MediaFilters>) => void;
  setSelectedMediaIds: (ids: string[]) => void;
  toggleMediaSelection: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

const defaultFilters: MediaFilters = {
  type: 'all',
  format: 'all',
  source: 'all',
  searchQuery: '',
};

export const useMediaStore = create<MediaState>((set) => ({
  mediaFiles: [],
  filters: defaultFilters,
  selectedMediaIds: [],
  isLoading: false,

  setMediaFiles: (mediaFiles) => set({ mediaFiles }),

  addMediaFile: (file) =>
    set((state) => ({
      mediaFiles: [...state.mediaFiles, file],
    })),

  removeMediaFile: (id) =>
    set((state) => ({
      mediaFiles: state.mediaFiles.filter((f) => f.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setSelectedMediaIds: (selectedMediaIds) => set({ selectedMediaIds }),

  toggleMediaSelection: (id) =>
    set((state) => ({
      selectedMediaIds: state.selectedMediaIds.includes(id)
        ? state.selectedMediaIds.filter((i) => i !== id)
        : [...state.selectedMediaIds, id],
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));

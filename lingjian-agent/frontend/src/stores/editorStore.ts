import { create } from 'zustand';
import { Track, Clip, GridSettings } from '@/types';

type EditorTool = 'select' | 'cut' | 'trim' | 'move';

interface EditorState {
  tracks: Track[];
  playheadPosition: number;
  selectedClipId: string | null;
  selectedTrackId: string | null;
  activeTool: EditorTool;
  playbackSpeed: number;
  volume: number;
  isPlaying: boolean;
  showGrid: boolean;
  gridSettings: GridSettings;
  zoom: number;

  setTracks: (tracks: Track[]) => void;
  addTrack: (track: Track) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  deleteTrack: (trackId: string) => void;

  addClip: (trackId: string, clip: Clip) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  deleteClip: (clipId: string) => void;
  moveClip: (clipId: string, newTrackId: string, newStartTime: number) => void;

  setPlayheadPosition: (position: number) => void;
  setSelectedClipId: (id: string | null) => void;
  setSelectedTrackId: (id: string | null) => void;
  setActiveTool: (tool: EditorTool) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleGrid: () => void;
  setGridSettings: (settings: Partial<GridSettings>) => void;
  setZoom: (zoom: number) => void;
}

const defaultGridSettings: GridSettings = {
  enabled: false,
  type: 'lines',
  color: '#ffffff',
  opacity: 0.5,
  spacing: 50,
  dotSize: 4,
};

export const useEditorStore = create<EditorState>((set) => ({
  tracks: [],
  playheadPosition: 0,
  selectedClipId: null,
  selectedTrackId: null,
  activeTool: 'select',
  playbackSpeed: 1,
  volume: 1,
  isPlaying: false,
  showGrid: false,
  gridSettings: defaultGridSettings,
  zoom: 1,

  setTracks: (tracks) => set({ tracks }),

  addTrack: (track) =>
    set((state) => ({
      tracks: [...state.tracks, track],
    })),

  updateTrack: (trackId, updates) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, ...updates } : t
      ),
    })),

  deleteTrack: (trackId) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== trackId),
    })),

  addClip: (trackId, clip) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
      ),
    })),

  updateClip: (clipId, updates) =>
    set((state) => ({
      tracks: state.tracks.map((t) => ({
        ...t,
        clips: t.clips.map((c) =>
          c.id === clipId ? { ...c, ...updates } : c
        ),
      })),
    })),

  deleteClip: (clipId) =>
    set((state) => ({
      tracks: state.tracks.map((t) => ({
        ...t,
        clips: t.clips.filter((c) => c.id !== clipId),
      })),
    })),

  moveClip: (clipId, newTrackId, newStartTime) =>
    set((state) => {
      let clipToMove: Clip | null = null;
      const tracksWithoutClip = state.tracks.map((t) => {
        const clip = t.clips.find((c) => c.id === clipId);
        if (clip) {
          clipToMove = { ...clip, startTime: newStartTime };
        }
        return {
          ...t,
          clips: t.clips.filter((c) => c.id !== clipId),
        };
      });

      if (!clipToMove) return state;

      return {
        tracks: tracksWithoutClip.map((t) =>
          t.id === newTrackId
            ? { ...t, clips: [...t.clips, clipToMove!] }
            : t
        ),
      };
    }),

  setPlayheadPosition: (playheadPosition) => set({ playheadPosition }),
  setSelectedClipId: (selectedClipId) => set({ selectedClipId }),
  setSelectedTrackId: (selectedTrackId) => set({ selectedTrackId }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setVolume: (volume) => set({ volume }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setGridSettings: (settings) =>
    set((state) => ({
      gridSettings: { ...state.gridSettings, ...settings },
    })),
  setZoom: (zoom) => set({ zoom }),
}));

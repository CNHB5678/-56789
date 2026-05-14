import { create } from 'zustand';
import { Transcription } from '@/types';

interface AudioState {
  currentAudio: {
    id: string;
    fileName: string;
    filePath: string;
    duration: number;
  } | null;
  transcription: Transcription | null;
  isProcessing: boolean;
  error: string | null;

  setCurrentAudio: (audio: AudioState['currentAudio']) => void;
  setTranscription: (transcription: Transcription | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentAudio: null,
  transcription: null,
  isProcessing: false,
  error: null,

  setCurrentAudio: (currentAudio) => set({ currentAudio }),
  setTranscription: (transcription) => set({ transcription }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  reset: () => set({
    currentAudio: null,
    transcription: null,
    isProcessing: false,
    error: null,
  }),
}));

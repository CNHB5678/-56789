import apiClient from './api';
import { Transcription, Keyword } from '@/types';

interface TranscribeResponse {
  id: string;
  fileName: string;
  duration: number;
  transcription: Transcription;
}

interface ExtractKeywordsRequest {
  text: string;
}

interface ExtractKeywordsResponse {
  keywords: Keyword[];
}

export const audioService = {
  async transcribe(file: File): Promise<TranscribeResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<TranscribeResponse>(
      '/audio/transcribe',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  async extractKeywords(text: string): Promise<ExtractKeywordsResponse> {
    const response = await apiClient.post<ExtractKeywordsResponse>(
      '/audio/extract-keywords',
      { text }
    );
    return response.data;
  },

  async getWaveform(audioId: string): Promise<number[]> {
    const response = await apiClient.get<{ waveform: number[] }>(
      `/audio/${audioId}/waveform`
    );
    return response.data.waveform;
  },

  async getSegments(audioId: string) {
    const response = await apiClient.get(`/audio/${audioId}/segments`);
    return response.data;
  },
};

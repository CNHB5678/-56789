import apiClient from './api';
import { MediaFile, MediaType, MediaSource } from '@/types';

interface MediaFilters {
  type?: MediaType | 'all';
  format?: string;
  source?: MediaSource | 'all';
  search?: string;
}

interface ScrapeRequest {
  keywords: string[];
  mediaType: MediaType;
}

interface ScrapeResponse {
  success: boolean;
  scraped: MediaFile[];
  missingKeywords: string[];
}

export const mediaService = {
  async getMediaList(filters?: MediaFilters): Promise<MediaFile[]> {
    const response = await apiClient.get<MediaFile[]>('/media/', {
      params: filters,
    });
    return response.data;
  },

  async uploadMedia(file: File): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<MediaFile>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteMedia(mediaId: string): Promise<void> {
    await apiClient.delete(`/media/${mediaId}`);
  },

  async getPreview(mediaId: string): Promise<string> {
    const response = await apiClient.get<{ preview: string }>(
      `/media/${mediaId}/preview`
    );
    return response.data.preview;
  },

  async searchMedia(keywords: string[]): Promise<MediaFile[]> {
    const response = await apiClient.post<MediaFile[]>('/media/search', {
      keywords,
    });
    return response.data;
  },

  async scrapeMedia(request: ScrapeRequest): Promise<ScrapeResponse> {
    const response = await apiClient.post<ScrapeResponse>(
      '/media/scrape',
      request
    );
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/media/categories');
    return response.data;
  },
};

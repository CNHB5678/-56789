import apiClient from './api';
import { MediaFile } from '@/types';

type ImageStyle = 'photorealistic' | 'anime' | 'illustration' | 'oil_painting' | 'sketch' | '3d' | 'ancient' | 'chinese' | 'sci-fi';

interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  style?: ImageStyle;
}

interface GenerateSVGRequest {
  keywords: string[];
  animationType?: string;
  duration?: number;
}

interface MatchRequest {
  keywords: string[];
  mediaType: 'image' | 'video' | 'audio' | 'svg';
  threshold?: number;
}

interface MatchResult {
  mediaId: string;
  similarity: number;
  matchedKeywords: string[];
}

interface RecognizeResult {
  tags: string[];
  description: string;
  objects: string[];
}

export const aiService = {
  async matchMedia(request: MatchRequest): Promise<MatchResult[]> {
    const response = await apiClient.post<MatchResult[]>('/ai/match', request);
    return response.data;
  },

  async generateSVG(request: GenerateSVGRequest): Promise<{ svgContent: string }> {
    const response = await apiClient.post<{ svgContent: string }>(
      '/ai/generate/svg',
      request
    );
    return response.data;
  },

  async generateImage(
    request: GenerateImageRequest
  ): Promise<{ imageBase64: string; seed?: number }> {
    const response = await apiClient.post<
      { imageBase64: string; seed?: number }
    >('/ai/generate/image', request);
    return response.data;
  },

  async recognizeMedia(mediaId: string): Promise<RecognizeResult> {
    const response = await apiClient.post<RecognizeResult>('/ai/recognize', {
      mediaId,
    });
    return response.data;
  },

  async scrapeMissingAssets(keywords: string[]): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
      '/ai/scrape-missing',
      { keywords }
    );
    return response.data;
  },
};

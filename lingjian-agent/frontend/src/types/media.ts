export type MediaType = 'image' | 'video' | 'audio' | 'svg';
export type MediaSource = 'scraped' | 'generated' | 'local';

export interface MediaFile {
  id: string;
  projectId?: string;
  filePath: string;
  fileName: string;
  mediaType: MediaType;
  format: string;
  duration?: number;
  width?: number;
  height?: number;
  thumbnail?: string;
  tags: string[];
  source: MediaSource;
  matchedSegments: string[];
  createdAt: Date;
}

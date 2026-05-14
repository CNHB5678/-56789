export type KeywordCategory = 'person' | 'location' | 'object' | 'action' | 'emotion' | 'other';

export interface Keyword {
  id: string;
  word: string;
  category: KeywordCategory;
  color: string;
  position: { start: number; end: number };
}

export interface AudioSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  keywords: Keyword[];
}

export interface Transcription {
  fullText: string;
  segments: AudioSegment[];
  keywords: Keyword[];
}

export interface AudioFile {
  id: string;
  filePath: string;
  fileName: string;
  duration: number;
  waveformData: number[];
  transcription?: Transcription;
}

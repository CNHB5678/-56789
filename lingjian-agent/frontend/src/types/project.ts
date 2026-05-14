import { AudioFile } from './audio';
import { MediaFile } from './media';
import { Timeline } from './editor';

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  audioFile?: AudioFile;
  mediaLibrary: MediaFile[];
  timeline: Timeline;
}

export type TrackType = 'video' | 'audio' | 'subtitle' | 'effect';
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'rotate' | 'custom';
export type GridType = 'lines' | 'dots' | 'random-dots';

export interface Position {
  x: number;
  y: number;
}

export interface Scale {
  x: number;
  y: number;
}

export interface Animation {
  type: AnimationType;
  direction?: 'in' | 'out';
  duration: number;
  delay: number;
  easing: string;
}

export interface Transition {
  type: string;
  duration: number;
}

export interface Clip {
  id: string;
  mediaId?: string;
  name?: string;
  startTime: number;
  endTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  position: Position;
  scale: Scale;
  rotation: number;
  opacity: number;
  volume: number;
  animations: Animation[];
  transitions: Transition[];
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  clips: Clip[];
  muted: boolean;
  locked: boolean;
  visible: boolean;
}

export interface GridSettings {
  enabled: boolean;
  type: GridType;
  color: string;
  opacity: number;
  spacing: number;
  dotSize?: number;
}

export interface Timeline {
  duration: number;
  tracks: Track[];
}

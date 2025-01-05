import { ISong } from "./ISong";

export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentlyPlaying: ISong | null;
  queue: ISong[];
  history: ISong[];
  startTime: number;
  pausedTime: number;
  currentTime: number;
  duration: number;
}

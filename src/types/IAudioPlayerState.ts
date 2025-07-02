import { IPlaylist } from './IPlaylist';
import { ISong } from './ISong';

export interface IAudioPlayerState {
  playlists: IPlaylist[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentlyPlaying: ISong | undefined;
  queue: ISong[];
  history: ISong[];
  startTime: number;
  pausedTime: number;
  currentTime: number;
  duration: number;
}

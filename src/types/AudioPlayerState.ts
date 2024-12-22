export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentlyPlaying: {
    authors: {
      id: number;
      name: string;
    };
    cover: string;
    title: string;
    songUrl: string;
  } | null;
  startTime: number;
  pausedTime: number;
  currentTime: number;
  duration: number;
}

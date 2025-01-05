import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AudioContextService from "../utils/audioContextService";
import { AudioPlayerState } from "../types/AudioPlayerState";
import { ISong } from "../types/ISong";

const audioContext = AudioContextService.getInstance();
const gainNode = AudioContextService.getGainNode();

let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioBuffer: AudioBuffer | null = null;
let currentSongUrl: string | null = null;
let currentTimeInterval: NodeJS.Timeout | null = null;

export const playAudio = createAsyncThunk(
  "audioPlayer/playAudio",
  async (song: ISong | null = null, { getState, dispatch }) => {
    try {
      let audioBuffer: AudioBuffer;
      let targetSongUrl: string;

      if (song?.source) {
        dispatch(audioPlayerSlice.actions.resetAudioPlayer());
        dispatch(audioPlayerSlice.actions.setCurrentlyPlaying(song));

        const state = getState() as { audioPlayer: AudioPlayerState };
        const isPlayingFromHistory =
          state.audioPlayer.history[0]?.source === song.source;

        if (!isPlayingFromHistory) {
          dispatch(addToHistory(song));
        }

        const response = await fetch(song.source);
        const arrayBuffer = await response.arrayBuffer();

        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        targetSongUrl = song.source;

        currentAudioBuffer = audioBuffer;
        currentSongUrl = song.source;
      } else {
        if (!currentAudioBuffer) {
          throw new Error("No audio buffer available");
        }
        audioBuffer = currentAudioBuffer;
        targetSongUrl = currentSongUrl || "Unknown";
      }

      if (currentAudioSource) {
        currentAudioSource.stop();
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(gainNode);
      const state = getState() as { audioPlayer: AudioPlayerState };
      const pausedTime = state.audioPlayer.pausedTime || 0;
      const startTime = audioContext.currentTime;

      source.start(startTime, pausedTime);
      currentAudioSource = source;

      const { volume, isMuted } = state.audioPlayer;
      AudioContextService.toggleMute(isMuted, volume);

      if (currentTimeInterval) {
        clearInterval(currentTimeInterval);
      }
      currentTimeInterval = setInterval(() => {
        const currentTime = pausedTime + (audioContext.currentTime - startTime);

        if (currentTime >= audioBuffer.duration) {
          dispatch(audioPlayerSlice.actions.setIsPlaying(false));
          dispatch(audioPlayerSlice.actions.setCurrentTime(0));
          dispatch(audioPlayerSlice.actions.setPausedTime(0));
        } else {
          dispatch(audioPlayerSlice.actions.setCurrentTime(currentTime));
        }
      }, 100);

      return {
        songUrl: targetSongUrl,
        startTime,
        pausedTime,
        duration: audioBuffer.duration,
      };
    } catch (error) {
      throw new Error("Error playing audio:", error);
    }
  }
);

export const pauseAudio = () => (dispatch, getState) => {
  const state = getState() as { audioPlayer: AudioPlayerState };

  if (currentAudioSource) {
    try {
      currentAudioSource.stop();
    } catch (error) {
      throw new Error("Error pausing audio:", error);
    }

    if (currentTimeInterval) {
      clearInterval(currentTimeInterval);
      currentTimeInterval = null;
    }

    const pausedTime =
      state.audioPlayer.pausedTime +
      (audioContext.currentTime - (state.audioPlayer.startTime || 0));

    currentAudioSource = null;

    dispatch(audioPlayerSlice.actions.setPausedTime(pausedTime));
    dispatch(audioPlayerSlice.actions.setIsPlaying(false));
  }
};

export const playNextSong = () => (dispatch, getState) => {
  const state = getState() as { audioPlayer: AudioPlayerState };

  if (state.audioPlayer.queue && state.audioPlayer.queue.length) {
    try {
      dispatch(playAudio(state.audioPlayer.queue[0]));
      dispatch(removeFirstFromQueue());
    } catch (error) {
      throw new Error("Error playing next song:", error);
    }
  }
};

export const playPreviousSong = () => (dispatch, getState) => {
  const state = getState() as { audioPlayer: AudioPlayerState };
  const { currentTime, currentlyPlaying, history } = state.audioPlayer;

  if (currentTime >= 3) {
    dispatch(playAudio(currentlyPlaying));
    return;
  }

  if (history.length > 0) {
    dispatch(removeFromHistory());
    const state = getState() as { audioPlayer: AudioPlayerState };
    const previousSong = state.audioPlayer.history[0];

    if (currentlyPlaying) {
      dispatch(addToQueue(currentlyPlaying));
    }
    dispatch(playAudio(previousSong));
  }
};

export const seekAudio = createAsyncThunk(
  "audioPlayer/seekAudio",
  (newTime: number, { getState, dispatch }) => {
    const state = getState() as { audioPlayer: AudioPlayerState };
    if (currentAudioSource) {
      try {
        currentAudioSource.stop();
      } catch (error) {}
    }

    if (currentTimeInterval) {
      clearInterval(currentTimeInterval);
    }

    dispatch(audioPlayerSlice.actions.setPausedTime(newTime));
    dispatch(audioPlayerSlice.actions.setCurrentTime(newTime));

    if (currentAudioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = currentAudioBuffer;
      source.connect(gainNode);

      const startTime = audioContext.currentTime;

      const { volume, isMuted } = state.audioPlayer;
      AudioContextService.toggleMute(isMuted, volume);

      source.start(startTime, newTime);
      currentAudioSource = source;
      currentTimeInterval = setInterval(() => {
        const currentTime = newTime + (audioContext.currentTime - startTime);

        if (currentAudioBuffer && currentTime >= currentAudioBuffer.duration) {
          dispatch(audioPlayerSlice.actions.setIsPlaying(false));
          dispatch(audioPlayerSlice.actions.setCurrentTime(0));
          dispatch(audioPlayerSlice.actions.setPausedTime(0));

          if (state.audioPlayer.queue && state.audioPlayer.queue.length) {
            dispatch(playAudio(state.audioPlayer.queue[0]));
            dispatch(removeFirstFromQueue());
          }
        } else {
          dispatch(audioPlayerSlice.actions.setCurrentTime(currentTime));
        }
      }, 100);

      if (state.audioPlayer.isPlaying) {
        dispatch(audioPlayerSlice.actions.setIsPlaying(true));
      }
    }
  }
);

const audioPlayerSlice = createSlice({
  name: "audioPlayer",
  initialState: {
    isPlaying: false,
    volume: 70,
    isMuted: false,
    currentlyPlaying: null,
    queue: [],
    history: [],
    startTime: 0,
    pausedTime: 0,
    currentTime: 0,
    duration: 0,
  } as AudioPlayerState,
  reducers: {
    setVolume: (state, action) => {
      state.volume = action.payload;
      state.isMuted = false;
      if (currentAudioSource) {
        AudioContextService.setVolume(action.payload);
      }
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
      if (currentAudioSource) {
        AudioContextService.toggleMute(state.isMuted, state.volume);
      }
    },
    setCurrentlyPlaying: (state, action) => {
      state.currentlyPlaying = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFirstFromQueue: (state) => {
      const [, ...rest] = state.queue;
      state.queue = rest;
    },

    addToHistory: (state, action) => {
      state.history.unshift(action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    removeFromHistory: (state) => {
      const [, ...rest] = state.history;
      state.history = rest;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    setPausedTime: (state, action) => {
      state.pausedTime = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    resetAudioPlayer: (state) => {
      if (currentAudioSource) {
        try {
          currentAudioSource.stop();
        } catch (error) {}
        currentAudioSource = null;
        currentAudioBuffer = null;
        currentSongUrl = null;
      }

      if (currentTimeInterval) {
        clearInterval(currentTimeInterval);
        currentTimeInterval = null;
      }

      state.isPlaying = false;
      state.currentlyPlaying = null;
      state.startTime = 0;
      state.pausedTime = 0;
      state.currentTime = 0;
      state.duration = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(playAudio.fulfilled, (state, action) => {
        if (action.payload) {
          state.isPlaying = true;
          state.startTime = action.payload.startTime;
          state.pausedTime = action.payload.pausedTime;
          state.duration = action.payload.duration;
          state.currentTime = state.pausedTime;
        }
      })
      .addCase(playAudio.rejected, (state) => {
        state.isPlaying = false;
      });
  },
});

export const {
  resetAudioPlayer,
  setPausedTime,
  setIsPlaying,
  setCurrentTime,
  setCurrentlyPlaying,
  addToQueue,
  removeFirstFromQueue,
  addToHistory,
  removeFromHistory,
  setVolume,
  toggleMute,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
export const selectIsPlaying = (state) => state.audioPlayer.isPlaying;
export const selectCurrentlyPlaying = (state) =>
  state.audioPlayer.currentlyPlaying;
export const selectNextSong = (state) =>
  state.audioPlayer.queue.length > 0 ? state.audioPlayer.queue[0] : null;
export const selectPreviousSong = (state) => state.audioPlayer.previousSong;
export const selectQueue = (state) => state.audioPlayer.queue;
export const selectCurrentTime = (state) => state.audioPlayer.currentTime;
export const selectDuration = (state) => state.audioPlayer.duration;
export const selectVolume = (state) => state.audioPlayer.volume;
export const selectIsMuted = (state) => state.audioPlayer.isMuted;

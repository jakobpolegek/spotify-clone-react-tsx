import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AudioContextService from "../contexts/audioContextService";
import { IAudioPlayerState } from "../types/IAudioPlayerState";
import { ISong } from "../types/ISong";
import { AppDispatch, RootState } from "../store";
import { IAudioPayload } from "../types/IAudioPayload";
import { IPlaylist } from "../types/IPlaylist";

let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioBuffer: AudioBuffer | null = null;
let currentSongUrl: string | null = null;
let currentTimeInterval: NodeJS.Timeout | null = null;

export const playAudio = createAsyncThunk<
  IAudioPayload,
  ISong | undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: Error;
  }
>("audioPlayer/playAudio", async (song = undefined, { getState, dispatch }) => {
  try {
    let audioBuffer: AudioBuffer;
    let targetSongUrl: string;
    const audioContext = AudioContextService.getInstance();
    const gainNode = AudioContextService.getGainNode();

    if (song?.source) {
      dispatch(audioPlayerSlice.actions.resetAudioPlayer());
      dispatch(audioPlayerSlice.actions.setCurrentlyPlaying(song));

      const state = getState() as { audioPlayer: IAudioPlayerState };
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
    const state = getState() as { audioPlayer: IAudioPlayerState };
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
    throw new Error("Error playing audio:" + error);
  }
});

export const pauseAudio =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState() as { audioPlayer: IAudioPlayerState };

    if (currentAudioSource) {
      const audioContext = AudioContextService.getInstance();
      try {
        currentAudioSource.stop();
      } catch (error) {
        throw new Error("Error pausing audio:" + error);
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

export const playNextSong =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState() as { audioPlayer: IAudioPlayerState };

    if (state.audioPlayer.queue && state.audioPlayer.queue.length) {
      try {
        dispatch(playAudio(state.audioPlayer.queue[0]));
        dispatch(removeFirstFromQueue());
      } catch (error) {
        throw new Error("Error playing next song:" + error);
      }
    }
  };

export const playPreviousSong =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState() as { audioPlayer: IAudioPlayerState };
    const { currentTime, currentlyPlaying, history } = state.audioPlayer;

    if (currentTime >= 3) {
      dispatch(playAudio(currentlyPlaying));
      return;
    }

    if (history.length > 0) {
      dispatch(removeFromHistory());
      const state = getState() as { audioPlayer: IAudioPlayerState };
      const previousSong = state.audioPlayer.history[0];

      if (currentlyPlaying) {
        dispatch(addToQueue(currentlyPlaying));
      }
      dispatch(playAudio(previousSong));
    }
  };

export const seekAudio = createAsyncThunk<
  void,
  number,
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: Error;
  }
>("audioPlayer/seekAudio", (newTime, { getState, dispatch }) => {
  const state = getState() as { audioPlayer: IAudioPlayerState };
  const audioContext = AudioContextService.getInstance();
  const gainNode = AudioContextService.getGainNode();
  
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
          const song = state.audioPlayer.queue[0];
          dispatch(playAudio(song));
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
});

const audioPlayerSlice = createSlice({
  name: "audioPlayer",
  initialState: {
    playlists: [],
    isPlaying: false,
    volume: 70,
    isMuted: false,
    currentlyPlaying: undefined,
    queue: [],
    history: [],
    startTime: 0,
    pausedTime: 0,
    currentTime: 0,
    duration: 0,
  } as IAudioPlayerState,
  reducers: {
    setVolume: (state, action) => {
      state.volume = action.payload;
      state.isMuted = false;
      if (currentAudioSource) {
        AudioContextService.setVolume(action.payload);
      }
    },
    setPlaylists: (state, action: PayloadAction<IPlaylist[]>) => {
      state.playlists = action.payload;
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
    playNext: (state, action) => {
      state.queue.unshift(action.payload);
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
      state.currentlyPlaying = undefined;
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
  setPlaylists,
  setPausedTime,
  setIsPlaying,
  setCurrentTime,
  setCurrentlyPlaying,
  addToQueue,
  playNext,
  removeFirstFromQueue,
  addToHistory,
  removeFromHistory,
  setVolume,
  toggleMute,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
export const selectIsPlaying = (state: RootState) =>
  state.audioPlayer.isPlaying;
export const selectCurrentlyPlaying = (state: RootState) =>
  state.audioPlayer.currentlyPlaying;
export const selectNextSong = (state: RootState) =>
  state.audioPlayer.queue.length > 0 ? state.audioPlayer.queue[0] : null;
export const selectPreviousSong = (state: RootState) =>
  state.audioPlayer.history.length > 0 ? state.audioPlayer.history[0] : null;
export const selectQueue = (state: RootState) => state.audioPlayer.queue;
export const selectCurrentTime = (state: RootState) =>
  state.audioPlayer.currentTime;
export const selectPlaylists = (state: RootState) =>
  state.audioPlayer.playlists;
export const selectDuration = (state: RootState) => state.audioPlayer.duration;
export const selectVolume = (state: RootState) => state.audioPlayer.volume;
export const selectIsMuted = (state: RootState) => state.audioPlayer.isMuted;

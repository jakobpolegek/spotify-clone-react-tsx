import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AudioContextService from "../utils/audioContextService";
import AudioPlayerState from "../types/AudioPlayerState";

const audioContext = AudioContextService.getInstance();
const gainNode = AudioContextService.getGainNode();

let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioBuffer: AudioBuffer | null = null;
let currentSongUrl: string | null = null;
let currentTimeInterval: NodeJS.Timeout | null = null;

export const playAudio = createAsyncThunk(
  "audioPlayer/playAudio",
  async (song = {}, { getState, dispatch }) => {
    try {
      let audioBuffer: AudioBuffer;
      let targetSongUrl: string;

      if (song.source) {
        dispatch(audioPlayerSlice.actions.resetAudioPlayer());
        dispatch(audioPlayerSlice.actions.setCurrentlyPlaying(song));
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
      }, 1000);

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
    } catch (error) {}

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

        if (currentTime >= currentAudioBuffer.duration) {
          dispatch(audioPlayerSlice.actions.setIsPlaying(false));
          dispatch(audioPlayerSlice.actions.setCurrentTime(0));
          dispatch(audioPlayerSlice.actions.setPausedTime(0));
        } else {
          dispatch(audioPlayerSlice.actions.setCurrentTime(currentTime));
        }
      }, 1000);

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
    currentlyPlaying: {
      authors: {
        id: null,
        name: null,
      },
      cover: null,
      title: null,
      songUrl: null,
    },
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
      state.currentlyPlaying = {
        author: null,
        cover: null,
        title: null,
        songUrl: null,
      };
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
  setVolume,
  toggleMute,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
export const selectIsPlaying = (state) => state.audioPlayer.isPlaying;
export const selectCurrentlyPlaying = (state) =>
  state.audioPlayer.currentlyPlaying;
export const selectCurrentTime = (state) => state.audioPlayer.currentTime;
export const selectDuration = (state) => state.audioPlayer.duration;
export const selectVolume = (state) => state.audioPlayer.volume;
export const selectIsMuted = (state) => state.audioPlayer.isMuted;

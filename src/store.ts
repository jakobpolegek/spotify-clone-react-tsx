import { configureStore } from "@reduxjs/toolkit";
import audioPlayerReducer from "./slices/audioPlayerSlice";

export const store = configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

declare module "@reduxjs/toolkit" {
  interface DefaultRootState extends RootState {}
}

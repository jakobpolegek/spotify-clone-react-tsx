import { useDispatch } from "react-redux";
import { ISong } from "../types/ISong";
import {
    pauseAudio,
    playAudio,
  } from "../slices/audioPlayerSlice";
import { AppDispatch } from "../store";

export const useAudioControls = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handlePlay = (song: ISong) => {
        try {
            if (song) {
                const modifiedSong: ISong = {
                ...song,
                authors: song.authors,
                cover: song.cover,
                };
                dispatch(playAudio(modifiedSong));
            }
        } catch (error: any) {
        throw new Error(`An error occurred trying to play this song:` + error);
        }
    };

    const handlePause = () => {
        try {
            dispatch(pauseAudio());
        } catch (error: any) {
            throw new Error("Error pausing song:" + error);
        }
    };

    return { handlePlay, handlePause };
};
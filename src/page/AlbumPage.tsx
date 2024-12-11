import { useLoaderData } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  pauseAudio,
  playAudio,
  selectIsPlaying,
  selectCurrentlyPlaying,
} from "../slices/audioPlayerSlice";

const AlbumPage = () => {
  const album = useLoaderData();
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);

  const handlePlay = (song) => {
    try {
      if (song) {
        dispatch(playAudio({ ...song, cover: album.cover }));
      }
    } catch (error) {
      throw new Error(`An error occurred trying to play this song:`, error);
    }
  };

  const handlePause = () => {
    try {
      dispatch(pauseAudio());
    } catch (error) {
      throw new Error("Error pausing song:", error);
    }
  };

  return (
    <div className="col-span-7 row-span-11">
      <div id="album-header" className="flex bg-slate-800 text-white">
        <img src={album.cover} className="h-60 w-60 m-4 ml-12 mt-12" />
        <div id="album-metadata" className="flex flex-col mt-auto mb-10">
          Album
          <h1 className="text-8xl font-extrabold mt-2"> {album.title}</h1>
          <h3 className="mt-0"> {album.authors.name}</h3>
        </div>
      </div>
      <div id="songs" className="flex flex-col">
        {album.songs.map((song) => (
          <div
            id="song"
            key={song.id}
            className="flex flex-row text-white ml-4 mt-4 items-center"
          >
            {currentlyPlaying === song.source && isPlaying ? (
              <Button onClick={handlePause}>
                <Pause />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handlePlay(song);
                }}
              >
                <Play />
              </Button>
            )}
            <div id="song-metadata" className="flex flex-col">
              <h1 className="ml-4">{song.title}</h1>
              <h3 className="ml-4">{song.authors.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;

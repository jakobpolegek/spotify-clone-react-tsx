import { useLoaderData } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { Button } from "../components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  pauseAudio,
  playAudio,
  selectIsPlaying,
  selectCurrentlyPlaying,
  addToQueue,
  selectQueue,
} from "../slices/audioPlayerSlice";
import { IAlbum } from "../types/IAlbum";
import { ISong } from "../types/ISong";
import { AppDispatch } from "../store";

const AlbumPage = () => {
  const album = useLoaderData() as IAlbum;
  const dispatch = useDispatch<AppDispatch>();
  const isPlaying = useSelector(selectIsPlaying);
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);
  const queue: ISong[] = useSelector(selectQueue);

  const handlePlay = (song: ISong) => {
    try {
      if (song) {
        const modifiedSong: ISong = {
          ...song,
          authors: album.authors,
          cover: album.cover,
        };
        dispatch(playAudio(modifiedSong));
      }

      if ((!queue || queue.length < 1) && album.songs) {
        album.songs.forEach((song) => {
          const modifiedSong: ISong = {
            ...song,
            authors: album.authors,
            cover: album.cover,
          };
          dispatch(addToQueue(modifiedSong));
        });
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

  return (
    <div className="col-span-7 row-span-11 h-[calc(100vh-200px)] overflow-y-auto">
      <div id="album-header" className="flex bg-slate-800 text-white">
        <img src={album.cover} className="h-60 w-60 m-4 ml-12 mt-12" />
        <div id="album-metadata" className="flex flex-col mt-auto mb-10">
          Album
          <h1 className="text-8xl font-extrabold mt-2"> {album.title}</h1>
          <h3 className="mt-0">
            {album.authors.map((author) => author.name).join(", ")}
          </h3>
        </div>
      </div>
      <div id="songs" className="flex flex-col">
        {album.songs?.map((song) => (
          <div
            id="song"
            key={song.title}
            className="flex flex-row text-white ml-4 mt-4 items-center"
          >
            {isPlaying && currentlyPlaying?.title === song.title ? (
              <Button variant="link" onClick={handlePause}>
                <Pause />
              </Button>
            ) : (
              <Button
                variant="link"
                onClick={() => {
                  handlePlay(song);
                }}
              >
                <Play />
              </Button>
            )}
            <div id="song-metadata" className="flex flex-col ml-4">
              <h1>
                {song.title.replace(/^[0-9]{2}\s-\s/, "").replace(/\.mp3$/, "")}
              </h1>
              <h3 className="text-gray-400">
                {album.authors.map((author) => author.name).join(", ")}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;

import { ISong } from "../types/ISong";
import {
    Play,
    Pause,
  } from "lucide-react";
  import { Button } from "../components/ui/button";
import {
    selectCurrentlyPlaying,
  } from "../slices/audioPlayerSlice";
import {  useSelector } from "react-redux";
import { useAudioControls } from "../utils/songUtils";
import { Link } from "react-router-dom";
import { Authors } from "./Authors";

export const Song = ({ song, isPlaying, page = 0 }: { song:ISong, isPlaying:boolean, page:number}) => {
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);
  const { handlePlay, handlePause } = useAudioControls();

  return (
    <div
      id="song"
      className={`flex flex-row text-white ml-6 ${page === 0 ? 'mt-6' : 'mt-1'} items-center`}
    >
      {isPlaying && song.title === currentlyPlaying?.title ? (
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
      {page === 1 ? (
        <img className="m-1 ml-5 w-16 h-16" src={song.cover} />
      ) : null}
      <div id="song-metadata" className="flex flex-col ml-4">
        <Link to={`/artist/${song?.authors[0].id}/albums/${song?.albumId}`}>
          <h1>
            {song.title.replace(/^[0-9]{2}\s-\s/, "").replace(/\.mp3$/, "")}
          </h1>
        </Link>
        <Authors authors={song.authors} />
      </div>
    </div>
  );
};

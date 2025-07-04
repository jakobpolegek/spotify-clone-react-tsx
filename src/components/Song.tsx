import { ISong } from '../types/ISong';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { selectCurrentlyPlaying, playAudio } from '../slices/audioPlayerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAudioControls } from '../utils/songUtils';
import { Link } from 'react-router-dom';
import { Authors } from './Authors';
import { AppDispatch } from '../store';

export const Song = ({
  song,
  isPlaying,
  page = 0,
}: {
  song: ISong;
  isPlaying: boolean;
  page: number;
}) => {
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);
  const { handlePlay, handlePause } = useAudioControls();
  const dispatch: AppDispatch = useDispatch();

  return (
    <div
      id="song"
      className={`flex flex-row text-white ml:0 md:ml-6 ${page === 0 ? 'mt-6' : 'mt-1'} items-center`}
    >
      {isPlaying && song.title === currentlyPlaying?.title ? (
        <Button variant="link" onClick={handlePause}>
          <Pause />
        </Button>
      ) : (
        <Button
          variant="link"
          onClick={() => {
            if (song.source === currentlyPlaying?.source) {
              dispatch(playAudio());
            } else {
              handlePlay(song);
            }
          }}
        >
          <Play />
        </Button>
      )}
      {page !== 0 ? (
        <img
          className="rounded-sm m-1 ml-5 w-16 h-16"
          src={song.cover}
          alt="cover"
        />
      ) : null}
      {song.authors && (
        <div id="song-metadata" className="flex flex-col ml-4">
          <Link to={`/artist/${song?.authors[0].id}/albums/${song?.albumId}`}>
            <h1>
              {song.title.replace(/^[0-9]{2}\s-\s/, '').replace(/\.mp3$/, '')}
            </h1>
          </Link>
          <Authors authors={song.authors} isHeader={false} />
        </div>
      )}
    </div>
  );
};

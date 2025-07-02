import { useEffect } from 'react';
import { Button } from './ui/button';
import {
  SkipBackIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Slider } from './ui/slider';
import CurrentlyPlaying from './CurrentlyPlaying';
import { useSelector, useDispatch } from 'react-redux';
import {
  pauseAudio,
  playAudio,
  playNextSong,
  playPreviousSong,
  selectCurrentlyPlaying,
  selectIsPlaying,
  selectCurrentTime,
  selectDuration,
  seekAudio,
  setVolume,
  toggleMute,
  selectVolume,
  selectIsMuted,
} from '../slices/audioPlayerSlice';
import { AppDispatch } from '../store';

const Player = () => {
  const dispatch: AppDispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);
  const currentTime = useSelector(selectCurrentTime);
  const duration = useSelector(selectDuration);
  const volume = useSelector(selectVolume);
  const isMuted = useSelector(selectIsMuted);

  const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    dispatch(setVolume(volume));
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    try {
      dispatch(playAudio());
    } catch {
      throw new Error(`An error occurred trying to play this song.`);
    }
  };

  const handlePlayNextSong = () => {
    try {
      dispatch(playNextSong());
    } catch {
      throw new Error(`An error occurred trying to play this song.`);
    }
  };
  const handlePlayPreviousSong = () => {
    try {
      dispatch(playPreviousSong());
    } catch {
      throw new Error(`An error occurred trying to play this song.`);
    }
  };

  const handlePause = () => {
    try {
      dispatch(pauseAudio());
    } catch {
      throw new Error(`An error occurred trying to pause this song.`);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (value && value.length > 0 && isPlaying) {
      const newTime = (value[0] / 100) * duration;
      dispatch(seekAudio(newTime));
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (value && value.length > 0) {
      dispatch(setVolume(value[0]));
    }
  };

  const handleVolumeClick = () => {
    dispatch(toggleMute());
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={36} />;
    if (volume < 33) return <Volume size={36} />;
    if (volume < 66) return <Volume1 size={36} />;
    return <Volume2 size={36} />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 z-50">
      {currentlyPlaying ? (
        <div className="grid grid-cols-3 ml-2 md:ml-0">
          <CurrentlyPlaying />
          <div
            id="player-controls"
            className="flex flex-col items-center justify-center mt-2 sm:ml-14 ml-14 md:ml-12"
          >
            <div className="flex mt-2 gap-2 mr-24 mb-2 md:mr-0 md:mb-0">
              <Button variant="link" onClick={handlePlayPreviousSong}>
                <SkipBackIcon size={42} />
              </Button>
              {isPlaying ? (
                <Button variant="link" onClick={handlePause}>
                  <PauseIcon size={42} />
                </Button>
              ) : (
                <Button variant="link" onClick={handlePlay}>
                  <PlayIcon size={42} />
                </Button>
              )}
              <Button variant="link" onClick={handlePlayNextSong}>
                <SkipForwardIcon size={42} />
              </Button>
            </div>

            <div id="progress" className="flex items-center gap-3 mr-2 md:mr-0">
              <span className="text-white">{formatTime(currentTime)}</span>
              <Slider
                className="w-32 sd:w-32 md:w-96"
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
              />
              <span className="text-white">{formatTime(duration)}</span>
            </div>
          </div>

          <div id="volume" className="flex items-center justify-end gap-2">
            <Button
              variant="link"
              onClick={handleVolumeClick}
              className="text-primary p-0 mb-4 md:mb-0"
            >
              {getVolumeIcon()}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="mb-4 w-10 md:w-24 md:mb-0  mr-2 md:mr-0"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Player;

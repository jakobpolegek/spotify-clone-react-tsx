import { useEffect } from "react";
import { Button } from "./ui/button";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "./ui/slider";
import CurrentlyPlaying from "./CurrentlyPlaying";
import { useSelector, useDispatch } from "react-redux";
import {
  pauseAudio,
  playAudio,
  selectIsPlaying,
  selectCurrentTime,
  selectDuration,
  seekAudio,
  setVolume,
  toggleMute,
  selectVolume,
  selectIsMuted,
} from "../slices/audioPlayerSlice";

const Player = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
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
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlay = () => {
    try {
      dispatch(playAudio());
    } catch (error) {
      throw new Error(`An error occurred trying to play this song.`);
    }
  };

  const handlePause = () => {
    try {
      dispatch(pauseAudio());
    } catch (error) {
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
    <div className="col-span-10 mt-auto bg-slate-900 w-50">
      <div className="flex">
        <CurrentlyPlaying />
        <div className="flex flex-col justify-center items-center mb-3 grow mr-24">
          <div id="controls" className="flex mt-2 justify-center">
            <Button variant="link">
              {" "}
              <SkipBack size={42} />
            </Button>
            {isPlaying ? (
              <Button variant="link" onClick={handlePause}>
                {" "}
                <Pause size={42} />
              </Button>
            ) : (
              <Button variant="link" onClick={handlePlay}>
                {" "}
                <Play size={42} />
              </Button>
            )}
            <Button variant="link">
              {" "}
              <SkipForward size={42} />
            </Button>
          </div>
          <div id="progress" className="flex">
            <h1 className="mr-3 text-white">{formatTime(currentTime)}</h1>
            <Slider
              id="progress"
              className="flex justify-center w-96"
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
            />
            <h1 className="ml-3 text-white">{formatTime(duration)}</h1>
          </div>
        </div>
        <div
          id="volume"
          className="flex flex-row justify-center items-center w-32 mr-5"
        >
          <Button
            variant="link"
            onClick={handleVolumeClick}
            className="text-primary p-0 mr-2"
          >
            {getVolumeIcon()}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;

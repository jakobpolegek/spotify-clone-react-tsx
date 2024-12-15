import { useEffect } from "react";
import { Button } from "./ui/button";
import { SkipBack, Play, Pause, SkipForward, Volume } from "lucide-react";
import { Slider } from "./ui/slider";
import CurrentlyPlaying from "./CurrentlyPlaying";
import { useSelector, useDispatch } from "react-redux";
import {
  pauseAudio,
  playAudio,
  selectIsPlaying,
  selectCurrentlyPlaying,
  selectCurrentTime,
  selectDuration,
  setCurrentTime,
  seekAudio
} from "../slices/audioPlayerSlice";

const Player = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const currentTime = useSelector(selectCurrentTime);
  const duration = useSelector(selectDuration);

  const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (timeInSeconds) => {
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
    if (value && value.length > 0) {
      const newTime = (value[0] / 100) * duration;
      dispatch(seekAudio(newTime));
    }
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
          <Volume className="text-primary" size={36} />
          <Slider defaultValue={[70]} max={100} step={1} />
        </div>
      </div>
    </div>
  );
};

export default Player;

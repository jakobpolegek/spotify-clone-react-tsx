import { Button } from "./ui/button";
import { SkipBack, Play, Pause, SkipForward, Volume } from "lucide-react";
import { Slider } from "./ui/slider";
import CurrentlyPlaying from "./CurrentlyPlaying";

const Player = () => {
  return (
      <div className="col-span-10 mt-auto bg-slate-900">
          <div className="flex">
              <CurrentlyPlaying/>
              <div className="flex flex-col justify-center items-center mb-3 grow mr-24">
                  <div id="controls" className="flex mt-2 justify-center">
                      <Button variant="link">
                          {" "}
                          <SkipBack size={42}/>
                      </Button>
                      <Button variant="link">
                          {" "}
                          <Pause size={42}/>
                      </Button>
                      <Button variant="link">
                          {" "}
                          <SkipForward size={42}/>
                      </Button>
                  </div>
                  <div id="progress" className="flex">
                      <h1 className="mr-3 text-white">0:00</h1>
                      <Slider
                          className="flex justify-center w-96"
                          defaultValue={[0]}
                          max={100}
                          step={1}
                      />
                      <h1 className="ml-3 text-white">4:20</h1>
                  </div>
              </div>
              <div
                  id="volume"
                  className="flex flex-row justify-center items-center w-32 mr-5"
              >
                  <Volume className="text-primary" size={36}/>
                  <Slider defaultValue={[70]} max={100} step={1}/>
              </div>
          </div>
      </div>
  );
};

export default Player;

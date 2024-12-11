import { useSelector, useDispatch } from "react-redux";
import { selectCurrentlyPlaying } from "../slices/audioPlayerSlice";

const CurrentlyPlaying = () => {
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);

  return (
    <div className="flex flex-row items-end  w-auto mb-2">
      {currentlyPlaying.cover ? (
        <img
          width="60"
          height="60"
          className="m-1 ml-5"
          src={currentlyPlaying.cover}
        />
      ) : (
        <div></div>
      )}
      <div id="song" className="flex flex-col items-start mx-2 mb-2">
        {currentlyPlaying ? (
          <>
            <h3 id="title" className="font-bold text-white">
              {currentlyPlaying.title}
            </h3>
            <h3 id="artist" className="text-gray-300">
              {currentlyPlaying.authors.name}
            </h3>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;

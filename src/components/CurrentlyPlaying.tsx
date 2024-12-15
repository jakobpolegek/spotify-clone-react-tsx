import { useSelector, useDispatch } from "react-redux";
import { selectCurrentlyPlaying } from "../slices/audioPlayerSlice";

const CurrentlyPlaying = () => {
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);

  return (
    <div className="flex flex-row items-end mb-2 w-64">
      {currentlyPlaying.cover ? (
        <img
          className="m-1 ml-5 w-16 h-16"
          src={currentlyPlaying.cover}
        />
      ) : (
        <></>
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

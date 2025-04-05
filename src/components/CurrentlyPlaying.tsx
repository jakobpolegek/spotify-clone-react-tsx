import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentlyPlaying } from "../slices/audioPlayerSlice";
import { Authors } from "./Authors";

const CurrentlyPlaying = () => {
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);
  
  return (
    <div className="flex flex-row items-end mb-2 max-w-500">
      {currentlyPlaying ? (
        <>
          {currentlyPlaying.cover ? (
            <img className="m-1 ml-4 w-16 h-16" src={currentlyPlaying.cover} />
          ) : (
            <></>
          )}
          <div id="song" className="flex flex-col items-start mx-2 mb-2">
            <Link to={`/artist/${currentlyPlaying.authors[0].id}/albums/${currentlyPlaying.albumId}`}>
              <h3 id="title" className="font-bold text-white">
                {currentlyPlaying.title
                  ?.replace(/^[0-9]{2}\s-\s/, "")
                  .replace(/\.mp3$/, "")}
              </h3>
            </Link>
            <h3 id="artist" className="flex text-gray-300">
              <Authors authors={currentlyPlaying.authors} isHeader={false}/>
            </h3>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CurrentlyPlaying;

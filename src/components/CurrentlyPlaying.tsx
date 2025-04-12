import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentlyPlaying } from "../slices/audioPlayerSlice";
import { Authors } from "./Authors";

const CurrentlyPlaying = () => {
  const currentlyPlaying = useSelector(selectCurrentlyPlaying);
  
  return (
    <div className="flex flex-row items-end mb-2 max-w-500 mr-6">
      {currentlyPlaying ? (
        <>
          {currentlyPlaying.cover ? (
            <Link to={`/artist/${currentlyPlaying.authors[0].id}/albums/${currentlyPlaying.albumId}`}>
              <img className="w-12 h-16 mb-2 md:mb-0 md:m-1 md:ml-4 md:w-16 md:h-16" src={currentlyPlaying.cover} />
            </Link>
          ) : (
            <></>
          )}
            <div id="song" className="hidden md:flex flex-col items-start mx-2 mb-2">
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

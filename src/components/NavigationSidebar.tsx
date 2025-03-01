import {
  HeartIcon,
  ListIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPlaylists, setPlaylists } from "../slices/audioPlayerSlice";
import { useEffect } from "react";
import { getUserPlaylists } from "../utils/api/getUserPlaylist";
import { useUser } from "@clerk/clerk-react";

const NavigationSidebar = () => {
  const dispatch = useDispatch();
  const userPlaylists = useSelector(selectPlaylists);
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  useEffect(() => {
    if (user && userPlaylists?.length === 0) {
      getUserPlaylists(user.id).then((res) => {
        dispatch(setPlaylists(res.data));
      });
    }
  }, [userPlaylists]);

  return (
    <div className="ml-5 col-span-1 row-span-11 bg-slate-800 rounded p-4">
      <Link to="/likedSongs" className="flex items-center mb-4 mt-2">
        <HeartIcon color="#0C969C" />
        <h1 className="font-bold text-primary text-2xl ml-4">Liked songs</h1>
      </Link>
  
      <div className="flex flex-col">
        {[...new Set(userPlaylists.map(p => p.name))].map((playlistName) => {
          const lines = playlistName.split('\n').filter(Boolean);
          
          return (
            <Link 
              to={`/playlist/${playlistName}`} 
              key={playlistName} 
              className="flex items-start mb-4 mt-2"
            >
              <ListIcon color="#0C969C" className="flex-shrink-0" />
              <div className="ml-4">
                {lines.map((line, index) => (
                  <h1 
                    key={index} 
                    className="font-bold text-primary text-2xl break-words"
                  >
                    {line}
                  </h1>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationSidebar;



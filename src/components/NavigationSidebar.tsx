import {
  HeartIcon,
  ListIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPlaylists, setPlaylists } from "../slices/audioPlayerSlice";
import { useEffect } from "react";
import { getPlaylists } from "../utils/api/getPlaylists";
import { useUser } from "@clerk/clerk-react";

const NavigationSidebar = () => {
  const dispatch = useDispatch();
  const userPlaylists = useSelector(selectPlaylists);
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  const fetchPlaylists = async () => {
    try {
      if (user && userPlaylists?.length === 0) {
        const playlists = await getPlaylists(user.id);
        dispatch(setPlaylists(playlists));
      }
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user?.id]);

  return (
    <div className="ml-5 col-span-1 row-span-11 bg-slate-800 rounded p-4">
      <Link to="/likedSongs" className="flex items-center mb-4 mt-2">
        <HeartIcon color="#0C969C" />
        <h1 className="font-bold text-primary text-2xl ml-4">Liked songs</h1>
      </Link>
  
      <div className="flex flex-col">
        {userPlaylists.map((playlist) => (
          <Link 
            to={`/playlist/${playlist.id}`} 
            key={playlist.id} 
            className="flex items-start mb-4 mt-2"
          >
            <ListIcon color="#0C969C" className="flex-shrink-0 mt-1.5" />
            <div className="ml-4">
              <h1 className="font-bold text-primary text-2xl break-words">
                {playlist.name}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationSidebar;



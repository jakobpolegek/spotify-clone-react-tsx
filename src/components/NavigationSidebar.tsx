import { HeartIcon, ListIcon, MenuIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPlaylists, setPlaylists } from "../slices/audioPlayerSlice";
import { useEffect, useState, useRef } from "react";
import { getPlaylists } from "../utils/api/getPlaylists";
import { useUser } from "@clerk/clerk-react";

const NavigationSidebar = () => {
  const dispatch = useDispatch();
  const userPlaylists = useSelector(selectPlaylists);
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  if (!user) throw new Error("User not authenticated");

  const fetchPlaylists = async () => {
    try {
      if (user && userPlaylists?.length === 0) {
        const playlists = await getPlaylists(user.id);
        dispatch(setPlaylists(playlists));
      }
    } catch (error) {
      throw new Error("Failed to fetch playlists: " + error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlePlaylistSelect = () => {
    if (isOpen && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <div className="h-[calc(100vh-186px)]">
      <button
        onClick={toggleSidebar}
        className="text-primary fixed top-28 left-0 z-50 lg:hidden bg-slate-800 rounded border-2 border-slate-800 hover:bg-slate-700 transition duration-300"
      >
        {!isOpen && <MenuIcon size={24} />}
      </button>

      <div
        ref={sidebarRef}
        className={`
          ml:0 lg:ml-4 col-span-1 row-span-11 bg-slate-800 rounded p-4
          fixed left-0 top-0 h-full z-40
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:block lg:static lg:translate-x-0
          border-slate-900 border-r-8 lg:border-none
        `}
      >
        <Link
          to="/likedSongs"
          className="flex items-center mb-4 mt-8 lg:mt-2"
          onClick={handlePlaylistSelect}
        >
          <HeartIcon color="#0C969C" />
          <h1 className="font-bold text-primary text-2xl ml-4">Liked songs</h1>
        </Link>

        <div className="flex flex-col">
          {userPlaylists.map((playlist) => (
            <Link
              to={`/playlist/${playlist.id}`}
              key={playlist.id}
              className="flex items-start mb-4 mt-2"
              onClick={handlePlaylistSelect}
            >
              <ListIcon color="#0C969C" className="flex-shrink-0 mt-1.5" />
              <div className="ml-4">
                <h1 className="font-bold text-primary text-2xl break-words overflow-hidden max-w-[230px]">
                  {playlist.name}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;

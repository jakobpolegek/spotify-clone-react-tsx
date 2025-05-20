import { MenuIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlaylists, setPlaylists } from "../slices/audioPlayerSlice";
import { useEffect, useState, useRef } from "react";
import { getPlaylists } from "../utils/api/getPlaylists";
import { useUser } from "@clerk/clerk-react";
import { SidebarContent } from "./SidebarContent";

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
    <>
      <button
        onClick={toggleSidebar}
        className="text-primary fixed top-28 left-0 z-50 md:hidden bg-slate-800 rounded border-2 border-slate-800 hover:bg-slate-700 transition duration-300"
      >
        {isOpen ? null : <MenuIcon size={24} />}
      </button>

      <div className="hidden md:block h-[calc(100vh-186px)]">
        <div className="ml-4 col-span-1 row-span-11 bg-slate-800 rounded p-4 h-full">
          <SidebarContent userPlaylists={userPlaylists} />
        </div>
      </div>

      <div
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-[calc(100vh-106px)] w-64 z-40
          ml-0 bg-slate-800 rounded p-4
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
          border-slate-900 border-r-8
        `}
      >
        <SidebarContent
          userPlaylists={userPlaylists}
          onClick={handlePlaylistSelect}
        />
      </div>
    </>
  );
};

export default NavigationSidebar;

import { HeartIcon, ListIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { IPlaylist } from "../types/IPlaylist";

export const SidebarContent = ({
  onClick,
  userPlaylists,
}: {
  onClick?: () => void;
  userPlaylists: IPlaylist[];
}) => (
  <>
    <Link
      to="/likedSongs"
      className="flex items-center mb-4 mt-8 lg:mt-2"
      onClick={onClick}
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
          onClick={onClick}
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
  </>
);

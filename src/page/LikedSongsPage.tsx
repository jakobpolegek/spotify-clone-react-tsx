import { Song } from "../components/Song";
import { useSelector } from "react-redux";
import { selectIsPlaying } from "../slices/audioPlayerSlice";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "../components/ui/context-menu";
import { Spinner } from "../components/ui/spinner";
import useLikedSongs from "../hooks/useLikedSongs";
import { useUser } from "@clerk/clerk-react";
import { SongContextMenu } from "../components/SongContextMenu";
import { HeartIcon } from "lucide-react";

const LikedSongsPage = () => {
  const { likedSongs, loading, fetchLikedSongs } = useLikedSongs();
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");
  const isPlaying = useSelector(selectIsPlaying);

  return (
    <div className="mr-5 col-span-9 row-span-11 bottom-0 bg-slate-800 rounded">
      <div className="flex items-center">
        <HeartIcon className="text-white w-48 h-48 ml-10 mt-14" />
        <div className="flex flex-col">
          <p className="text-8xl font-extrabold ml-6 mt-16 text-white">Liked songs</p>
          <p className="ml-8 mt-2 text-gray-400">{user.firstName}
            {!loading && <>, {likedSongs.length} songs</>}
          </p>
        </div>
      </div>
      
      {loading ?
        <Spinner show={loading} size="large" />
        :
        <div className="flex flex-col items-left justify-left max-h-screen grow">
          <div id="songs" className="m-2 mt-10 flex flex-col ">
            {likedSongs.map((song) => (
              <ContextMenu key={`context-${song.source}`} >
                <ContextMenuTrigger>
                  <Song key={song.source} song={song} page={1} isPlaying={isPlaying} />
                </ContextMenuTrigger>
                <SongContextMenu
                  song={song}
                  userId={user.id}
                  onSongsChange={fetchLikedSongs}
                  page={1}
                />
              </ContextMenu>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default LikedSongsPage;

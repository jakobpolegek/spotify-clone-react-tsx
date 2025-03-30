import { Spinner } from "../components/ui/spinner";
import { useUser } from "@clerk/clerk-react";
import usePlaylistSongs from "../hooks/usePlaylistSongs";
import { useParams } from "react-router-dom";
import SongsSection from "../components/SongsSection";
import SongsHeader from "../components/SongsHeader";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");
  if (!playlistId) throw new Error("Playlist ID is required");
  const { playlistSongs, loading, fetchPlaylistSongs } = usePlaylistSongs(playlistId);

  return (
    loading ? <Spinner show={loading} size="large"/> :
    <div className="col-span-7 row-span-11 h-full flex flex-col overflow-hidden rounded border-0 border-slate-900">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <SongsHeader user={user} songs={playlistSongs} page={2} album={null}/>         
        <SongsSection user={user} songs={playlistSongs} page={2} playlistId={playlistId} onSongsChange={fetchPlaylistSongs}/>
      </div>
    </div>
    );
};
export default PlaylistPage;

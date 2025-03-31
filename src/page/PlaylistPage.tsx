import { Spinner } from "../components/ui/spinner";
import { useUser } from "@clerk/clerk-react";
import usePlaylistSongs from "../hooks/usePlaylistSongs";
import { useParams } from "react-router-dom";
import SongsSection from "../components/SongsSection";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");
  if (!playlistId) throw new Error("Playlist ID is required");
  const { playlistSongs, loading, fetchPlaylistSongs } = usePlaylistSongs(playlistId);

  return (
    loading ? <Spinner show={loading} size="large"/> :
    <SongsSection user={user} songs={playlistSongs} page={2} playlistId={playlistId} onSongsChange={fetchPlaylistSongs} album={null}/>
    );
};
export default PlaylistPage;

import { Spinner } from "../components/ui/spinner";
import useLikedSongs from "../hooks/useLikedSongs";
import { useUser } from "@clerk/clerk-react";
import SongsSection from "../components/SongsSection";

const LikedSongsPage = () => {
  const { likedSongs, loading, fetchLikedSongs } = useLikedSongs();
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  return (
    loading ? <Spinner show={loading} size="large"/> :
    <SongsSection user={user} songs={likedSongs} page={1} playlistId={null} onSongsChange={fetchLikedSongs} album={null}/>
  );
};

export default LikedSongsPage;

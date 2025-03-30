import { Spinner } from "../components/ui/spinner";
import useLikedSongs from "../hooks/useLikedSongs";
import { useUser } from "@clerk/clerk-react";
import SongsSection from "../components/SongsSection";
import SongsHeader from "../components/SongsHeader";

const LikedSongsPage = () => {
  const { likedSongs, loading, fetchLikedSongs } = useLikedSongs();
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  return (
    loading ? <Spinner show={loading} size="large"/> :
    <div className="col-span-7 row-span-11 h-full flex flex-col overflow-hidden rounded border-0 border-slate-900">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <SongsHeader user={user} songs={likedSongs} page={1} album={null}/>
        <SongsSection user={user} songs={likedSongs} page={1} playlistId={null} onSongsChange={fetchLikedSongs}/>
      </div>
    </div>
  );
};

export default LikedSongsPage;

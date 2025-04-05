import { useEffect, useState } from "react";
import { ISong } from "../types/ISong";
import { getLikedSongs } from "../utils/api/getLikedSongs";
import { useUser } from "@clerk/clerk-react";

const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  const fetchLikedSongs = async () => {
    setLoading(true);
    try {
      if (user.id) {
        const songs = await getLikedSongs(user.id);
        setLikedSongs(songs);
      }
    } catch (err) {
      throw new Error(`Failed to fetch liked songs: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchLikedSongs();
    }
  }, [user.id]);

  return { likedSongs, loading, fetchLikedSongs };
};

export default useLikedSongs;
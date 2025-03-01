import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getPlaylistSongs } from "../utils/api/getPlaylistSongs";
import { ISong } from "../types/ISong";

const usePlaylistSongs = (playlistName:string) => {
  const [playlistSongs, setPlaylistSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  const fetchPlaylistSongs = async () => {
    setLoading(true);
    try {
      if (user.id) {
        const songs = await getPlaylistSongs(user.id,playlistName);
        setPlaylistSongs(songs);
      }
    } catch (err) {
      throw new Error(`Failed to fetch liked songs: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchPlaylistSongs();
    }
  }, [user.id,playlistName]);

  return { playlistSongs, loading, fetchPlaylistSongs };
};

export default usePlaylistSongs;
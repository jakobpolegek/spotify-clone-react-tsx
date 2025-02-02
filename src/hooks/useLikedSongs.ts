import { useEffect, useState } from "react";
import { ISong } from "../types/ISong";
import { getLikedSongs } from "../utils/api/getLikedSongs";
import { removeLikedSong } from "../utils/api/removeLikedSong";

const useLikedSongs = (userId: string) => {
    const [likedSongs, setLikedSongs] = useState<ISong[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
  
    const fetchLikedSongs = async () => {
        setLoading(true);
        try {
          if (userId) {
            const songs = await getLikedSongs(userId);
            setLikedSongs(songs);
          }
        } catch (err) {
          throw new Error(`There was a problem fetching liked songs: ${err}`);
        } finally {
          setLoading(false);
        }
    };
      
    const removeSong = async (song: ISong) => {
        try {
          await removeLikedSong(userId, song);
          await fetchLikedSongs(); 
        } catch (err) {
            throw new Error(`TThere was a problem removing the liked song: ${err}`);
        }
      };


    useEffect(() => {
      if (userId) {
        fetchLikedSongs();
      }
    }, [userId]);
  
    return { likedSongs, loading, removeSong};
  };
  
  export default useLikedSongs;
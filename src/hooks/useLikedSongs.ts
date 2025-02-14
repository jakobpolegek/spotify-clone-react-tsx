import { useEffect, useState } from "react";
import { ISong } from "../types/ISong";
import { getLikedSongs } from "../utils/api/getLikedSongs";

const useLikedSongs = (userId: string, session:any) => {
    const [likedSongs, setLikedSongs] = useState<ISong[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
  
    const fetchLikedSongs = async () => {
        setLoading(true);
        try {
          if (userId) {
            const songs = await getLikedSongs(userId,session);
            setLikedSongs(songs);
          }
        } catch (err) {
          throw new Error(`There was a problem fetching liked songs: ${err}`);
        } finally {
          setLoading(false);
        }
    };
      
    useEffect(() => {
      if (userId) {
        fetchLikedSongs();
      }
    }, [userId]);
  
    return { likedSongs, loading, fetchLikedSongs };
  };
  
  export default useLikedSongs;
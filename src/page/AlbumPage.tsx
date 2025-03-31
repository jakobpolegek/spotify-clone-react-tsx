import { useLoaderData } from "react-router-dom";
import { IAlbum } from "../types/IAlbum";
import { useUser } from "@clerk/clerk-react";
 import { useEffect, useState } from "react";
import { Spinner } from "../components/ui/spinner";
import SongsSection from "../components/SongsSection";

const AlbumPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const album = useLoaderData() as IAlbum;
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  useEffect(() => {
    if (album) {
      setLoading(false);
    }
  }, [album]);

  return (
    loading ? <Spinner show={loading} size="large"/> :album.songs&&
      <SongsSection user={user} songs={album.songs.map(song=>{
        return{
        ...song, 
        cover: album.cover, 
        authors: album.authors, 
        albumId: album.id
      }})} page={0} playlistId={null} onSongsChange={null} album={album}/>
  );
};

export default AlbumPage;

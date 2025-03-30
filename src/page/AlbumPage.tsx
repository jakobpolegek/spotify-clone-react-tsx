import { useLoaderData } from "react-router-dom";
import { IAlbum } from "../types/IAlbum";
import { useUser } from "@clerk/clerk-react";
 import { useEffect, useState } from "react";
import { Spinner } from "../components/ui/spinner";
import SongsHeader from "../components/SongsHeader";
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
    <div className="col-span-7 row-span-11 h-full flex flex-col overflow-hidden rounded border-0 border-slate-900">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <SongsHeader user={user} songs={album.songs} page={0} album={album}/>
        <SongsSection user={user} songs={album.songs.map(song=>{
          return{
          ...song, 
          cover: album.cover, 
          authors: album.authors, 
          albumId: album.id
        }})} page={0} playlistId={null} onSongsChange={null}/>
       </div>
    </div>
  );
};

export default AlbumPage;

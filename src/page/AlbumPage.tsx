import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsPlaying,
} from "../slices/audioPlayerSlice";
import { IAlbum } from "../types/IAlbum";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "../components/ui/context-menu";
import { useUser } from "@clerk/clerk-react";
import { Song
 } from "../components/Song";
 import { useEffect, useState } from "react";
import { Spinner } from "../components/ui/spinner";
import { Authors } from "../components/Authors";
import { SongContextMenu } from "../components/SongContextMenu";

const AlbumPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const album = useLoaderData() as IAlbum;
  const isPlaying = useSelector(selectIsPlaying);
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");

  useEffect(() => {
    if (album) {
      setLoading(false);
    }
  }, [album]);

  return (
    <div className="col-span-7 row-span-11 h-[calc(100vh-200px)] overflow-y-auto">
      {loading ? (
        <Spinner show={loading} size="large"/> 
      ) : (
      <>
        <div id="album-header" className="flex bg-slate-800 text-white">
          <img src={album.cover} className="h-60 w-60 m-4 ml-12 mt-12" />
          <div id="album-metadata" className="flex flex-col mt-auto mb-10">
            Album
            <h1 className="text-8xl font-extrabold mt-2"> {album.title}</h1>
            <Authors authors={album.authors} />
          </div>
        </div>
        <div id="songs" className="flex flex-col">
          {album.songs?.map((song) => (
          <ContextMenu key={`context-${song.source}`} >
            <ContextMenuTrigger>
              <Song 
                page={0} 
                song={{
                  ...song, 
                  cover: album.cover, 
                  authors: album.authors, 
                  albumId: album.id
                }} 
                isPlaying={isPlaying}
              />
            </ContextMenuTrigger>
            <SongContextMenu
              song={{
                ...song, 
                cover: album.cover, 
                authors: album.authors, 
                albumId: album.id
              }}
              userId={user.id}
              page={0}
              album={album}
            />
          </ContextMenu>
      ))}
      </div>
      </>)}
    </div>

  );
};

export default AlbumPage;

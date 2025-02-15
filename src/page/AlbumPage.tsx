import { useLoaderData } from "react-router-dom";
import {
  HeartIcon,
  PlusCircleIcon,
  CircleArrowRightIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsPlaying,
  playNext,
  addToQueue,
} from "../slices/audioPlayerSlice";
import { IAlbum } from "../types/IAlbum";
import { ISong } from "../types/ISong";
import { AppDispatch } from "../store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../components/ui/context-menu";
import { useUser } from "@clerk/clerk-react";
import { addLikedSong } from "../utils/api/addLikedSong";
import { Song
 } from "../components/Song";
 import { useEffect, useState } from "react";
import { Spinner } from "../components/ui/spinner";
import { Authors } from "../components/Authors";

const AlbumPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const album = useLoaderData() as IAlbum;
  const dispatch = useDispatch<AppDispatch>();
  const isPlaying = useSelector(selectIsPlaying);
  const { user } = useUser();

  useEffect(() => {
    if (album) {
      setLoading(false);
    }
  }, [album]);
  
  const addSongToLikedSongs = async (newSong: ISong) => {
    try {
      if (user?.id) {
        await addLikedSong(newSong);
      }
    } catch (error) {
      throw new Error("There was a problem adding liked song. " + error);
    }
  };

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
            <ContextMenu key={song.source}>
              <ContextMenuTrigger>
                <Song key={song.source} page={0} song={{...song, cover: album.cover, authors: album.authors, albumId: album.id}} isPlaying={isPlaying}/>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-slate-800 text-white border-0">
                <ContextMenuItem
                  onClick={() => {
                    if (user) {
                      const newSong: ISong = {
                        albumId: album.id,
                        title: song.title,
                        authors: album.authors
                      };
                      addSongToLikedSongs(newSong);
                    }
                  }}
                >
                  <HeartIcon /> &nbsp; Add to liked songs
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    const modifiedSong: ISong = {
                      ...song,
                      authors: album.authors,
                      cover: album.cover,
                    };
                    dispatch(addToQueue(modifiedSong));
                  }}
                >
                  <PlusCircleIcon /> &nbsp; Add to queue
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    const modifiedSong: ISong = {
                      ...song,
                      authors: album.authors,
                      cover: album.cover,
                    };
                    dispatch(playNext(modifiedSong));
                  }}
                >
                  <CircleArrowRightIcon />
                  &nbsp; Play next
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </>)}
    </div>

  );
};

export default AlbumPage;

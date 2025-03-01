import { ISong } from "../types/ISong";
import { Song } from "../components/Song";
import { useDispatch, useSelector } from "react-redux";
import { selectIsPlaying } from "../slices/audioPlayerSlice";
import { AppDispatch } from "../store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../components/ui/context-menu";
import {
  HeartCrackIcon,
  PlusCircleIcon,
  CircleArrowRightIcon,
} from "lucide-react";
import { Spinner } from "../components/ui/spinner";
import {
  addToQueue,
  playNext,
} from "../slices/audioPlayerSlice";
import { removeLikedSong } from "../utils/api/removeLikedSong";
import { useUser } from "@clerk/clerk-react";
import usePlaylistSongs from "../hooks/usePlaylistSongs";
import { useParams } from "react-router-dom";

const PlaylistPage = () => {
  const { playlistName } = useParams();
  const { user } = useUser();
  if (!user) throw new Error("User not authenticated");
  const { playlistSongs, loading, fetchPlaylistSongs } = usePlaylistSongs(playlistName || '');
  const dispatch = useDispatch<AppDispatch>();
  const isPlaying = useSelector(selectIsPlaying);
 
  const removeSong = async (song: ISong) => {
    try {
      await removeLikedSong(user.id, song);
      await fetchPlaylistSongs();
    } catch (err) {
      throw new Error(`TThere was a problem removing the liked song: ${err}`);
    }
  };


  return (
    <div className="mr-5 col-span-9 row-span-11 bottom-0 bg-slate-800 rounded">
      <p className="text-8xl font-extrabold m-10 text-white">{playlistName}</p>
      <p className="text-2xl m-10 text-white">{user.firstName}</p>

      {loading ?
        <Spinner show={loading} size="large" />
        :
        <div className="flex flex-col items-left justify-left max-h-screen grow">
          <div id="songs" className="m-2 flex flex-col ">
            {playlistSongs.map((song) => (
              <ContextMenu key={song.source}>
                <ContextMenuTrigger>
                  <Song key={song.source} song={song} page={1} isPlaying={isPlaying} />
                </ContextMenuTrigger>
                <ContextMenuContent className="bg-slate-800 text-white border-0">
                  <ContextMenuItem
                    onClick={() => {
                      const newSong: ISong = {
                        source: song.source,
                        albumId: song.albumId,
                        title: song.title,
                        authors: song.authors || [],
                      };
                      removeSong(newSong);
                    }}
                  >
                    <HeartCrackIcon /> &nbsp; Remove liked songs
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => {
                      const modifiedSong: ISong = {
                        ...song,
                        authors: song.authors || [],
                        cover: song.cover,
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
                        authors: song.authors || [],
                        cover: song.cover,
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
        </div>
      }
    </div>
  );
}

export default PlaylistPage;

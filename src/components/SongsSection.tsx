import { Song } from "../components/Song";
import { useDispatch, useSelector } from "react-redux";
import { selectIsPlaying, clearQueue, setQueue, playNextSong } from "../slices/audioPlayerSlice";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "../components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { PlayCircleIcon, EllipsisIcon } from "lucide-react";
import { SongContextMenu } from "../components/SongContextMenu";
import { PlaylistDropDownMenu } from "../components/PlaylistDropdownMenu";
import { AppDispatch } from "../store";
import { ISong } from "../types/ISong";
import { UserResource } from "@clerk/types";

const SongsSection = ({ user, songs, page = 0, playlistId = null, onSongsChange = null }:
  {
    user: UserResource,
    songs: ISong[],
    page: number,
    playlistId: string | null,
    onSongsChange: any
  }) => {

  const dispatch: AppDispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);

  const handlePlaySongs = async () => {
    dispatch(clearQueue());
    dispatch(setQueue(songs));
    dispatch(playNextSong());
  }

  return (
    <div id="songsSection" className="flex flex-col flex-grow flex-1 mt-2 pb-8 border-2 rounded border-slate-800 bg-slate-800">
      <div id="playlistControls" className="flex flex-row ml-10">
        <PlayCircleIcon className="mt-6 text-primary h-12 w-12" onClick={handlePlaySongs} />
        {page === 2 &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisIcon
                className="mt-6 text-primary ml-4 h-12 w-12"
                size={24}
              />
            </DropdownMenuTrigger>
            <PlaylistDropDownMenu
              songs={songs}
              userId={user.id}
              page={page}
              playlistId={playlistId}
              onSongsChange={onSongsChange}
            />
          </DropdownMenu>}

      </div>
      <div className="flex flex-col items-left justify-left grow mt-2">
        <div id="songs" className="m-2 flex flex-col">
          {songs.map((song: ISong) => (
            <ContextMenu key={song.source}>
              <ContextMenuTrigger>
                <Song key={song.source} song={song} page={page} isPlaying={isPlaying} />
              </ContextMenuTrigger>
              {(page === 2 && playlistId && onSongsChange) ?
                (<SongContextMenu
                  song={song}
                  userId={user.id}
                  page={page}
                  playlistId={playlistId}
                  onSongsChange={onSongsChange}
                />) :
                (<SongContextMenu
                  song={song}
                  userId={user.id}
                  page={page}
                  onSongsChange={onSongsChange}
                />)}

            </ContextMenu>
          ))}
        </div>
      </div>
        </div>
  );
}

export default SongsSection;
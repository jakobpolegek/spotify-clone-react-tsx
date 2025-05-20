import { Song } from "../components/Song";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPlaying,
  clearQueue,
  setQueue,
  playNextSong,
} from "../slices/audioPlayerSlice";
import { ContextMenu, ContextMenuTrigger } from "../components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  PlayCircleIcon,
  EllipsisIcon,
  HeartIcon,
  MusicIcon,
} from "lucide-react";
import { SongContextMenu } from "../components/SongContextMenu";
import { PlaylistDropDownMenu } from "../components/PlaylistDropdownMenu";
import { AppDispatch } from "../store";
import { ISong } from "../types/ISong";
import { UserResource } from "@clerk/types";
import { IAlbum } from "../types/IAlbum";
import { Authors } from "./Authors";
import { useEffect, useState } from "react";
import { getPlaylistInfo } from "../utils/api/getPlaylistsInfo";

const SongsSection = ({
  user,
  songs,
  page = 0,
  playlistId = null,
  onSongsChange = null,
  album = null,
}: {
  user: UserResource;
  songs: ISong[];
  page: number;
  playlistId: string | null;
  onSongsChange: any;
  album: IAlbum | null;
}) => {
  const [coverImage, setCoverImage] = useState(null);
  const [collectionName, setCollectionName] = useState(songs[0]?.name);
  const dispatch: AppDispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);

  const fetchPlaylistInfo = async () => {
    if (playlistId) {
      const playListInfo = await getPlaylistInfo(playlistId);
      playListInfo.cover_image_url &&
        setCoverImage(playListInfo.cover_image_url);
      setCollectionName(playListInfo.name);
    }
  };

  useEffect(() => {
    if (page === 2 && playlistId) {
      fetchPlaylistInfo();
    }
  }, [playlistId]);

  const handlePlaySongs = async () => {
    dispatch(clearQueue());
    dispatch(setQueue(songs));
    dispatch(playNextSong());
  };

  return (
    <div className="col-span-7 lg:col-span-9 row-span-11 h-full flex flex-col rounded border-0 border-slate-900">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 flex justify-center md:justify-normal bg-slate-800 text-white border-2 rounded border-slate-800">
          <div
            id="songsHeader"
            className="flex flex-col md:flex-row items-center mb-2 md:mb-6"
          >
            {page === 1 ? (
              <HeartIcon className="h-24 w-24 md:h-60 md:w-60 mb-4 ml-2 md:ml-12 md:mt-12 mt-4 text-primary" />
            ) : page === 2 ? (
              coverImage ? (
                <img
                  src={coverImage}
                  className="h-24 w-24 md:h-60 md:w-60 mb-4 ml-2 md:ml-12 md:mt-12 mt-4"
                />
              ) : (
                <MusicIcon className="h-24 w-24 md:h-60 md:w-60 mb-4 ml-2 md:ml-12 md:mt-12 mt-4 text-primary" />
              )
            ) : (
              album && (
                <img
                  src={album.cover}
                  className="h-24 w-24 md:h-60 md:w-60 mb-4 ml-2 md:ml-12 md:mt-12 mt-4"
                />
              )
            )}
            <div className="flex flex-col md:ml-6 md:mt-10 items-center md:items-start">
              {page === 0 && <h4 className="">Album</h4>}
              <h1
                className={`lg:text-8xl md:text-6xl font-extrabold text-white break-words max-w-[90vw] md:max-w-[60vw]`}
              >
                {page === 1
                  ? "Liked songs"
                  : page === 2
                  ? collectionName
                  : album?.title}
              </h1>
              <h3 className="mt-1 md:mt-4 text-gray-400 flex flex-row">
                {page === 0 && album ? (
                  <Authors authors={album.authors} isHeader={true} />
                ) : (
                  <>{user.firstName},</>
                )}
                &ensp;{songs.length} songs
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0 mt-2 border-2 rounded border-slate-800 bg-slate-800">
          <div
            id="playlistControls"
            className="flex-shrink-0 flex flex-row justify-center md:justify-normal md:ml-10"
          >
            <PlayCircleIcon
              className="mt-6 text-primary h-12 w-12"
              onClick={handlePlaySongs}
            />
            {page === 2 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisIcon
                    className="mt-6 text-primary ml-4 h-12 w-12"
                    size={24}
                  />
                </DropdownMenuTrigger>
                <PlaylistDropDownMenu
                  playlistName={songs[0]?.name}
                  playlistCover={coverImage || null}
                  songs={songs}
                  userId={user.id}
                  page={page}
                  playlistId={playlistId}
                  onSongsChange={onSongsChange}
                />
              </DropdownMenu>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <div id="songs" className="m-2 flex flex-col pt-4 pb-12">
              {songs.map((song: ISong) => (
                <ContextMenu key={song.source}>
                  <ContextMenuTrigger>
                    <Song
                      key={song.source}
                      song={song}
                      page={page}
                      isPlaying={isPlaying}
                    />
                  </ContextMenuTrigger>
                  <SongContextMenu
                    song={song}
                    userId={user.id}
                    page={page}
                    playlistId={playlistId || undefined}
                    onSongsChange={onSongsChange}
                  />
                </ContextMenu>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongsSection;

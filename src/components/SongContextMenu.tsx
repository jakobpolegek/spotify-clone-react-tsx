import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
} from '../components/ui/context-menu';
import {
    HeartIcon,
    PlusCircleIcon,
    MinusCircleIcon,
    CircleArrowRightIcon,
    ListPlusIcon,
    PlusIcon,
    HeartCrackIcon,
  } from "lucide-react";
import CreatePlaylistForm from './forms/CreatePlaylistForm';
import { addToQueue, playNext, selectPlaylists, setPlaylists } from '../slices/audioPlayerSlice';
import { SongContextMenuProps } from '../types/SongContextMenuProps';
import { ISong } from '../types/ISong';
import { addToPlaylist } from '../utils/api/addToPlaylist';
import { addLikedSong } from '../utils/api/addLikedSong';
import { removeLikedSong } from '../utils/api/removeLikedSong';
import { removeSongFromPlaylist } from '../utils/api/removeSongFromPlaylist';
import { getPlaylists } from '../utils/api/getPlaylists';
import { useToast } from "../hooks/useToast"

export const SongContextMenu = ({
  page,
  song,
  userId,
  playlistId,
  onSongsChange
}: SongContextMenuProps) => {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<ISong | null>(null);
  const userPlaylists =  useSelector(selectPlaylists);
  const { toast } = useToast()

  const fetchPlaylists = async () => {
    try {
      const playlists = await getPlaylists(userId);
      dispatch(setPlaylists(playlists));
    } catch (error) {
      throw new Error("Error while fetching playlists: "+error)
    }
  };

  const handleDialogOpenChange = async (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedSong(null);
    }

    await fetchPlaylists();
  };

  const handleRemoveFromPlaylist = async () => {
    if(playlistId){
      await removeSongFromPlaylist(playlistId, song, userId);
      setIsDialogOpen(false);
      setSelectedSong(null);
  
      if (onSongsChange) {
        await onSongsChange();
      }
    }

  }
 
  const handleAddToPlaylist = async (song:ISong,userId:string,playlistId?:string,playlistName?: string) => {
    await addToPlaylist({ 
      song: song,
      userId: userId,
      playlistId: playlistId,
      playlistName: playlistName
    });
    setIsDialogOpen(false)
    setSelectedSong(null)

    await fetchPlaylists();
  }

  const removeSong = async (song: ISong) => {
    try {
      await removeLikedSong(userId, song);
      setIsDialogOpen(false);
      setSelectedSong(null);

      if (onSongsChange) {
        await onSongsChange();
      }
    } catch (err) {
      throw new Error(`There was a problem removing the liked song: ${err}`);
    }
  };

  const addSongToLikedSongs = async (newSong: ISong) => {
      try {
        if (userId) {
          await addLikedSong(newSong);
        }
      } catch (error) {
        throw new Error("There was a problem adding liked song. " + error);
      }
    };

  return (
    <>
      <ContextMenuContent className="bg-slate-900 text-white border-0">
        {page === 1 ? 
          <ContextMenuItem
            onSelect={() => {
              const newSong: ISong = {
                source: song.source,
                albumId: song.albumId,
                title: song.title,
                authors: song.authors || [],
              };
              removeSong(newSong).then(() => {
                toast({
                  title: "Song successfully removed from liked songs.",
                  duration: 3000
                })
              });
            }}
          >
            <HeartCrackIcon /> &nbsp; Remove liked songs
          </ContextMenuItem>
          :
          <ContextMenuItem
            onClick={() => userId && addSongToLikedSongs(song).then(() => {
              toast({
                title: "Song successfully added to liked songs.",
                duration: 3000
              })
            }
            )}
          >
            <HeartIcon className="mr-2" /> Add to liked songs
          </ContextMenuItem>                    
          }
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ListPlusIcon className="mr-2" /> Add to playlist
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-slate-900 text-white border-0 w-48">
            <ContextMenuItem
              onSelect={() => {
                setSelectedSong(song);
                setIsDialogOpen(true);
                document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              }}
            >
              <PlusIcon className="mr-2" /> Create new playlist...
            </ContextMenuItem>
            <ContextMenuSeparator />
            {userPlaylists.map((playlist) => {
              return (
                <div id="playlistHandlers" key={playlist.id}>
                    <ContextMenuItem
                      onSelect={() => handleAddToPlaylist(
                        song=song,
                        userId=userId,
                        playlistId=playlist.id).then(() => {
                          toast({
                            title: "Song successfully added to playlist.",
                            duration: 3000
                          })
                        }
                      )}
                    >
                      <PlusCircleIcon className="mr-2" /> {playlist.name}
                    </ContextMenuItem>
                </div>
              );
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>
        {page === 2  && playlistId && 
          <ContextMenuItem
            onSelect={() => handleRemoveFromPlaylist().then(() => {
              toast({
                title: "Song successfully removed from playlist.",
                duration: 3000
              })
            }
            )}
          >
            <MinusCircleIcon className="mr-2" /> Remove from this playlist
          </ContextMenuItem>
        }
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            dispatch(addToQueue(song))
            toast({
              title: "Song successfully added to queue.",
              duration: 3000
            })}
          }
        >
          <PlusIcon className="mr-2" /> Add to queue
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {dispatch(playNext(song));toast({
            title: "Song will play next.",
            duration: 3000
          })}} 
        >
          <CircleArrowRightIcon className="mr-2" /> Play next
        </ContextMenuItem>
      </ContextMenuContent>
      <CreatePlaylistForm
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        userId={userId}
        selectedSong={selectedSong}
        onCreatePlaylist={handleAddToPlaylist}
      />
    </>
  );
};
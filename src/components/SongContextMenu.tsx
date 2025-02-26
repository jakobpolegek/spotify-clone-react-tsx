import { useState } from 'react';
import { useDispatch } from 'react-redux';
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
    CircleArrowRightIcon,
    ListPlusIcon,
    PlusIcon,
  } from "lucide-react";
import FormDialog from './FormDialog';
import CreatePlaylistForm from './forms/CreatePlaylistForm';
import { addToQueue, playNext, setPlaylists } from '../slices/audioPlayerSlice';
import { SongContextMenuProps } from '../types/SongContextMenuProps';
import { ISong } from '../types/ISong';
import { addToPlaylist } from '../utils/api/addToPlaylist';
import { addLikedSong } from '../utils/api/addLikedSong';
import { getUserPlaylists } from '../utils/api/getUserPlaylist';

export const SongContextMenu = ({
  song,
  userId,
  userPlaylists,
}: SongContextMenuProps) => {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<ISong | null>(null);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedSong(null);
    }
  };

  const handleAddToPlaylist = async (name: string, song: ISong, userId:string) => {
    await addToPlaylist({ 
        playlistName: name, 
        song, 
        userId: userId as string 
      });
      setIsDialogOpen(false)
      setSelectedSong(null)

    await getUserPlaylists(userId).then((res) => {dispatch(setPlaylists(res.data))});
  }

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
      <ContextMenuContent className="bg-slate-800 text-white border-0">
        <ContextMenuItem
          onClick={() => userId && addSongToLikedSongs(song)}
        >
          <HeartIcon className="mr-2" /> Add to liked songs
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ListPlusIcon className="mr-2" /> Add to playlist
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-slate-800 text-white border-0 w-48">
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
            {[...new Set(userPlaylists.map(p => p.name))].map((playlistName) => {
              const playlist = userPlaylists.find(p => p.name === playlistName);
              return (
                <ContextMenuItem
                  key={playlist?.id}
                  onSelect={() => handleAddToPlaylist(
                    playlistName,
                    song,
                    userId,
                  )}
                >
                  <PlusCircleIcon className="mr-2" /> {playlistName}
                </ContextMenuItem>
              );
            })}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => dispatch(addToQueue(song))}
        >
          <PlusIcon className="mr-2" /> Add to queue
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => dispatch(playNext(song))}
        >
          <CircleArrowRightIcon className="mr-2" /> Play next
        </ContextMenuItem>
      </ContextMenuContent>

      <FormDialog
        title="Create new playlist"
        description="Enter the name of the playlist you want to create"
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      >
        <CreatePlaylistForm
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          userId={userId}
          selectedSong={selectedSong}
          onCreatePlaylist={handleAddToPlaylist}
        />
      </FormDialog>
    </>
  );
};
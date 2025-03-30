import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
  } from "../components/ui/dropdown-menu"
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import {
    Trash2Icon,
    PencilIcon,
    ListEndIcon
  } from "lucide-react";
import FormDialog from './FormDialog';
import CreatePlaylistForm from './forms/CreatePlaylistForm';
import { setPlaylists, addToQueue } from '../slices/audioPlayerSlice';
import { ISong } from '../types/ISong';
import { getPlaylists } from '../utils/api/getPlaylists';
import { removePlaylist } from '../utils/api/removePlaylist';
import { useNavigate } from 'react-router';

export const PlaylistDropDownMenu = ({
  songs,
  userId,
  playlistId,
  page,
  onSongsChange,
}: {songs:ISong[], userId: string, playlistId: string|null, page:number, onSongsChange:any}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<ISong | null>(null);

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

  const handleRemovePlaylist = async () => {
    if(playlistId){
        await removePlaylist(playlistId, userId);
        setIsDialogOpen(false);
        setSelectedSong(null);
        fetchPlaylists();
        navigate("/");
    }
  }

  const handleAddToQueue = async () => {
    if(playlistId){
      songs.map((song)=>{
        dispatch(addToQueue(song))
      })   
    }
  }

  return (
    <>
        <DropdownMenuContent className="bg-slate-900 text-white border-0">
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleAddToQueue}>
                    <ListEndIcon /> Add to queue
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem  
                onSelect={() => {
                    //setSelectedSong(song);
                    setIsDialogOpen(true);
                }}>
                <PencilIcon/> Edit playlist
            </DropdownMenuItem>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                        className="bg-red-500 focus:bg-red-500 focus:text-white"
                        onSelect={(e) => {
                            e.preventDefault()
                        }}
                    >
                        <Trash2Icon/> Delete playlist
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-slate-900 text-white'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            playlist and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-slate-600 text-white'>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async()=>{
                            await handleRemovePlaylist()
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DropdownMenuContent>

        <FormDialog
            title="Edit playlist"
            description="Change the name or picture of the playlist."
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
        >
        <CreatePlaylistForm
            open={isDialogOpen}
            onOpenChange={handleDialogOpenChange}
            userId={userId}
            selectedSong={selectedSong}
            onCreatePlaylist={handleRemovePlaylist}
        />
        </FormDialog> 
    </>
  );
};
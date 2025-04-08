import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator
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
import EditPlaylistForm from './forms/EditPlaylistForm';
import { setPlaylists, addToQueue } from '../slices/audioPlayerSlice';
import { ISong } from '../types/ISong';
import { getPlaylists } from '../utils/api/getPlaylists';
import { removePlaylist } from '../utils/api/removePlaylist';
import { useNavigate } from 'react-router';
import { useToast } from '../hooks/useToast';

export const PlaylistDropDownMenu = ({
  songs,
  userId,
  playlistId,
  playlistName,
  onSongsChange
}: {songs:ISong[], userId: string, playlistId: string|null, playlistName: string|undefined,playlistCover: string|null, page:number, onSongsChange:any}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    await fetchPlaylists();
  };

  const handleRemovePlaylist = async () => {
    if(playlistId){
        await removePlaylist(playlistId, userId);
        setIsDialogOpen(false);
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
                <DropdownMenuItem onClick={()=>{handleAddToQueue; toast({
                    title: "Song successfully added to queue.",
                    duration: 3000
                })}}>
                    <ListEndIcon /> Add to queue
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem  
                onSelect={() => {
                    setIsDialogOpen(true);
                    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
                }}>
                <PencilIcon/> Edit playlist..
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
                            await handleRemovePlaylist().then(()=>{
                                toast({
                                    title: "Playlist deleted successfully.",
                                    duration: 3000
                                })
                            }
                            )
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DropdownMenuContent>


        <EditPlaylistForm
            id={playlistId ? playlistId:''}
            name={playlistName}
            open={isDialogOpen}
            onOpenChange={handleDialogOpenChange}
            userId={userId}
            onSavePlaylistChanges={onSongsChange}
        />

    </>
  );
};
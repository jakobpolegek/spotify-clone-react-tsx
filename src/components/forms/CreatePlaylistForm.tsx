import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ICreatePlaylistDialogProps } from '../../types/ICreatePlaylistDialogProps';
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
const CreatePlaylistDialog = ({
  open,
  onOpenChange,
  selectedSong,
  userId,
  onCreatePlaylist,
}: ICreatePlaylistDialogProps) => {
  const [playlistName, setPlaylistName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setPlaylistName('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSong && playlistName.trim()) {
      onCreatePlaylist(selectedSong, userId, undefined, playlistName.trim());
      toast({
        title: `Playlist ${playlistName} created successfully.`,
        duration: 3000,
      });
    }

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] bg-slate-900 text-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new playlist</DialogTitle>
            <DialogDescription>
              Enter a name for your new playlist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Playlist"
                className="col-span-3 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create playlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;

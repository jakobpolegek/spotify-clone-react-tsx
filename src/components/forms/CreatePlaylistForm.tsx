import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "../ui/dialog"
  import { Button } from "../ui/button"
  import { Input } from "../ui/input"
  import { Label } from "../ui/label"
  import { ISong } from "../../types/ISong"
import { useEffect, useState } from "react"
  
  interface CreatePlaylistDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedSong: ISong | null
    userId: string
    onCreatePlaylist: (name: string, song: ISong, userId: string) => void
  }
  
  const CreatePlaylistDialog = ({
    open,
    onOpenChange,
    selectedSong,
    userId,
    onCreatePlaylist,
  }: CreatePlaylistDialogProps) => {
    const [playlistName, setPlaylistName] = useState("")
  
    useEffect(() => {
      if (!open) {
        setPlaylistName("")
      }
    }, [open])
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (selectedSong && playlistName.trim()) {
        onCreatePlaylist(playlistName, selectedSong, userId)
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent 
          className="sm:max-w-[425px] bg-slate-800 text-white"
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
              <Button type="submit">
                Create playlist
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default CreatePlaylistDialog
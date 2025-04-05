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
import { IEditPlaylistDialogProps } from "../../types/IEditPlaylistDialogProps"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { UploadCloudIcon } from "lucide-react"
import { uploadAlbumCover } from "../../utils/api/uploadAlbumCover"
import { updatePlaylistInfo } from "../../utils/api/updatePlaylistInfo"

const EditPlaylistDialog = ({
  id,
  name,
  open,
  onOpenChange,
  userId,
  onSavePlaylistChanges,
}: IEditPlaylistDialogProps) => {
  const [playlistName, setPlaylistName] = useState(name);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!open) {
      setPlaylistName(name || "");
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [open, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (id && playlistName && playlistName.trim()) {
        setUploading(true);
        const publicUrl = selectedFile ? await uploadAlbumCover(userId, selectedFile, id) : null;
        await updatePlaylistInfo(id,{ name: playlistName, cover_image_url: publicUrl });
      }

      if (onOpenChange) {
        onOpenChange(false);
      }

      if (onSavePlaylistChanges) {
        await onSavePlaylistChanges();
      }
    } catch (error) {
      throw new Error("Error saving playlist changes:"+ error);
    } finally {
      setUploading(false);
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
            <DialogTitle>Edit playlist</DialogTitle>
            <DialogDescription>
              Update the name of playlist or change the cover image.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="relative group">
              <button 
                onClick={handleButtonClick}
                disabled={uploading}
                className="p-2 rounded-full transition-colors focus-visible:outline-none"
                type="button"
                aria-label="Upload album cover"
              >
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Album cover preview" 
                      className="h-40 w-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <UploadCloudIcon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="h-40 w-40 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                    <UploadCloudIcon className="h-10 w-10 text-primary" />
                  </div>
                )}
              </button>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <p className="text-white">Uploading...</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="text-white"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={uploading}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlaylistDialog
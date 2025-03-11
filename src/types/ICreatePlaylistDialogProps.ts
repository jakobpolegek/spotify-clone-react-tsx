import { ISong } from './ISong'

export interface ICreatePlaylistDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedSong: ISong | null
    userId: string
    onCreatePlaylist: (song:ISong,userId:string,playlistId?:string,playlistName?: string) => void
}

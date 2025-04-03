import { ISong } from './ISong'

export interface IEditPlaylistDialogProps {
    id:string|undefined
    name:string|undefined
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedSong: ISong | null
    userId: string
    onCreatePlaylist: (song:ISong,userId:string,playlistId?:string,playlistName?: string) => void
}

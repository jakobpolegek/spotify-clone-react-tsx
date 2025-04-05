export interface IEditPlaylistDialogProps {
    id:string|undefined
    name:string|undefined
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
    onSavePlaylistChanges: () => void
}

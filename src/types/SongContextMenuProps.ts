import { IAlbum } from "./IAlbum";
import { ISong } from "./ISong";

export type SongContextMenuProps = {
    page: number;
    song: ISong;
    album?: IAlbum;
    userId: string;
    onSongsChange?: () => void | Promise<void>; 
};
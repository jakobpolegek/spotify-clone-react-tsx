import { IAlbum } from "./IAlbum";
import { IPlaylistEntry } from "./IPlaylistEntry";
import { ISong } from "./ISong";

export type SongContextMenuProps = {
    song: ISong;
    album: IAlbum;
    userId: string;
    userPlaylists: IPlaylistEntry[];
};
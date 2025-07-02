import { IAlbum } from './IAlbum';
import { ISong } from './ISong';

export type SongContextMenuProps = {
  page: number;
  song: ISong;
  album?: IAlbum;
  userId: string;
  playlistId?: string;
  onSongsChange?: () => Promise<void> | null;
};

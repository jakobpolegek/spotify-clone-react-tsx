import { IAuthor } from './IAuthor';
import { IAlbum } from './IAlbum';

export interface ILikedSong {
  title: string;
  albumId: number;
  albums: Pick<IAlbum, 'cover' | 'bucketFolderName'>;
  authors: IAuthor;
}

import { IAuthor } from './IAuthor';
import { ISong } from './ISong';

export interface IAlbumLoaderData {
  id: string;
  cover: string | null;
  createdAt: string;
  title: string;
  bucketFolderName: string;
  authors: IAuthor[];
  songs: ISong[];
}

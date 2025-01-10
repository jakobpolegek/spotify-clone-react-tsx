import { IAuthor } from "./IAuthor";
import { ISong } from "./ISong";

export interface IAlbum {
  id: number;
  authors: IAuthor[];
  bucketFolderName: string;
  cover: string;
  createdAt: string;
  title: string;
  songs?: ISong[];
}

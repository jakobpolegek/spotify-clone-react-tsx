import { IAuthor } from "./IAuthor";
import { ISong } from "./ISong";

export interface IAlbum {
  id: number;
  authors: IAuthor;
  bucketFolderName: string;
  cover: string;
  created_at: string;
  title: string;
  songs?: ISong[];
}

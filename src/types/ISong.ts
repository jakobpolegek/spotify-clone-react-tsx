import { IAuthor } from "./IAuthor";

export interface ISong {
  authors: IAuthor[]; 
  albumId: number;
  title: string;
  cover?: string; 
  source?: string; 
  bucketFolderName?: string; 
}

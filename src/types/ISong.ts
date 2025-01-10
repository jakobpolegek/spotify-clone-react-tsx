import { IAuthor } from "./IAuthor";

export interface ISong {
  authors?: IAuthor[];
  cover?: string;
  title: string;
  source: string;
}

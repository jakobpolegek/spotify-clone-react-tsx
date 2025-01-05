import { IAuthor } from "./IAuthor";

export interface ISong {
  author?: IAuthor;
  cover?: string;
  title: string;
  source: string;
}

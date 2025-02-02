import { IAuthor } from "../types/IAuthor";
import { IAlbum } from "../types/IAlbum";

export const Album = ({ album }: { album: IAlbum }) => {
  const artistNames = album.authors
    .map((author: IAuthor) => author.name)
    .reduce((acc: string, name: string, index: number, array: string[]) => {
      if (index === 0) return name;
      if (index === array.length - 1) return `${acc}, ${name}`;
      return `${acc}, ${name}`;
    }, "");

  return (
    <div id="album" className="text-white w-48 h-48">
      <img src={album.cover} className="w-max h-max mb-1" alt={album.title} />
      <h1 className="text-2xl font-bold">{album.title}</h1>
      <h3>{artistNames}</h3>
    </div>
  );
};

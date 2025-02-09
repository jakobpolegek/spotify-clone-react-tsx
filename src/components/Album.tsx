import { Link } from "react-router-dom";
import { IAlbum } from "../types/IAlbum";
import { Authors } from "./Authors";

export const Album = ({ album }: { album: IAlbum }) => {
  return (
    <div id="album" className="text-white w-48 h-48">
      <Link key={album.id} to={`/artist/${album.authors[0]?.id}/albums/${album.id}`}>
        <img src={album.cover} className="w-max h-max mb-1" alt={album.title} />
        <h1 className="text-2xl font-bold">{album.title}</h1>
      </Link>
      <Authors authors={album.authors} />
    </div>
  );
};

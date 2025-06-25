import { Link } from "react-router-dom";
import { IAlbum } from "../types/IAlbum";
import { Authors } from "./Authors";

export const Album = ({ album }: { album: IAlbum }) => {
  return (
    <div id="album" className="text-white w-24 lg:w-48 flex flex-col">
      <Link key={album.id} to={`/artist/${album.authors[0]?.id}/albums/${album.id}`}>
        <img 
          src={album.cover} 
          className="rounded-sm w-full aspect-square object-cover mb-2"
          alt={album.title} 
        />
        <h1 className="text-sm lg:text-lg font-bold truncate">{album.title}</h1>
      </Link>
      <div className="mt-1">
        <Authors authors={album.authors} isHeader={false}/>
      </div>
    </div>
  );
};
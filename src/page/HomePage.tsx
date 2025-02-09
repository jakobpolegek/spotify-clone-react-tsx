import { Album } from "../components/Album";
import { IAlbum } from "../types/IAlbum";
import { processAlbums } from "../utils/albumUtils";
import { useLoaderData } from "react-router-dom";

const HomePage = () => {
  const albums = useLoaderData() as IAlbum[];
  const mergedAlbums: IAlbum[] = processAlbums(albums);

  return (
    <div className="mr-5 col-span-9 row-span-11 bottom-0 bg-slate-800 rounded">
      <div className="flex items-center justify-center max-h-screen grow">
        <div id="albums" className="m-2 flex flex-wrap space-x-12">
          {mergedAlbums.map((album) => (
            <Album key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import { Album } from "../components/Album";
import { IAlbum } from "../types/IAlbum";
import { processAlbums } from "../utils/albumUtils";
import { useLoaderData } from "react-router-dom";

const HomePage = () => {
  const albums = useLoaderData() as IAlbum[];
  const mergedAlbums: IAlbum[] = processAlbums(albums);

  return (
    <div className="col-span-7 lg:col-span-9 row-span-11 h-full flex flex-col ml-4 mr-1 md:mr-4 mt-2 lg:mt-0 lg:ml-0 overflow-hidden rounded border-0 bg-slate-800">
      <div id="albums" className="m-8 md:m-6 flex flex-wrap gap-8 lg:gap-12">
        {mergedAlbums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

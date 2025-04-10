import { Album } from "../components/Album";
import { IAlbum } from "../types/IAlbum";
import { processAlbums } from "../utils/albumUtils";
import { useLoaderData } from "react-router-dom";

const HomePage = () => {
  const albums = useLoaderData() as IAlbum[];
  const mergedAlbums: IAlbum[] = processAlbums(albums);

  return (
    <div className="col-span-10 lg:col-span-9 lg:row-span-11 bg-slate-800 rounded ml-4 mr-4 mt-2 lg:mt-0 lg:ml-0">
      <div id="albums" className="m-6 flex flex-wrap gap-8 lg:gap-12">
        {mergedAlbums.map((album) => (
          <Album key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

import { Album } from "../components/Album";
import { Link } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { IAlbum } from "../types/IAlbum";

const HomePage = () => {
  const albums = useLoaderData() as IAlbum[];

  return (
    <div className="mr-5 col-span-9 row-span-11 bottom-0 bg-slate-800  rounded">
      <div className="flex items-center justify-center max-h-screen grow">
        <div id="albums" className="m-2 flex flex-wrap space-x-12">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/artist/${album.authors.id}/albums/${album.id}`}
            >
              <Album key={album.id} album={album} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

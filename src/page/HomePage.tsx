import { useEffect, useState } from "react";
import { Album } from "../components/Album";
import { Link } from "react-router-dom";
import { getAlbums } from "../utils/api/getAlbums";
import { IAlbum } from "../types/IAlbum";
import { processAlbums } from "../utils/albumUtils";
import { useAuth } from "@clerk/clerk-react";

const HomePage = () => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!isSignedIn) {
        setLoading(false);
        throw new Error("You need to be signed in to view the albums.");
      }

      try {
        const fetchedAlbums = await getAlbums();
        const processedAlbums = processAlbums(fetchedAlbums);
        setAlbums(processedAlbums);
      } catch (error) {
        throw new Error("Error fetching albums: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mr-5 col-span-9 row-span-11 bottom-0 bg-slate-800 rounded">
      <div className="flex items-center justify-center max-h-screen grow">
        <div id="albums" className="m-2 flex flex-wrap space-x-12">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/artist/${album.authors[0]?.id}/albums/${album.id}`}
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

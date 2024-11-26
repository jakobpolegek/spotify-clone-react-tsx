import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Album } from "../components/Album";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const getAlbums = async () => {
      const { data: albums } = await supabase.from("albums").select(`
        *,
        authors:author_id (
          id,
          name
        )
      `);

      if (albums.length > 0) {
        setAlbums(albums);
      }
    };

    getAlbums();
  }, []);

  return (
    <div className="mr-5 col-span-9 row-span-11 bottom-0 bg-slate-800  rounded">
      <div className="flex items-center justify-center max-h-screen grow">
        <div id="albums" className="m-2">
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

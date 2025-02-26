import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAuthor } from "../types/IAuthor";
import { Spinner } from "../components/ui/spinner";
import { IAlbum } from "../types/IAlbum";
import { getAlbumsFromAuthor } from "../utils/api/getAlbumsFromAuthor";


const PlaylistPage = () => {
  /*const [albums, setAlbums] = useState<IAlbum[]>();
  const [authorLoading, setAuthorLoading] = useState<boolean>(true);
  const [albumsLoading, setAlbumsLoading] = useState<boolean>(true);
  const author = useLoaderData() as IAuthor;

  const fetchAlbumsFromAuthor = async () => {
    try {
      const fetchedAlbums = await getAlbumsFromAuthor(author.id);
      setAlbums(fetchedAlbums);
    } catch (error) {
      throw new Error("There was a problem fetching albums. " + error);
    }
  };

  useEffect(() => {
    if (author) {
      setAuthorLoading(false);
      fetchAlbumsFromAuthor().then(() => {
        setAlbumsLoading(false);
      });
    }
  }, [author]);

  return (
    <div className="col-span-7 row-span-11 h-[calc(100vh-200px)] overflow-y-auto">
      {authorLoading ? (
        <Spinner show={authorLoading} size="large"/> 
      ) : (
        <>
        <div id="author-header" className="flex bg-slate-800">
          <img src={author.image} className="h-60 w-60 m-4 ml-12 mt-12" />
          <div id="author-metadata" className="flex flex-col mt-auto mb-10">
            <h1 className="text-8xl font-extrabold mt-2 text-white"> {author.name}</h1>
          </div>
        </div>
        {albumsLoading ? (
        <Spinner show={albumsLoading} size="large"/> 
      ) : (
        <>
          <h3 className="text-4xl font-extrabold mt-10 ml-8 text-white">Discography</h3>
          <div id="albums" className="flex">
            {albums?.map((album) => (
              <div key={album.id} id="album" className="w-auto">
                <Link to={`/artist/${author.id}/albums/${album.id}`}>
                  <img src={album.cover} className="h-60 w-60 m-4 ml-12 mt-6" />
                  <h1 className="text-2xl font-bold ml-12 text-white">{album.title}</h1>
                  <h3 className="text-gray-400 ml-12">{`${new Date(album.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}</h3>
                </Link>
              </div>
            ))}
          </div>
          <h3 className="text-4xl font-extrabold mt-14 ml-8 text-white">About</h3>
          <p className="text-white ml-12 mt-4 w-2/4">
            {author.description}
          </p>
        </>
      )}
        </>
      )}
    </div>);*/
}

export default PlaylistPage;

import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { IAuthor } from "../types/IAuthor";
import { Spinner } from "../components/ui/spinner";
import { IAlbum } from "../types/IAlbum";
import { getAlbumsFromAuthor } from "../utils/api/getAlbumsFromAuthor";

const AuthorPage = () => {
  const [albums, setAlbums] = useState<IAlbum[]>();
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
    <div className="col-span-7 lg:col-span-9 row-span-11 flex flex-col rounded border-0 border-slate-900 h-full">
      {authorLoading ? (
        <Spinner show={authorLoading} size="large" />
      ) : (
        <>
          <div className="flex-col md:flex-row items-center flex-shrink-0 flex justify-center md:justify-normal bg-slate-800 text-white border-2 rounded border-slate-800">
            <img
              src={author.image}
              className="rounded-sm h-32 w-32 md:h-60 md:w-60 mb-2 md:mb-4 ml-2 md:ml-12 md:mt-12 mt-4"
              alt="author"
            />
            <div className="flex flex-col md:ml-6 md:mt-10 items-center md:items-start">
              <h1
                className={`lg:text-8xl mb-2 md:text-6xl font-extrabold text-white break-words max-w-[90vw] md:max-w-[60vw]`}
              >
                {author.name}
              </h1>
            </div>
          </div>
          {albumsLoading ? (
            <Spinner show={albumsLoading} size="large" />
          ) : (
            <div className="flex flex-col flex-1 min-h-0 mt-2 border-2 rounded overflow-auto border-slate-800 bg-slate-800">
              <h3 className="flex md:inline text-2xl md:text-4xl font-extrabold mt-10 md:ml-8 justify-center text-white ">
                Discography
              </h3>
              <div
                id="albums"
                className="inline-flex flex-wrap justify-center md:justify-normal"
              >
                {albums?.map((album) => (
                  <div
                    key={album.id}
                    id="album"
                    className="text-center md:text-left md:ml-12"
                  >
                    <Link to={`/artist/${author.id}/albums/${album.id}`}>
                      <img
                        src={album.cover}
                        className="rounded-sm h-48 w-48 md:h-60 md:w-60 m-4 mt-6"
                        alt="cover"
                      />
                      <h1 className="text-xl md:text-2xl font-bold text-white">
                        {album.title}
                      </h1>
                      <h3 className="text-gray-400">{`${new Date(
                        album.createdAt
                      ).toLocaleString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}`}</h3>
                    </Link>
                  </div>
                ))}
              </div>
              <h3 className="flex md:inline justify-center text-2xl md:text-4xl font-extrabold mt-14 md:ml-8 text-white">
                About
              </h3>
              <p className="text-white ml-12 mt-4  w-3/4 md:w-2/4 text-center md:text-left mb-2 md:mb-0">
                {author.description}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorPage;

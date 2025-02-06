import { useLoaderData } from "react-router-dom";
import { IAuthor } from "../types/IAuthor";

const ArtistPage = () => {
  const artist = useLoaderData() as IAuthor;
  console.log(artist);
  return <div>{artist.name}</div>;
};

export default ArtistPage;

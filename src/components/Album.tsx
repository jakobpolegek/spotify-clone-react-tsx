export const Album = ({ album }: { album: any }) => {
  return (
    <div id="album" className="text-white w-48 h-48">
      <img src={album.cover} className="w-max h-max mb-1" />
      <h1 className="text-2xl font-bold">{album.title}</h1>
      <h3>{album.authors.name}</h3>
    </div>
  );
};

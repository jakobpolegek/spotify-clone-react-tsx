import { IAlbum } from '../types/IAlbum';
import { IGroupedAlbums } from '../types/IGroupedAlbums';

export const processAlbums = (rawAlbums: IAlbum[]): IAlbum[] => {
  const groupedAlbums = rawAlbums.reduce<IGroupedAlbums>((acc, album) => {
    const key = album.bucketFolderName;

    if (!acc[key]) {
      acc[key] = {
        ...album,
        authors: Array.isArray(album.authors) ? album.authors : [album.authors],
      };
    } else {
      acc[key].authors.push(
        ...(Array.isArray(album.authors) ? album.authors : [album.authors])
      );
    }

    return acc;
  }, {});
  return Object.values(groupedAlbums);
};

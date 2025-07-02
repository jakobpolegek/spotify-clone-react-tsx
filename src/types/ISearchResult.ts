export interface ISearchResult {
  id: number;
  title: string;
  type:
    | 'album'
    | 'author'
    | 'song'
    | 'liked_song'
    | 'storage_song'
    | 'playlist_song'
    | 'playlist';
  image?: string;
  description?: string;
  createdAt: string;
  author_id?: number;
  routeToUrl?: number;
  user_id?: string;
  folder?: string;
}

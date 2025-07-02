import { getSupabaseClient } from '../supabase';
import { ISong } from '../../types/ISong';

export const addToPlaylist = async ({
  playlistId,
  playlistName,
  song,
  userId,
}: {
  playlistId?: string;
  playlistName?: string;
  song: ISong;
  userId: string;
}) => {
  try {
    const supabase = getSupabaseClient();

    if (!song.authors || song.authors.length === 0) {
      throw new Error('Authors array is empty.');
    }

    if (!playlistId && !playlistName) {
      throw new Error('playlistName is required when creating a new playlist.');
    }

    if (!playlistId) {
      const { data: existingPlaylist, error: fetchError } = await supabase
        .from('playlists')
        .select('id')
        .eq('user_id', userId)
        .eq('name', playlistName)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingPlaylist) {
        playlistId = existingPlaylist.id;
      } else {
        const { data: newPlaylist, error: insertError } = await supabase
          .from('playlists')
          .insert({ user_id: userId, name: playlistName })
          .select('id')
          .single();

        if (insertError) throw insertError;
        playlistId = newPlaylist!.id;
      }
    }

    const existingRecordsPromises = song.authors.map((author) => {
      return supabase
        .from('playlistSongs')
        .select('*')
        .eq('playlistId', playlistId)
        .eq('albumId', song.albumId)
        .eq('title', song.title)
        .eq('authorId', author.id);
    });

    const existingRecordsResults = await Promise.all(existingRecordsPromises);

    const newAuthors = song.authors.filter((_, index) => {
      const { data } = existingRecordsResults[index];
      return !data || data.length === 0;
    });

    if (newAuthors.length === 0) {
      return {
        success: true,
        message: 'All authors already exist for this song in the playlist',
        addedAuthors: 0,
        skippedAuthors: song.authors.length,
      };
    }

    const insertData = newAuthors.map((author) => ({
      playlistId: playlistId,
      albumId: song.albumId,
      title: song.title,
      authorId: author.id,
      user_id: userId,
    }));

    const results = await Promise.all(
      insertData.map((entry) => supabase.from('playlistSongs').insert(entry))
    );

    results.forEach(({ error }, index) => {
      if (error) {
        throw new Error(
          `Error inserting record for author ${newAuthors[index].name}: ${error.message}`
        );
      }
    });

    return {
      success: true,
      message: `Added to playlist for ${newAuthors.length} author${newAuthors.length > 1 ? 's' : ''}`,
      addedAuthors: newAuthors.length,
      skippedAuthors: song.authors.length - newAuthors.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        'There was a problem adding to playlist: ' + error.message
      );
    }
    throw new Error('There was a problem adding to playlist');
  }
};

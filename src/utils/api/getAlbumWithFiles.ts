import { LoaderFunctionArgs } from 'react-router-dom';
import { getSupabaseClient } from '../supabase';
import { FileObject } from '@supabase/storage-js';
import { IAuthor } from '../../types/IAuthor';
import { ISong } from '../../types/ISong';
import { IAlbumLoaderData } from '../../types/IAlbumLoaderData.ts';

export const getAlbumWithFiles = async ({
  params,
}: LoaderFunctionArgs): Promise<IAlbumLoaderData> => {
  if (!params.albumId) {
    throw new Response('Album ID is missing in the URL', { status: 400 });
  }
  const { albumId } = params;

  try {
    const supabase = getSupabaseClient();

    const { data: initialAlbum } = await supabase
      .from('albums')
      .select('id, createdAt:created_at, title, bucketFolderName')
      .eq('id', albumId)
      .single<{
        id: string;
        createdAt: string;
        title: string;
        bucketFolderName: string;
      }>();

    if (!initialAlbum) {
      throw new Response(`Album with ID ${albumId} not found.`, {
        status: 404,
      });
    }

    const { data: albumWithAuthors } = await supabase
      .from('albums')
      .select('authors:author_id (id, name)')
      .eq('bucketFolderName', initialAlbum.bucketFolderName)
      .returns<{ authors: IAuthor | null }[]>();

    if (!albumWithAuthors) {
      throw new Error(`Album author data could not be retrieved.`);
    }

    const authors: IAuthor[] = albumWithAuthors
      .map((album) => album.authors)
      .filter((author): author is IAuthor => author !== null);

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('songs')
      .list(initialAlbum.bucketFolderName, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (storageError) throw storageError;
    if (!storageFiles) throw new Error('Could not list storage files.');

    const coverFile = storageFiles.find((file) =>
      file.name.toLowerCase().startsWith('cover.')
    );

    let coverUrl: string | null = null;
    if (coverFile) {
      const coverPath = `${initialAlbum.bucketFolderName}/${coverFile.name}`;
      const { data: signedUrlData } = await supabase.storage
        .from('songs')
        .createSignedUrl(coverPath, 18000);
      coverUrl = signedUrlData?.signedUrl ?? null;
    }

    const songs: ISong[] = await Promise.all(
      storageFiles
        .filter((file) => file.id !== null && file.id !== coverFile?.id)
        .map(async (file: FileObject): Promise<ISong> => {
          const filePath = `${initialAlbum.bucketFolderName}/${file.name}`;
          const { data: signedUrlData } = await supabase.storage
            .from('songs')
            .createSignedUrl(filePath, 18000);

          return {
            title: file.name,
            source: signedUrlData?.signedUrl ?? undefined,
          };
        })
    );

    return {
      id: albumId,
      cover: coverUrl,
      createdAt: initialAlbum.createdAt,
      title: initialAlbum.title,
      bucketFolderName: initialAlbum.bucketFolderName,
      authors: authors,
      songs,
    };
  } catch (error) {
    console.error('Error fetching album data:', error);
    throw error;
  }
};

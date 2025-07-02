import { LoaderFunctionArgs } from 'react-router-dom';
import { getSupabaseClient } from '../supabase';
import { IAuthor } from '../../types/IAuthor.ts';

export const getAuthor = async ({
  params,
}: LoaderFunctionArgs): Promise<IAuthor> => {
  if (!params.authorId) {
    throw new Response('Author ID is missing in the URL', { status: 400 });
  }

  const { authorId } = params;
  const supabase = getSupabaseClient();

  const { data: author, error } = await supabase
    .from('authors')
    .select(
      `
        id,
        name,
        description,
        image
      `
    )
    .eq('id', authorId)
    .single<IAuthor>();

  if (error) {
    console.error('Database error fetching author:', error.message);
    throw new Response('Could not retrieve author data.', { status: 500 });
  }

  if (!author) {
    throw new Response(`Author with ID ${authorId} not found.`, {
      status: 404,
    });
  }

  return author;
};

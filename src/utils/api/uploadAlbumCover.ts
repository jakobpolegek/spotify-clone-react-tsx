import { getSupabaseClient } from "../supabase";

export const uploadAlbumCover = async (playlistId: string, userId: string, coverImage: File) => {
    try {
        const supabase = getSupabaseClient();   

        const coverImageExt = coverImage.name.split('.').pop();
        const coverImageName = `${playlistId}-${Math.random().toString(36).substring(2, 15)}.${coverImageExt}`;
        const coverImagePath = `playlist-covers/${userId}/${coverImageName}`;

        const { error: uploadError } = await supabase.storage
            .from('playlist-covers') // Your bucket name
            .upload(coverImagePath, coverImage, { upsert: true });

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('playlist-covers')
            .getPublicUrl(coverImagePath);

        const { error: updateError } = await supabase
            .from('playlists')
            .update({ cover_image_url: publicUrl })
            .eq('id', playlistId);

        if (updateError) throw updateError;

        return publicUrl;
        } catch (error) {
            console.error('Error uploading playlist cover:', error);
            alert('Error uploading playlist cover');
        return null;
    }
};

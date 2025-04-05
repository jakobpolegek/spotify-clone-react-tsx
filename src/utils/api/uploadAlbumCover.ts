import { getSupabaseClient } from "../supabase";

export const uploadAlbumCover = async (userId: string, coverImage: File, playlistId?: string) => {
    try {
        const supabase = getSupabaseClient();   
        const coverImageExt = coverImage.name.split('.').pop();
        const coverImageName = `${playlistId}-${Math.random().toString(36).substring(2, 15)}.${coverImageExt}`;
        const coverImagePath = `${userId}/${coverImageName}`;

        const { error: uploadError } = await supabase.storage
            .from('playlist-covers') 
            .upload(coverImagePath, coverImage, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('playlist-covers')
            .getPublicUrl(coverImagePath);
        return publicUrl;
    } catch (error) {
        throw new Error('Error uploading playlist cover:' + error);
    }
};


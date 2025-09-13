import { supabase } from "../lib/supabaseClient";

export async function uploadImage(file) {
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file);

  if (error) {
    console.error("Upload Error:", error);
    return null;
  }

  // Get public URL
  const { publicUrl } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

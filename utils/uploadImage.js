import { supabase } from "../lib/supabaseClient";

const sanitizeFileName = (name) =>
  name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_.]/g, "")
    .toLowerCase();

export async function uploadImage(file, folder = "blogs") {
  const fileName = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error || !data?.path) {
    throw new Error(error?.message || "Image upload failed.");
  }

  const { data: publicData } = supabase.storage.from("blog-images").getPublicUrl(data.path);
  if (!publicData?.publicUrl) {
    throw new Error("Unable to create image URL.");
  }

  return publicData.publicUrl;
}

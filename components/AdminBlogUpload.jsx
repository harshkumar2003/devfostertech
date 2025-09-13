'use client'
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Utility to sanitize file names
const sanitizeFileName = (name) => {
  return name
    .replace(/\s+/g, '-') // spaces → hyphens
    .replace(/[^a-zA-Z0-9-_.]/g, '') // remove special characters
    .toLowerCase();
};

export default function AdminBlogUpload() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let imageUrl = null;

      if (image) {
        const fileName = `blogs/${Date.now()}-${sanitizeFileName(image.name)}`;
        const { data, error } = await supabase.storage
          .from("blog-images") // make sure bucket exists
          .upload(fileName, image);

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(data.path);

        imageUrl = publicData.publicUrl;
      }

      const { error: blogError } = await supabase
        .from("posts") // make sure table exists
        .insert([
          {
            title,
            content,
            image_url: imageUrl,
            tags: tags.split(",").map(tag => tag.trim()),
          },
        ]);

      if (blogError) throw blogError;

      setMessage("✅ Blog uploaded successfully!");
      setTitle(""); setContent(""); setTags(""); setImage(null);
    } catch (err) {
      setMessage(`❌ Upload failed: ${err.message}`);
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black mt-20">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Panel — New Post</h1>

      <form onSubmit={handleUpload} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 text-white"
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          className="w-full p-3 rounded bg-gray-900 text-white"
          required
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 text-white"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full text-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#6CDDC2] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#5ac3aa] transition"
        >
          {loading ? 'Uploading...' : 'Publish Post'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-300">{message}</p>}
    </div>
  );
}

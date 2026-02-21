import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.devfostertech.com";

export default async function sitemap() {
  const now = new Date();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, created_at")
    .order("created_at", { ascending: false });

  const postUrls = (posts || []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug || post.id}`,
    lastModified: post.created_at
      ? new Date(post.created_at)
      : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postUrls,
  ];
}

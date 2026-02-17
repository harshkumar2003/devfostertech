import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.devfostertech.com";

export default async function sitemap() {
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, created_at")
    .order("created_at", { ascending: false });

  const postUrls = (posts || []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug || post.id}`,
    lastModified: post.created_at || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postUrls,
  ];
}

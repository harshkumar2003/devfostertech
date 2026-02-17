import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://www.devfostertech.com";

const xmlEscape = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const stripMarkdown = (value = "") =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]*?)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toDescription = (value = "", maxLength = 220) => {
  const clean = stripMarkdown(value);
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
};

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("id,slug,title,content,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (posts || [])
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug || post.id}`;
      return `
        <item>
          <title>${xmlEscape(post.title || "Untitled")}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${new Date(post.created_at || Date.now()).toUTCString()}</pubDate>
          <description>${xmlEscape(toDescription(post.content || ""))}</description>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Dev Foster Tech Blog</title>
      <link>${SITE_URL}/blog</link>
      <description>Latest posts from Dev Foster Tech</description>
      <language>en-us</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

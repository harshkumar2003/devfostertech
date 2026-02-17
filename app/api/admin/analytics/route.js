import { NextResponse } from "next/server";
import { getAdminSupabaseFromRequest } from "@/lib/adminApiAuth";

const SHARE_EVENT_MAP = {
  article_share_x: "X",
  article_share_linkedin: "LinkedIn",
  article_share_whatsapp: "WhatsApp",
  article_share_copy_link: "Copy Link",
};

const toTopEntries = (map, limit = 5) =>
  Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, count: value }));

export async function GET(request) {
  const auth = await getAdminSupabaseFromRequest(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") || 30)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await auth.supabase
    .from("analytics_events")
    .select("event_name,slug,title,page_path,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const events = data || [];
  const eventsByTypeMap = new Map();
  const postMap = new Map();
  const shareMap = new Map();

  for (const item of events) {
    eventsByTypeMap.set(item.event_name, (eventsByTypeMap.get(item.event_name) || 0) + 1);

    if (item.slug) {
      const key = `${item.slug}|||${item.title || "Untitled"}`;
      postMap.set(key, (postMap.get(key) || 0) + 1);
    }

    if (SHARE_EVENT_MAP[item.event_name]) {
      const channel = SHARE_EVENT_MAP[item.event_name];
      shareMap.set(channel, (shareMap.get(channel) || 0) + 1);
    }
  }

  const topPosts = Array.from(postMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([key, count]) => {
      const [slug, title] = key.split("|||");
      return { slug, title, count };
    });

  return NextResponse.json({
    rangeDays: days,
    totalEvents: events.length,
    eventsByType: toTopEntries(eventsByTypeMap, 20),
    topShareChannels: toTopEntries(shareMap, 10).map((item) => ({ channel: item.key, count: item.count })),
    topPosts,
    recentEvents: events.slice(0, 30),
  });
}

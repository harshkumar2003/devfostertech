import { NextResponse } from "next/server";
import { getAdminSupabaseFromRequest } from "@/lib/adminApiAuth";

const sanitizePayload = (body) => ({
  title: (body.title || "").trim(),
  slug: (body.slug || "").trim(),
  author: (body.author || "Dev Foster Tech").trim(),
  content: (body.content || "").trim(),
  image_url: body.image_url || null,
  tags: Array.isArray(body.tags) ? body.tags : [],
  created_at: body.created_at || new Date().toISOString(),
});

export async function GET(request) {
  const auth = await getAdminSupabaseFromRequest(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await auth.supabase
    .from("posts")
    .select("id, title, slug, author, content, tags, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ posts: data || [] });
}

export async function POST(request) {
  const auth = await getAdminSupabaseFromRequest(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const payload = sanitizePayload(body);

  if (!payload.title || !payload.slug || !payload.content) {
    return NextResponse.json({ error: "Title, slug and content are required." }, { status: 400 });
  }

  const { error } = await auth.supabase.from("posts").insert([payload]);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true }, { status: 201 });
}

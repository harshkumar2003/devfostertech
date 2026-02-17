import { NextResponse } from "next/server";
import { getAdminSupabaseFromRequest } from "@/lib/adminApiAuth";

const sanitizePayload = (body) => ({
  title: (body.title || "").trim(),
  slug: (body.slug || "").trim(),
  author: (body.author || "Dev Foster Tech").trim(),
  content: (body.content || "").trim(),
  image_url: body.image_url || null,
  tags: Array.isArray(body.tags) ? body.tags : [],
});

export async function PATCH(request, { params }) {
  const auth = await getAdminSupabaseFromRequest(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing post id." }, { status: 400 });

  const body = await request.json();
  const payload = sanitizePayload(body);

  if (!payload.title || !payload.slug || !payload.content) {
    return NextResponse.json({ error: "Title, slug and content are required." }, { status: 400 });
  }

  const { error } = await auth.supabase.from("posts").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const auth = await getAdminSupabaseFromRequest(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing post id." }, { status: 400 });

  const { error } = await auth.supabase.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}

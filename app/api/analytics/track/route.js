import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ALLOWED_EVENTS = new Set([
  "article_view",
  "article_share_x",
  "article_share_linkedin",
  "article_share_whatsapp",
  "article_share_copy_link",
  "article_code_copy",
]);

export async function POST(request) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Missing Supabase env config." }, { status: 500 });
    }

    const body = await request.json();
    const eventName = String(body?.event || "").trim();
    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ error: "Unsupported event." }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const payload = {
      event_name: eventName,
      slug: body?.slug ? String(body.slug).slice(0, 190) : null,
      title: body?.title ? String(body.title).slice(0, 300) : null,
      page_path: body?.page_path ? String(body.page_path).slice(0, 300) : null,
      source: body?.source ? String(body.source).slice(0, 100) : "web",
      meta: body?.meta && typeof body.meta === "object" ? body.meta : {},
      created_at: body?.timestamp || new Date().toISOString(),
    };

    const { error } = await supabase.from("analytics_events").insert([payload]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }
}

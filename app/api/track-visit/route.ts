import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const isNew = Boolean(body?.newVisitor);
    const supabase = await createClient();
    const { error } = await supabase.rpc("track_visit", { is_new_visitor: isNew });
    if (error) return NextResponse.json({ ok: false }, { status: 200 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

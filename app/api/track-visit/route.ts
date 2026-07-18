import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("increment_visits");
    if (error) return NextResponse.json({ ok: false }, { status: 200 });
    return NextResponse.json({ ok: true, count: data });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

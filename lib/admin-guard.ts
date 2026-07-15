import { createClient } from "@/lib/supabase/server";
import { isAdmin, isStaff } from "@/lib/roles";

export async function requireStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, supabase, user: null, profile: null };
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { ok: isStaff(profile), admin: isAdmin(profile), supabase, user, profile };
}

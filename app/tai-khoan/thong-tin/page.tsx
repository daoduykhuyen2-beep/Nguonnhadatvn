import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";
export const metadata = { title: "Thông tin cá nhân | Tài khoản" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Thông tin cá nhân</h1>
      <ProfileForm profile={(profile || { id: user!.id }) as Profile} />
    </div>
  );
}

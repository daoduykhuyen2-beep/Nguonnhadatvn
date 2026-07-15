import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountSidebar from "@/components/AccountSidebar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/thong-tin");
  const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url, email").eq("id", user.id).maybeSingle();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand/10 text-brand">
              {profile?.avatar_url
                ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                : <span className="text-lg font-semibold">{(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}</span>}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-neutral-900">{profile?.full_name || "Người dùng"}</div>
              <div className="truncate text-xs text-neutral-500">{profile?.email || user.email}</div>
            </div>
          </div>
          <AccountSidebar />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

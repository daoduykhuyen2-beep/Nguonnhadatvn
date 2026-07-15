import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import AdminRoleRow from "@/components/AdminRoleRow";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role, is_admin").eq("id", user!.id).maybeSingle();
  if (!isAdmin(me)) redirect("/admin");
  const { data: members } = await supabase.from("profiles").select("*").in("role", ["admin", "pho_cong_dong"]).limit(200);
  const staff = members || [];
  const { data: all } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-xl font-bold text-neutral-900">Nhân sự có quyền</h1>
        <RoleTable list={staff} />
      </div>
      <div>
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Tất cả thành viên (100 gần nhất)</h2>
        <RoleTable list={all || []} />
      </div>
    </div>
  );
}

function RoleTable({ list }: { list: any[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500"><tr><th className="px-3 py-3">Thành viên</th><th className="px-3 py-3">Vai trò</th><th className="px-3 py-3">Đổi vai trò</th></tr></thead>
        <tbody className="divide-y divide-neutral-100">{list.map((m) => <AdminRoleRow key={m.id} member={m} />)}</tbody>
      </table>
    </div>
  );
}

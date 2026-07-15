import { createClient } from "@/lib/supabase/server";
import AdminNotifyForm from "@/components/AdminNotifyForm";

export default async function Page() {
  const supabase = await createClient();
  const { data: notifs } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50);
  const list = notifs || [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Thông báo</h1>
      <AdminNotifyForm />
      <div className="space-y-2">
        {list.map((n) => (
          <div key={n.id} className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="font-medium text-neutral-900">{n.tieu_de}</span><span className="text-xs text-neutral-400">{new Date(n.created_at).toLocaleString("vi-VN")}</span></div>
            {n.noi_dung && <p className="mt-1 text-sm text-neutral-600">{n.noi_dung}</p>}
            <span className="mt-1 inline-block text-xs text-neutral-400">{n.target_user ? "Gửi riêng" : "Toàn hệ thống"} · {n.loai}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

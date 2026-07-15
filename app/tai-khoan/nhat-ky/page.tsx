import { createClient } from "@/lib/supabase/server";
export const metadata = { title: "Nhật ký sử dụng | Tài khoản" };

const LOAI: Record<string, string> = { tin_thuong: "Tin thường", tin_vip: "Tin VIP", day_tin: "Đẩy tin", boost: "Đẩy tin" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: credits } = await supabase.from("post_credits").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(100);
  const list = credits || [];
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Nhật ký sử dụng</h1>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">Chưa có hoạt động nào.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="px-4 py-3">Loại</th><th className="px-4 py-3">Số lượt</th><th className="px-4 py-3">Số ngày</th><th className="px-4 py-3">Hết hạn</th><th className="px-4 py-3">Thời gian</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-neutral-800">{LOAI[c.loai] || c.loai}</td>
                  <td className="px-4 py-3 text-neutral-700">{c.so_luot ?? "-"}</td>
                  <td className="px-4 py-3 text-neutral-700">{c.so_ngay ?? "-"}</td>
                  <td className="px-4 py-3 text-neutral-400">{c.het_han ? new Date(c.het_han).toLocaleDateString("vi-VN") : "-"}</td>
                  <td className="px-4 py-3 text-neutral-400">{new Date(c.created_at).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Noti = {
  id: string;
  tieu_de: string;
  noi_dung: string | null;
  loai: string | null;
  link: string | null;
  target_user: string | null;
  created_at: string;
};

function labelLoai(l: string | null) {
  if (l === "khuyen_mai") return "Khuyến mãi";
  if (l === "tai_chinh") return "Tài chính";
  return "Hệ thống";
}

export default function ThongBaoPage() {
  const [items, setItems] = useState<Noti[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) { setLoading(false); return; }
      setUid(user.id);
      const { data: notis } = await supabase
        .from("notifications")
        .select("id, tieu_de, noi_dung, loai, link, target_user, created_at")
        .or("target_user.is.null,target_user.eq." + user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      const { data: reads } = await supabase
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", user.id);
      setItems((notis as Noti[]) || []);
      setReadIds(new Set((reads || []).map((r: any) => r.notification_id)));
      setLoading(false);
    })();
  }, []);

  const unreadCount = items.filter((n) => !readIds.has(n.id)).length;

  async function markAllRead() {
    if (!uid) return;
    const unread = items.filter((n) => !readIds.has(n.id));
    if (unread.length === 0) return;
    const supabase = createClient();
    const rows = unread.map((n) => ({ user_id: uid, notification_id: n.id }));
    await supabase.from("notification_reads").upsert(rows, { onConflict: "user_id,notification_id" });
    setReadIds(new Set(items.map((n) => n.id)));
  }

  return (
    <div className="container-app py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Thông báo</h1>
          <p className="mt-1 text-sm text-neutral-500">Các chương trình, cập nhật và thông báo dành cho bạn.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">
            Đánh dấu tất cả đã đọc ({unreadCount})
          </button>
        )}
      </div>
      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-neutral-400">Đang tải…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-paper-line bg-white p-8 text-center text-neutral-400 shadow-sm">Bạn chưa có thông báo nào.</div>
        ) : (
          items.map((n) => {
            const isUnread = !readIds.has(n.id);
            const inner = (
              <>
                <div className="flex items-center gap-2">
                  {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />}
                  <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">{labelLoai(n.loai)}</span>
                  <span className="text-xs text-neutral-400">{new Date(n.created_at).toLocaleString("vi-VN")}</span>
                </div>
                <p className="mt-2 text-base font-semibold text-neutral-900">{n.tieu_de}</p>
                {n.noi_dung && <p className="mt-1 whitespace-pre-line text-sm text-neutral-600">{n.noi_dung}</p>}
                {n.link && <span className="mt-2 inline-block text-sm font-medium text-brand-700">Xem chi tiết →</span>}
              </>
            );
            const cls = "block rounded-2xl border bg-white p-5 shadow-sm transition " + (isUnread ? "border-brand/40 ring-1 ring-brand/20" : "border-neutral-100");
            return n.link ? (
              <Link key={n.id} href={n.link} className={cls + " hover:shadow-md"}>{inner}</Link>
            ) : (
              <div key={n.id} className={cls}>{inner}</div>
            );
          })
        )}
      </div>
    </div>
  );
}

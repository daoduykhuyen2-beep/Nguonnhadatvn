"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Noti = {
  id: string;
  tieu_de: string;
  noi_dung: string | null;
  loai: string | null;
  target_user: string | null;
  created_at: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Noti[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [uid, setUid] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;
    setUid(user.id);
    const { data: notis } = await supabase
      .from("notifications")
      .select("id, tieu_de, noi_dung, loai, target_user, created_at")
      .or("target_user.is.null,target_user.eq." + user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    const { data: reads } = await supabase
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", user.id);
    setItems((notis as Noti[]) || []);
    setReadIds(new Set((reads || []).map((r: any) => r.notification_id)));
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = items.filter((n) => !readIds.has(n.id)).length;

  async function markAll() {
    if (!uid) return;
    const unreadItems = items.filter((n) => !readIds.has(n.id));
    if (unreadItems.length === 0) return;
    const supabase = createClient();
    const rows = unreadItems.map((n) => ({ user_id: uid, notification_id: n.id }));
    await supabase.from("notification_reads").upsert(rows, { onConflict: "user_id,notification_id" });
    setReadIds(new Set([...readIds, ...unreadItems.map((n) => n.id)]));
  }

  function labelLoai(l: string | null) {
    if (l === "khuyen_mai") return "Khuyến mãi";
    if (l === "tai_chinh") return "Tài chính";
    return "Hệ thống";
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((o) => !o); if (!open) markAll(); }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-paper-line bg-white text-neutral-600 transition hover:bg-brand-50 hover:text-brand-700"
        aria-label="Thông báo"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-paper-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-paper-line px-4 py-3">
            <span className="text-sm font-semibold text-neutral-900">Thông báo</span>
            <Link href="/thong-bao" onClick={() => setOpen(false)} className="text-xs font-medium text-brand-700 hover:underline">Xem tất cả</Link>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-neutral-400">Chưa có thông báo nào</p>
            ) : (
              items.slice(0, 8).map((n) => (
                <div key={n.id} className="border-b border-paper-line px-4 py-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">{labelLoai(n.loai)}</span>
                    <span className="text-[11px] text-neutral-400">{new Date(n.created_at).toLocaleString("vi-VN")}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{n.tieu_de}</p>
                  {n.noi_dung && <p className="mt-0.5 text-sm text-neutral-600">{n.noi_dung}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


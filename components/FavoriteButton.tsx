"use client";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/app/actions/favorites";

export default function FavoriteButton({ postId, initial = false }: { postId: number; initial?: boolean }) {
  const [active, setActive] = useState(initial);
  const [pending, start] = useTransition();
  function onClick() {
    start(async () => {
      const res = await toggleFavorite(postId);
      if (res?.error) { alert(res.error); return; }
      if (typeof res.active === "boolean") setActive(res.active);
    });
  }
  return (
    <button onClick={onClick} disabled={pending} aria-label="Lưu tin"
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${active ? "border-brand bg-brand/10 text-brand" : "border-neutral-200 text-neutral-600 hover:border-brand hover:text-brand"}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
      {active ? "Đã lưu" : "Lưu tin"}
    </button>
  );
}

"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { adminSetPostState, adminSetPostTier, adminDeletePost } from "@/app/actions/admin";

const TIERS = [{ v: "thuong", l: "Thường" }, { v: "vang", l: "VIP Vàng" }, { v: "kim_cuong", l: "VIP Kim cương" }];

export default function AdminPostRow({ post }: { post: any }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState(post.trang_thai);
  const [tier, setTier] = useState(post.status);
  const [deleted, setDeleted] = useState(false);
  if (deleted) return null;

  function setPost(s: string) { start(async () => { const r = await adminSetPostState(post.id, s); if (!r.error) setState(s); }); }
  function changeTier(t: string) { start(async () => { const r = await adminSetPostTier(post.id, t); if (!r.error) setTier(t); }); }
  function del() { if (!confirm("Xóa vĩnh viễn tin này?")) return; start(async () => { const r = await adminDeletePost(post.id); if (!r.error) setDeleted(true); }); }

  const approved = state === "duyet";
  return (
    <tr className={approved ? "" : "bg-amber-50/40"}>
      <td className="px-3 py-3">
        <Link href={"/tin-dang/" + post.id} className="font-medium text-neutral-900 hover:text-brand line-clamp-1">{post.title}</Link>
        <div className="text-xs text-neutral-400">{[post.quan, post.gia].filter(Boolean).join(" · ")}</div>
      </td>
      <td className="px-3 py-3">
        <select value={tier} disabled={pending} onChange={(e) => changeTier(e.target.value)} className="rounded-lg border border-neutral-200 px-2 py-1 text-xs">
          {TIERS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>
      </td>
      <td className="px-3 py-3">
        <span className={"rounded-full border px-2.5 py-0.5 text-xs font-medium " + (approved ? "border-brand/30 bg-brand/10 text-brand-dark" : "border-amber-200 bg-amber-50 text-amber-700")}>{approved ? "Hiển thị" : "Chờ duyệt"}</span>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          {!approved && <button onClick={() => setPost("duyet")} disabled={pending} className="rounded-lg bg-brand px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-dark">Duyệt</button>}
          {approved && <button onClick={() => setPost("an")} disabled={pending} className="rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50">Ẩn</button>}
          <button onClick={del} disabled={pending} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Xóa</button>
        </div>
      </td>
    </tr>
  );
}

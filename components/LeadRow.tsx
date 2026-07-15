"use client";
import { useState, useTransition } from "react";
import { markLeadRead } from "@/app/actions/leads";

export default function LeadRow({ lead }: { lead: any }) {
  const [read, setRead] = useState(!!lead.is_read);
  const [, start] = useTransition();
  function mark() { start(async () => { const r = await markLeadRead(lead.id); if (!r?.error) setRead(true); }); }
  return (
    <tr className={read ? "" : "bg-brand/5"}>
      <td className="px-4 py-3 font-medium text-neutral-900">{lead.name || "Ẩn danh"}</td>
      <td className="px-4 py-3 text-neutral-700">{lead.phone}</td>
      <td className="px-4 py-3 text-neutral-600">{lead.note || "-"}</td>
      <td className="px-4 py-3 text-neutral-400">{new Date(lead.created_at).toLocaleString("vi-VN")}</td>
      <td className="px-4 py-3">{!read && <button onClick={mark} className="rounded-lg border border-brand/30 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/10">Đánh dấu đã đọc</button>}</td>
    </tr>
  );
}

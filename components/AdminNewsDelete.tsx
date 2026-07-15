"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminDeleteNews } from "@/app/actions/admin";
export default function AdminNewsDelete({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  function del() { if (!confirm("Xóa bài viết này?")) return; start(async () => { const r = await adminDeleteNews(id); if (r.error) alert(r.error); else router.refresh(); }); }
  return <button onClick={del} disabled={pending} className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Xóa</button>;
}

"use client";
import { useState, useTransition } from "react";
import { adminUpdateMember } from "@/app/actions/admin";
import { formatVND } from "@/lib/plans";

const TIERS = ["free", "co_ban", "chuyen_nghiep", "vip"];

export default function AdminMemberRow({ member }: { member: any }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [tier, setTier] = useState(member.membership_tier || "free");
  const [soDu, setSoDu] = useState(member.so_du || 0);

  function save(fd: FormData) {
    start(async () => {
      const r = await adminUpdateMember({}, fd);
      if (r.error) alert(r.error); else setOpen(false);
    });
  }

  return (
    <>
      <tr>
        <td className="px-3 py-3">
          <div className="font-medium text-neutral-900">{member.full_name || "—"}</div>
          <div className="text-xs text-neutral-400">{member.email || member.phone}</div>
        </td>
        <td className="px-3 py-3 text-neutral-700">{member.membership_tier || "free"}</td>
        <td className="px-3 py-3 font-semibold text-brand-dark">{formatVND(member.so_du || 0)}</td>
        <td className="px-3 py-3"><button onClick={() => setOpen((v) => !v)} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50">Sửa</button></td>
      </tr>
      {open && (
        <tr><td colSpan={4} className="bg-neutral-50 px-3 py-4">
          <form action={save} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={member.id} />
            <label className="text-sm">Hạng<select name="membership_tier" value={tier} onChange={(e) => setTier(e.target.value)} className="mt-1 block rounded-lg border border-neutral-200 px-2 py-1.5 text-sm">{TIERS.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
            <label className="text-sm">Số dư<input name="so_du" type="number" value={soDu} onChange={(e) => setSoDu(Number(e.target.value))} className="mt-1 block w-36 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm" /></label>
            <label className="text-sm">Giảm giá %<input name="giam_gia" type="number" defaultValue={member.giam_gia || 0} className="mt-1 block w-24 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm" /></label>
            <button disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">{pending ? "Đang lưu…" : "Lưu"}</button>
          </form>
        </td></tr>
      )}
    </>
  );
}

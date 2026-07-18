"use client";
import { useState, useTransition } from "react";
import { adminSetRole } from "@/app/actions/admin";
import { ROLE_LABELS } from "@/lib/roles";
import { toast } from "@/components/toast";

const ROLES = ["member", "pho_cong_dong", "admin"];

export default function AdminRoleRow({ member }: { member: any }) {
  const [role, setRole] = useState(member.role || "member");
  const [pending, start] = useTransition();
  function change(r: string) { start(async () => { const res = await adminSetRole(member.id, r); if (res.error) toast(res.error, "error"); else setRole(r); }); }
  return (
    <tr>
      <td className="px-3 py-3"><div className="font-medium text-neutral-900">{member.full_name || "—"}</div><div className="text-xs text-neutral-400">{member.email || member.phone}</div></td>
      <td className="px-3 py-3 text-neutral-600">{ROLE_LABELS[role] || role}</td>
      <td className="px-3 py-3">
        <select value={role} disabled={pending} onChange={(e) => change(e.target.value)} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm">
          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>)}
        </select>
      </td>
    </tr>
  );
}

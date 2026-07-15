"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminSavePlanOverride } from "@/app/actions/plans";

function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{pending ? "…" : "Lưu"}</button>; }
const cell = "w-24 rounded-lg border border-neutral-200 px-2 py-1 text-sm";

export default function AdminPlanRow({ plan, override }: { plan: any; override?: any }) {
  const [state, action] = useActionState(adminSavePlanOverride, {} as any);
  return (
    <tr className={state?.ok ? "bg-brand/5" : ""}>
      <td className="px-3 py-3">
        <form action={action} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="code" value={plan.code} />
          <input type="hidden" name="name" value={plan.name} />
          <span className="min-w-[160px] font-medium text-neutral-900">{plan.name}</span>
          <input name="price" type="number" defaultValue={override?.price ?? plan.price} className={cell} placeholder="Giá" />
          <input name="market_price" type="number" defaultValue={override?.market_price ?? plan.marketPrice ?? ""} className={cell} placeholder="Niêm yết" />
          <input name="promo_price" type="number" defaultValue={override?.promo_price ?? plan.promoPrice ?? ""} className={cell} placeholder="KM" />
          <input name="promo_label" defaultValue={override?.promo_label ?? plan.promoLabel ?? ""} className="w-28 rounded-lg border border-neutral-200 px-2 py-1 text-sm" placeholder="Nhãn KM" />
          <input name="promo_until" type="date" defaultValue={override?.promo_until ?? ""} className="rounded-lg border border-neutral-200 px-2 py-1 text-sm" />
          <Save />
          {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
        </form>
      </td>
    </tr>
  );
}

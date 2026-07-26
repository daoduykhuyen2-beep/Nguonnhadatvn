import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeletePostButton from "@/components/DeletePostButton";
import BoostPostButton from "@/components/BoostPostButton";
import type { Post } from "@/lib/types";
export const metadata = { title: "Tin của tôi | Tài khoản" };

const STATUS: Record<string, { label: string; cls: string }> = {
  duyet: { label: "Đã duyệt", cls: "bg-brand/10 text-brand-dark border-brand/30" },
  cho_duyet: { label: "Chờ duyệt", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  tu_choi: { label: "Từ chối", cls: "bg-red-50 text-red-700 border-red-200" },
  het_han: { label: "Hết hạn", cls: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

const TIER: Record<string, { label: string; cls: string }> = {
  vang: { label: "VIP Vàng", cls: "bg-amber-100 text-amber-800 border-amber-300" },
  kim_cuong: { label: "VIP Kim cương", cls: "bg-brand/10 text-brand-dark border-brand/30" },
};

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: posts } = await supabase.from("web_posts").select("*").eq("owner", user!.id).order("created_at", { ascending: false });
  const list = (posts || []) as Post[];
  const { data: profile } = await supabase.from("profiles").select("push_credits").eq("id", user!.id).single();
  const pushCredits = profile?.push_credits || 0;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Tin của tôi <span className="text-sm font-normal text-neutral-400">({list.length})</span></h1>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700" title="Số lượt đẩy tin còn lại">Lượt đẩy tin: {pushCredits}</span>
          <Link href="/bang-gia" className="rounded-xl border border-amber-400 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-400 hover:text-white">Mua lượt đẩy</Link>
          <Link href="/dang-tin" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">+ Đăng tin</Link>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-500">Bạn chưa có tin đăng nào.</p>
          <Link href="/dang-tin" className="mt-3 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">Đăng tin đầu tiên</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((p) => {
            const st = STATUS[p.trang_thai || "cho_duyet"] || STATUS.cho_duyet;
            const tier = TIER[p.status || ""];
            const cover = p.anh_bia || (Array.isArray(p.anh) ? p.anh[0] : "");
            return (
              <div key={p.id} className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
                <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {cover && /* eslint-disable-next-line @next/next/no-img-element */ <img src={cover} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={"/tin-dang/" + p.id} className="line-clamp-2 font-semibold text-neutral-900 hover:text-brand">{p.title}</Link>
                    <div className="flex flex-shrink-0 flex-col items-end gap-1">
                      <span className={"whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium " + st.cls}>{st.label}</span>
                      {tier && <span className={"whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium " + tier.cls}>{tier.label}</span>}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-brand-dark font-semibold">{p.gia || "Thỏa thuận"}</div>
                  <div className="mt-0.5 text-xs text-neutral-400">{[p.duong, p.phuong, p.quan].filter(Boolean).join(", ")}</div>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <Link href={"/sua-tin/" + p.id} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-brand hover:text-brand">Sửa</Link>
                    <Link href={"/bang-gia?post=" + p.id} className="rounded-lg border border-brand/40 bg-brand/5 px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white">Nâng cấp</Link>
                    <BoostPostButton postId={p.id} credits={pushCredits} />
                    <DeletePostButton id={p.id} />
                    <span className="ml-auto text-xs text-neutral-400">{p.luot_xem || 0} lượt xem</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

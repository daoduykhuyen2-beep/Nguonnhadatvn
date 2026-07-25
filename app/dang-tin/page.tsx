import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/PostForm";
import { createPost } from "@/app/actions/posts";

export const metadata = { title: "Đăng tin bất động sản | Nguồn Nhà Đất Việt Nam" };

export default async function DangTinPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/dang-tin");

  // Kiểm tra quyền đăng tin: admin không giới hạn, còn lại tính số lượt còn hạn.
  const { data: profile } = await supabase
    .from("profiles").select("is_admin").eq("id", user.id).single();
  const isAdmin = !!profile?.is_admin;

  const nowIso = new Date().toISOString();
  const { data: credits } = await supabase
    .from("post_credits")
    .select("so_luot, het_han")
    .eq("user_id", user.id)
    .eq("loai", "thuong")
    .gt("so_luot", 0)
    .gt("het_han", nowIso);
  const soLuot = (credits || []).reduce((sum, c) => sum + (c.so_luot || 0), 0);
  const conLuot = isAdmin || soLuot > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Đăng tin mới</h1>
        <p className="mt-1 text-sm text-neutral-500">Điền đầy đủ thông tin để tin đăng của bạn tiếp cận nhiều khách hàng hơn.</p>
      </div>

      {isAdmin ? (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Tài khoản quản trị: đăng tin không giới hạn.
        </div>
      ) : conLuot ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>Bạn còn <strong>{soLuot}</strong> lượt đăng tin trong gói hiện tại.</span>
          <Link href="/bang-gia" className="font-medium text-emerald-700 underline hover:text-emerald-900">Mua thêm gói</Link>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          <p className="font-medium">Bạn đã hết lượt đăng tin.</p>
          <p className="mt-1">Vui lòng mua gói để tiếp tục đăng tin lên hệ thống.</p>
          <Link href="/bang-gia" className="mt-3 inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">Xem bảng giá &amp; mua gói</Link>
        </div>
      )}

      {conLuot ? (
        <PostForm action={createPost} submitLabel="Đăng tin" />
      ) : null}
    </div>
  );
}

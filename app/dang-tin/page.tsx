import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/PostForm";
import { createPost } from "@/app/actions/posts";

export const metadata = { title: "Đăng tin bất động sản | Nguồn Nhà Đất Việt Nam" };

export default async function DangTinPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/dang-tin");
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Đăng tin mới</h1>
        <p className="mt-1 text-sm text-neutral-500">Điền đầy đủ thông tin để tin đăng của bạn tiếp cận nhiều khách hàng hơn.</p>
      </div>
      <PostForm action={createPost} submitLabel="Đăng tin" />
    </div>
  );
}

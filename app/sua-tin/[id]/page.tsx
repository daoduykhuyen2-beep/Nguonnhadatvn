import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditPostForm from "@/components/EditPostForm";
import type { Post } from "@/lib/types";

export const metadata = { title: "Sửa tin đăng | Nguồn Nhà Đất Việt Nam" };

export default async function SuaTinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/sua-tin/" + id);
  const { data: post } = await supabase.from("web_posts").select("*").eq("id", Number(id)).eq("owner", user.id).maybeSingle();
  if (!post) notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Sửa tin đăng</h1>
        <p className="mt-1 text-sm text-neutral-500">Cập nhật thông tin tin đăng của bạn.</p>
      </div>
      <EditPostForm post={post as Post} />
    </div>
  );
}

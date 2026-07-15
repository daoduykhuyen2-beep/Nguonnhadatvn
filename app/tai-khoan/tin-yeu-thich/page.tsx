import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/types";
export const metadata = { title: "Tin yêu thích | Tài khoản" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: favs } = await supabase.from("favorites").select("post_id").eq("user_id", user!.id);
  const ids = (favs || []).map((f) => f.post_id);
  let posts: Post[] = [];
  if (ids.length) {
    const { data } = await supabase.from("web_posts").select("*").in("id", ids);
    posts = (data || []) as Post[];
  }
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Tin yêu thích <span className="text-sm font-normal text-neutral-400">({posts.length})</span></h1>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">Bạn chưa lưu tin nào.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((p) => <PostCard key={p.id} post={p} favorited />)}
        </div>
      )}
    </div>
  );
}

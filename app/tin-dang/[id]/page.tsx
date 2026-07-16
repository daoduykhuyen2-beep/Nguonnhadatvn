import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import ContactBox from "@/components/ContactBox";

export const revalidate = 30;

function imagesOf(p: Post): string[] {
  const out: string[] = [];
  if (p.anh_bia) out.push(p.anh_bia);
  const a = p.anh as any;
  if (Array.isArray(a)) out.push(...a);
  else if (a && typeof a === "object") {
    if (a.cover) out.push(a.cover);
    if (Array.isArray(a.list)) out.push(...a.list);
  }
  return [...new Set(out.filter(Boolean))];
}

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("web_posts").select("*").eq("id", id).single();
  return (data as Post) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Không tìm thấy tin" };
  const imgs = imagesOf(post);
  return {
    title: post.title || "Tin bất động sản",
    description: (post.mota || "").slice(0, 160),
    openGraph: {
      title: post.title || "Tin bất động sản",
      description: (post.mota || "").slice(0, 160),
      images: imgs.length ? [imgs[0]] : undefined,
      type: "article",
    },
  };
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post || post.trang_thai !== "duyet") notFound();

  const imgs = imagesOf(post);
  const location = [post.duong, post.phuong, post.quan].filter(Boolean).join(", ");

  const supabase = await createClient();
  const { data: related } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .neq("id", post.id)
    .limit(4);

  const { data: { user } } = await supabase.auth.getUser();
  let favorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("post_id")
      .eq("user_id", user.id)
      .eq("post_id", post.id)
      .maybeSingle();
    favorited = !!fav;
  }

  // Kiểm tra quyền xem thông tin liên hệ: chỉ hội viên còn hạn (hoặc admin) mới được xem.
  let hasAccess = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, role, membership_expires_at")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) {
      const isAdmin = profile.is_admin === true || profile.role === "admin";
      const active = profile.membership_expires_at
        ? new Date(profile.membership_expires_at).getTime() > Date.now()
        : false;
      hasAccess = isAdmin || active;
    }
  }

  return (
    <div className="container-app py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Gallery */}
          <div className="card overflow-hidden">
            {imgs[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgs[0]} alt={post.title || ""} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-paper-soft text-ink-muted">Không có ảnh</div>
            )}
            {imgs.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-2">
                {imgs.slice(1, 9).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="card mt-5 p-6">
            <h1 className="text-2xl font-extrabold text-ink">{post.title}</h1>
            <p className="mt-2 text-2xl font-black text-brand-700">{post.gia || "Thỏa thuận"}</p>
            {location && <p className="mt-1 text-ink-muted">📍 {location}</p>}

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Info label="Loại" value={post.loai} />
              <Info label="Diện tích" value={post.dien_tich} />
              <Info label="Chiều ngang" value={post.chieu_ngang} />
              <Info label="Chiều dài" value={post.chieu_dai} />
              <Info label="Số tầng" value={post.so_tang} />
              <Info label="Lượt xem" value={post.luot_xem ? String(post.luot_xem) : "—"} />
            </div>

            {post.mota && (
              <div className="mt-6">
                <h2 className="mb-2 font-bold text-ink">Mô tả chi tiết</h2>
                <p className="whitespace-pre-line leading-relaxed text-ink-soft">{post.mota}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact sidebar */}
        <aside>
          <div className="sticky top-24">
            <ContactBox postId={post.id} contactName={post.contact_name} contactPhone={post.contact_phone} favorited={favorited} hasAccess={hasAccess} />
          </div>
        </aside>
      </div>

      {related && related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title mb-4">Tin tương tự</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(related as Post[]).map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-paper-soft p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="font-semibold text-ink">{value || "—"}</p>
    </div>
  );
}

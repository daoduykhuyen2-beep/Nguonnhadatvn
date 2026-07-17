import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import ContactBox from "@/components/ContactBox";
import { publicArea, fullAddress, maskTitle, maskDescription, fallbackImage } from "@/lib/address";

export const revalidate = 60;

function imagesOf(p: Post): string[] {
  const out: string[] = [];
  if (p.anh_bia) out.push(p.anh_bia);
  const a = p.anh as any;
  if (Array.isArray(a)) out.push(...a);
  else if (a && typeof a === "object") {
    if (a.cover) out.push(a.cover);
    if (Array.isArray(a.list)) out.push(...a.list);
  }
  const clean = [...new Set(out.filter(Boolean))];
  return clean.length ? clean : [fallbackImage(p.id)];
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
  const t = maskTitle(post);
  return {
    title: t,
    description: maskDescription(post.mota).slice(0, 160),
    openGraph: {
      title: t,
      description: maskDescription(post.mota).slice(0, 160),
      images: [imgs[0]],
      type: "article",
    },
  };
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post || post.trang_thai !== "duyet") notFound();

  const imgs = imagesOf(post);

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

  // Chỉ hội viên còn hạn (hoặc admin) mới được xem địa chỉ đầy đủ.
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

  const displayTitle = hasAccess ? (post.title || maskTitle(post)) : maskTitle(post);
  const area = publicArea(post);
  const full = fullAddress(post);

  return (
    <div className="container-app py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Gallery */}
          <div className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgs[0]} alt={displayTitle} className="aspect-video w-full object-cover" />
            {imgs.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-2">
                {imgs.slice(1, 5).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="card mt-6 p-6">
            <h1 className="text-2xl font-extrabold text-ink">{displayTitle}</h1>
            <p className="mt-2 text-3xl font-black text-brand-600">{post.gia || "Thỏa thuận"}</p>

            {/* Địa chỉ: chỉ hiện đầy đủ cho hội viên */}
            {hasAccess ? (
              full && <p className="mt-3 text-ink-soft">📍 {full}</p>
            ) : (
              <div className="mt-3 space-y-1">
                {area && <p className="text-ink-muted">📍 Khu vực: {area}</p>}
                <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
                  🔒 Địa chỉ chi tiết (số nhà, tên đường) chỉ hiển thị cho hội viên. Vui lòng đăng ký gói để xem.
                </p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                <p className="whitespace-pre-line leading-relaxed text-ink-soft">
                  {hasAccess ? post.mota : maskDescription(post.mota)}
                </p>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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

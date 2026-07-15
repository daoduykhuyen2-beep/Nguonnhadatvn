import Link from "next/link";
import type { Post } from "@/lib/types";

function coverOf(p: Post): string | null {
  if (p.anh_bia) return p.anh_bia;
  const a = p.anh as any;
  if (Array.isArray(a) && a.length) return a[0];
  if (a && typeof a === "object") {
    if (a.cover) return a.cover;
    if (Array.isArray(a.list) && a.list.length) return a.list[0];
  }
  return null;
}

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  kim_cuong: { label: "VIP Kim Cương", cls: "bg-brand-600 text-white" },
  vang: { label: "VIP Vàng", cls: "bg-amber-400 text-ink" },
};

export default function PostCard({ post }: { post: Post }) {
  const cover = coverOf(post);
  const badge = post.status ? TIER_BADGE[post.status] : undefined;
  const location = [post.duong, post.phuong, post.quan].filter(Boolean).join(", ");

  return (
    <Link
      href={`/tin-dang/${post.id}`}
      className="card group overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-soft">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={post.title || "Tin bất động sản"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">Không có ảnh</div>
        )}
        {badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold shadow ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.6rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
          {post.title || "Tin bất động sản"}
        </h3>
        <p className="text-lg font-extrabold text-brand-700">{post.gia || "Thỏa thuận"}</p>
        <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
          {post.dien_tich && <span className="chip">{post.dien_tich}</span>}
          {post.so_tang && <span className="chip">{post.so_tang} tầng</span>}
          {post.loai && <span className="chip">{post.loai}</span>}
        </div>
        {location && <p className="line-clamp-1 text-sm text-ink-muted">📍 {location}</p>}
      </div>
    </Link>
  );
}

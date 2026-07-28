import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { publicArea, maskTitle, postFallbackImage } from "@/lib/address";

// Nhan tieng Viet cho loai bat dong san (hien thi dep thay vi slug tho tu DB).
const LOAI_BDS: Record<string, string> = {
  can_ho: "Căn hộ",
  chung_cu: "Chung cư",
  nha_pho: "Nhà phố",
  nha_rieng: "Nhà riêng",
  biet_thu: "Biệt thự",
  dat_nen: "Đất nền",
  dat: "Đất",
  shophouse: "Shophouse",
  van_phong: "Văn phòng",
  kho_xuong: "Kho xưởng",
  mat_bang: "Mặt bằng",
  phong_tro: "Phòng trọ",
  khach_san: "Khách sạn",
};
function loaiLabel(v: string | null | undefined): string {
  if (!v) return "";
  const key = v.trim().toLowerCase();
  if (LOAI_BDS[key]) return LOAI_BDS[key];
  const words = key.replace(/_/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Anh placeholder (Unsplash) tu du lieu mau -> coi nhu chua co anh that,
// de tin dang hien banner danh lam theo dung khu vuc.
function isSeedImage(url: string | null | undefined): boolean {
  if (!url) return true;
  return /unsplash\.com/i.test(url);
}

function coverOf(p: Post): string {
  if (p.anh_bia && !isSeedImage(p.anh_bia)) return p.anh_bia;
  const a = p.anh as any;
  if (Array.isArray(a) && a.length && !isSeedImage(a[0])) return a[0];
  if (a && typeof a === "object") {
    if (a.cover && !isSeedImage(a.cover)) return a.cover;
    if (Array.isArray(a.list) && a.list.length && !isSeedImage(a.list[0])) return a.list[0];
  }
  return postFallbackImage(p);
}

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  kim_cuong: { label: "VIP Kim Cương", cls: "bg-brand-600 text-white" },
  vang: { label: "VIP Vàng", cls: "bg-amber-400 text-ink" },
};

export default function PostCard({ post }: { post: Post }) {
  const cover = coverOf(post);
  const badge = post.status ? TIER_BADGE[post.status] : undefined;
  const area = publicArea(post);

  return (
    <Link
      href={`/tin-dang/${post.id}`}
      className="card group overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-soft">
        <Image
          src={cover}
          alt={maskTitle(post)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {badge && (
          <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold shadow ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] font-semibold leading-snug text-ink group-hover:text-brand-600">
          {maskTitle(post)}
        </h3>
        <p className="text-lg font-extrabold text-brand-600">{post.gia || "Thỏa thuận"}</p>
        <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
          {post.dien_tich && <span className="chip">{post.dien_tich}</span>}
          {post.so_tang && <span className="chip">{post.so_tang} tầng</span>}
          {post.chieu_ngang && post.chieu_ngang !== "0m" && <span className="chip">Ngang {post.chieu_ngang}</span>}
          {post.chieu_dai && <span className="chip">Dài {post.chieu_dai}</span>}
          {post.loai && <span className="chip">{loaiLabel(post.loai)}</span>}
        </div>
        {area && <p className="line-clamp-1 text-sm text-ink-muted">📍 {area}</p>}
        <p className="text-xs text-brand-600">🔒 Đăng ký hội viên để xem địa chỉ đầy đủ</p>
      </div>
    </Link>
  );
}

import type { Post } from "@/lib/types";

// Ảnh gợi ý (thành phố lớn Việt Nam) dùng khi tin đăng chưa có ảnh
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80", // Sài Gòn
  "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800&q=80", // Hà Nội
  "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", // Sài Gòn skyline
  "https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80",   // phố cổ Hà Nội
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", // Đà Nẵng
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80", // nhà phố VN
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",   // căn hộ
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", // biệt thự
];

// Lấy ảnh gợi ý ổn định theo id (cùng 1 tin luôn ra cùng 1 ảnh)
export function fallbackImage(id: number | string): string {
  const n = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 0;
  return FALLBACK_IMAGES[n % FALLBACK_IMAGES.length];
}

// Khu vực công khai: chỉ hiện Quận/Huyện - Tỉnh/Thành, KHÔNG hiện đường & số nhà
export function publicArea(post: Post): string {
  return (post.quan || "").trim();
}

// Địa chỉ đầy đủ (kèm đường & số nhà) - chỉ dành cho hội viên
export function fullAddress(post: Post): string {
  return [(post as any).so_nha, post.duong, post.phuong, post.quan].filter(Boolean).join(", ");
}

// Che phần đường/số nhà trong tiêu đề. Tiêu đề dạng "Loại {đường}, {quận}, {tỉnh}".
// Giữ lại loại BĐS + khu vực, thay phần đường bằng dấu ẩn.
export function maskTitle(post: Post): string {
  const title = (post.title || "").trim();
  if (!title) return "Tin bất động sản";
  const area = publicArea(post);
  // Nếu có thông tin đường, cắt bỏ phần đường khỏi tiêu đề
  if (post.duong) {
    const idx = title.indexOf(post.duong);
    if (idx >= 0) {
      const before = title.slice(0, idx).replace(/[\s,]+$/, "");
      const after = title.slice(idx + post.duong.length).replace(/^[\s,]+/, "");
      const rebuilt = [before, after].filter(Boolean).join(", ");
      return rebuilt || (post.loai ? post.loai + (area ? " tại " + area : "") : "Tin bất động sản");
    }
  }
  return title;
}

// Che số nhà trong mô tả cho khách chưa đăng ký (thay số bằng ***)
export function maskDescription(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/\bsố nhà[^\n,.]*/gi, "số nhà ***").replace(/\bđịa chỉ[^\n,.]*/gi, "địa chỉ ***");
}

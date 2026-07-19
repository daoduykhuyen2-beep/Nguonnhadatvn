import type { Post } from "@/lib/types";
import { detectCity, pickCityImage } from "@/lib/news-image";

// Anh goi y theo khu vuc (danh lam thang canh) khi tin dang chua co anh that.
// Dua vao tieu de + quan/huyen de nhan dien thanh pho, moi tin ra 1 anh on dinh theo id.
export function fallbackImage(id: number | string, hint?: string): string {
  const key = String(id || "");
  return pickCityImage(hint || "", key || "x");
}

// Ghep goi y khu vuc tu 1 tin dang (tieu de + quan/huyen + phuong).
export function postFallbackImage(post: Post): string {
  const hint = [post.title, post.quan, post.phuong, post.duong].filter(Boolean).join(" ");
  return fallbackImage(post.id, hint);
}

// Kiem tra 1 tin co the nhan dien duoc thanh pho hay khong.
export function postCity(post: Post): string | null {
  const hint = [post.title, post.quan, post.phuong].filter(Boolean).join(" ");
  return detectCity(hint);
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

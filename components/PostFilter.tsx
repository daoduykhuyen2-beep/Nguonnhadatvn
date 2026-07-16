"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LOAI = ["Nhà phố", "Nhà mặt tiền", "Nhà hẻm", "Biệt thự", "Căn hộ", "Đất nền", "Cho thuê"];
const QUAN = ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh", "Phú Nhuận", "Gò Vấp", "Tân Bình", "Tân Phú", "Bình Tân", "Thủ Đức", "Bình Chánh", "Nhà Bè", "Hóc Môn", "Củ Chi"];

export default function PostFilter() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [loai, setLoai] = useState(sp.get("loai") || "");
  const [quan, setQuan] = useState(sp.get("quan") || "");

  function buildUrl(next: { q?: string; loai?: string; quan?: string }) {
    const params = new URLSearchParams();
    const _q = next.q !== undefined ? next.q : q;
    const _loai = next.loai !== undefined ? next.loai : loai;
    const _quan = next.quan !== undefined ? next.quan : quan;
    if (_q) params.set("q", _q);
    if (_loai) params.set("loai", _loai);
    if (_quan) params.set("quan", _quan);
    return "/tin-dang" + (params.toString() ? "?" + params.toString() : "");
  }

  function apply(next: { q?: string; loai?: string; quan?: string } = {}) {
    router.push(buildUrl(next));
  }

  function reset() {
    setQ(""); setLoai(""); setQuan("");
    router.push("/tin-dang");
  }

  const hasFilter = q || loai || quan;

  return (
    <div className="card p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
        <input
          className="input"
          placeholder="Tìm theo từ khóa, đường, khu vực..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        <select className="input md:w-40" value={loai} onChange={(e) => { setLoai(e.target.value); apply({ loai: e.target.value }); }}>
          <option value="">Loại BĐS</option>
          {LOAI.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input md:w-40" value={quan} onChange={(e) => { setQuan(e.target.value); apply({ quan: e.target.value }); }}>
          <option value="">Tất cả khu vực</option>
          {QUAN.map((qq) => <option key={qq} value={qq}>{qq}</option>)}
        </select>
        <button onClick={() => apply()} className="btn-primary md:w-32">Tìm kiếm</button>
      </div>
      {hasFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-muted">Đang lọc:</span>
          {quan && <span className="rounded-full bg-brand/10 px-3 py-1 text-brand-dark">{quan}</span>}
          {loai && <span className="rounded-full bg-brand/10 px-3 py-1 text-brand-dark">{loai}</span>}
          {q && <span className="rounded-full bg-brand/10 px-3 py-1 text-brand-dark">“{q}”</span>}
          <button onClick={reset} className="text-brand underline">Xóa lọc</button>
        </div>
      )}
    </div>
  );
}

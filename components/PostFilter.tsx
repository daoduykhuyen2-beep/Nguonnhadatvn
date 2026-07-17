"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LOAI = ["Nhà phố", "Nhà mặt tiền", "Nhà hẻm", "Biệt thự", "Căn hộ", "Đất nền", "Cho thuê"];

// Danh sách tỉnh/thành toàn quốc (lọc theo địa phương, không phải theo trang)
const TINH = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export default function PostFilter() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [loai, setLoai] = useState(sp.get("loai") || "");
  const [tinh, setTinh] = useState(sp.get("tinh") || "");

  function buildUrl(next: { q?: string; loai?: string; tinh?: string }) {
    const params = new URLSearchParams();
    const _q = next.q !== undefined ? next.q : q;
    const _loai = next.loai !== undefined ? next.loai : loai;
    const _tinh = next.tinh !== undefined ? next.tinh : tinh;
    if (_q) params.set("q", _q);
    if (_loai) params.set("loai", _loai);
    if (_tinh) params.set("tinh", _tinh);
    return "/tin-dang" + (params.toString() ? "?" + params.toString() : "");
  }

  function apply(next: { q?: string; loai?: string; tinh?: string } = {}) {
    router.push(buildUrl(next));
  }

  function reset() {
    setQ(""); setLoai(""); setTinh("");
    router.push("/tin-dang");
  }

  const hasFilter = q || loai || tinh;

  return (
    <div className="card p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
        <input
          className="input"
          placeholder="Tìm theo từ khóa, khu vực..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        <select className="input md:w-44" value={loai} onChange={(e) => { setLoai(e.target.value); apply({ loai: e.target.value }); }}>
          <option value="">Loại BĐS</option>
          {LOAI.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input md:w-48" value={tinh} onChange={(e) => { setTinh(e.target.value); apply({ tinh: e.target.value }); }}>
          <option value="">Toàn quốc</option>
          {TINH.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={() => apply()} className="btn-primary md:w-32">Tìm kiếm</button>
      </div>
      {hasFilter && (
        <button onClick={reset} className="mt-2 text-sm text-brand-600 hover:underline">Xóa bộ lọc</button>
      )}
    </div>
  );
}

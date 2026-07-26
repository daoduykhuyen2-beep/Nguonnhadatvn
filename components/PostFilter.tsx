"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LOAI = [
  { label: "Nhà phố", value: "nha_pho" },
  { label: "Nhà thổ cư", value: "tho_cu" },
  { label: "Căn hộ", value: "can_ho" },
  { label: "Dự án / Đất nền", value: "du_an" },
];

const GIAO_DICH = [
  { label: "Bán", value: "ban" },
  { label: "Cho thuê", value: "thue" },
];

// Danh sách tỉnh/thành toàn quốc (đồng bộ với form đăng tin để lọc khớp dữ liệu)
const TINH = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Dương",
  "Bình Định",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Cần Thơ",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
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
  "TP. Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

// Khoảng giá (đơn vị triệu VNĐ, dạng "min-max"; để trống max = không giới hạn)
const KHOANG_GIA = [
  { value: "", label: "Khoảng giá" },
  { value: "0-500", label: "Dưới 500 triệu" },
  { value: "500-1000", label: "500 triệu - 1 tỷ" },
  { value: "1000-2000", label: "1 - 2 tỷ" },
  { value: "2000-3000", label: "2 - 3 tỷ" },
  { value: "3000-5000", label: "3 - 5 tỷ" },
  { value: "5000-10000", label: "5 - 10 tỷ" },
  { value: "10000-", label: "Trên 10 tỷ" },
];

type CountMap = Record<string, number>;

export default function PostFilter({ counts = {} }: { counts?: CountMap }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [loai, setLoai] = useState(sp.get("loai") || "");
  const [tinh, setTinh] = useState(sp.get("tinh") || "");
  const [giaoDich, setGiaoDich] = useState(sp.get("giao_dich") || "");
  const [gia, setGia] = useState(sp.get("gia") || "");

  function buildUrl(next: { q?: string; loai?: string; tinh?: string; giao_dich?: string; gia?: string }) {
    const params = new URLSearchParams();
    const _q = next.q !== undefined ? next.q : q;
    const _loai = next.loai !== undefined ? next.loai : loai;
    const _tinh = next.tinh !== undefined ? next.tinh : tinh;
    const _giao_dich = next.giao_dich !== undefined ? next.giao_dich : giaoDich;
    const _gia = next.gia !== undefined ? next.gia : gia;
    if (_q) params.set("q", _q);
    if (_loai) params.set("loai", _loai);
    if (_giao_dich) params.set("giao_dich", _giao_dich);
    if (_tinh) params.set("tinh", _tinh);
    if (_gia) params.set("gia", _gia);
    const qs = params.toString();
    return "/tin-dang" + (qs ? "?" + qs : "");
  }

  function apply(next: { q?: string; loai?: string; tinh?: string; giao_dich?: string; gia?: string } = {}) {
    router.push(buildUrl(next));
  }

  function reset() {
    setQ(""); setLoai(""); setTinh(""); setGiaoDich(""); setGia("");
    router.push("/tin-dang");
  }

  const hasFilter = q || loai || tinh || giaoDich || gia;

  return (
    <div className="card p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <input
          className="input"
          placeholder="Tìm theo từ khóa, khu vực..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        <select className="input md:w-40" value={giaoDich} onChange={(e) => { setGiaoDich(e.target.value); apply({ giao_dich: e.target.value }); }}>
          <option value="">Bán / Cho thuê</option>
          {GIAO_DICH.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <select className="input md:w-44" value={loai} onChange={(e) => { setLoai(e.target.value); apply({ loai: e.target.value }); }}>
          <option value="">Loại BĐS</option>
          {LOAI.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <select className="input md:w-44" value={gia} onChange={(e) => { setGia(e.target.value); apply({ gia: e.target.value }); }}>
          {KHOANG_GIA.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <select className="input md:w-56" value={tinh} onChange={(e) => { setTinh(e.target.value); apply({ tinh: e.target.value }); }}>
          <option value="">Toàn quốc</option>
          {TINH.map((t) => <option key={t} value={t}>{counts[t] ? t + " (" + counts[t] + ")" : t}</option>)}
        </select>
        <button onClick={() => apply()} className="btn-primary md:w-32">Tìm kiếm</button>
      </div>
      {hasFilter && (
        <button onClick={reset} className="mt-2 text-sm text-brand-600 hover:underline">Xóa bộ lọc</button>
      )}
    </div>
  );
}

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

// Quận/Huyện theo từng tỉnh (dữ liệu lấy từ danh sách BĐS thực tế).
const QUAN_BY_TINH: Record<string, string[]> = {
  "An Giang": ["Long Xuyên"],
  "Bà Rịa - Vũng Tàu": ["Bà Rịa", "Đất Đỏ", "Long Điền", "Vũng Tàu", "Xuyên Mộc"],
  "Bắc Giang": ["Bắc Giang", "Lục Ngạn", "Việt Yên", "Yên Thế"],
  "Bắc Kạn": ["Chợ Đồn", "Na Rì"],
  "Bắc Ninh": ["Bắc Ninh", "Quế Võ", "Thuận Thành", "Tiên Du", "Từ Sơn", "Yên Phong"],
  "Bến Tre": ["Bến Tre", "Bình Đại"],
  "Bình Dương": ["Bến Cát", "Dĩ An", "Tân Uyên", "Thủ Dầu Một", "Thuận An"],
  "Bình Thuận": ["Bắc Bình", "Phan Thiết", "Tuy Phong"],
  "Đà Nẵng": ["Cẩm Lệ", "Hải Châu", "Hòa Vang", "Liên Chiểu", "Ngũ Hành Sơn", "Sơn Trà", "Thanh Khê"],
  "Đồng Nai": ["Biên Hòa", "Long Khánh", "Nhơn Trạch", "Trảng Bom"],
  "Hà Nam": ["Bình Lục", "Duy Tiên", "Kim Bảng", "Lý Nhân", "Phủ Lý", "Thanh Liêm"],
  "Hà Nội": ["Ba Đình", "Ba Vì", "Bắc Từ Liêm", "Cầu Giấy", "Chương Mỹ", "Đan Phượng", "Đông Anh", "Đống Đa", "Gia Lâm", "Hà Đông", "Hai Bà Trưng", "Hoài Đức", "Hoàn Kiếm", "Hoàng Mai", "Long Biên", "Mê Linh", "Mỹ Đức", "Nam Từ Liêm", "Phú Xuyên", "Phúc Thọ", "Quốc Oai", "Sóc Sơn", "Sơn Tây", "Tây Hồ", "Thạch Thất", "Thanh Oai", "Thanh Trì", "Thanh Xuân", "Thường Tín", "Ứng Hòa"],
  "Hải Phòng": ["Cát Hải", "Đồ Sơn", "Lê Chân", "Thuỷ Nguyên"],
  "Hòa Bình": ["Cao Phong", "Hòa Bình", "Kim Bôi", "Lạc Thủy", "Lương Sơn", "Mai Châu", "Tân Lạc"],
  "Hưng Yên": ["Ân Thi", "Hưng Yên", "Khoái Châu", "Kim Động", "Mỹ Hào", "Phù Cừ", "Tiên Lữ", "Văn Giang", "Văn Lâm", "Yên Mỹ"],
  "Khánh Hòa": ["Diên Khánh", "Khánh Vĩnh", "Nha Trang"],
  "Kiên Giang": ["Phú Quốc"],
  "Kon Tum": ["Ngọc Hồi"],
  "Lạng Sơn": ["Cao Lộc", "Lạng Sơn"],
  "Lào Cai": ["Lào Cai", "Sa Pa"],
  "Lâm Đồng": ["Bảo Lộc", "Đà Lạt", "Đơn Dương", "Đức Trọng"],
  "Long An": ["Bến Lức", "Cần Đước", "Cần Giuộc", "Đức Hòa", "Đức Huệ", "Tân An", "Thủ Thừa"],
  "Nam Định": ["Giao Thủy", "Hải Hậu", "Mỹ Lộc"],
  "Nghệ An": ["Vinh"],
  "Ninh Bình": ["Hoa Lư", "Ninh Bình"],
  "Ninh Thuận": ["Thuận Nam"],
  "Phú Thọ": ["Hạ Hoà", "Phú Thọ", "Tam Nông", "Thanh Sơn", "Thanh Thuỷ", "Việt Trì"],
  "Phú Yên": ["Tuy Hoà"],
  "Quảng Nam": ["Duy Xuyên", "Đại Lộc", "Điện Bàn", "Đông Giang", "Hội An", "Núi Thành", "Tam Kỳ", "Thăng Bình"],
  "Quảng Ninh": ["Cô Tô", "Đông Triều", "Hạ Long", "Quảng Yên", "Vân Đồn"],
  "Sơn La": ["Quỳnh Nhai"],
  "Tây Ninh": ["Châu Thành", "Hòa Thành"],
  "Thái Bình": ["Hưng Hà", "Thái Bình", "Thái Thụy", "Tiền Hải"],
  "Thái Nguyên": ["Đồng Hỷ", "Phổ Yên", "Phú Lương", "Sông Công", "Thái Nguyên"],
  "Thanh Hóa": ["Bá Thước", "Bỉm Sơn", "Cẩm Thủy", "Đông Sơn", "Hà Trung", "Hậu Lộc", "Hoằng Hóa", "Nga Sơn", "Nghi Sơn", "Ngọc Lặc", "Như Xuân", "Quảng Xương", "Sầm Sơn", "Thạch Thành", "Thanh Hóa", "Thiệu Hóa", "Thọ Xuân", "Thường Xuân", "Triệu Sơn", "Vĩnh Lộc", "Yên Định"],
  "Thừa Thiên Huế": ["Huế"],
  "TP. Hồ Chí Minh": ["Bình Chánh", "Bình Tân", "Bình Thạnh", "Cần Giờ", "Củ Chi", "Gò Vấp", "Hóc Môn", "Nhà Bè", "Phú Nhuận", "Quận 1", "Quận 10", "Quận 11", "Quận 12", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Tân Bình", "Tân Phú", "Thủ Đức"],
  "Vĩnh Phúc": ["Phúc Yên", "Tam Đảo"],
};

// Khoảng giá (đơn vị triệu VNĐ, dạng "min-max"; để trống max = không giới hạn)
const KHOANG_GIA = [
  { value: "", label: "Khoảng giá" },
  { value: "0-500", label: "Dưới 500 triệu" },
  { value: "500-1000", label: "500 triệu - 1 tỷ" },
  { value: "1000-2000", label: "1 - 2 tỷ" },
  { value: "2000-3000", label: "2 - 3 tỷ" },
  { value: "3000-5000", label: "3 - 5 tỷ" },
  { value: "5000-7000", label: "5 - 7 tỷ" },
  { value: "7000-10000", label: "7 - 10 tỷ" },
  { value: "10000-20000", label: "10 - 20 tỷ" },
  { value: "20000-30000", label: "20 - 30 tỷ" },
  { value: "30000-40000", label: "30 - 40 tỷ" },
  { value: "40000-50000", label: "40 - 50 tỷ" },
  { value: "50000-", label: "Trên 50 tỷ" },
];

type CountMap = Record<string, number>;

export default function PostFilter({ counts = {} }: { counts?: CountMap }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [loai, setLoai] = useState(sp.get("loai") || "");
  const [tinh, setTinh] = useState(sp.get("tinh") || "");
  const [quan, setQuan] = useState(sp.get("quan") || "");
  const [giaoDich, setGiaoDich] = useState(sp.get("giao_dich") || "");
  const [gia, setGia] = useState(sp.get("gia") || "");

  const quanList = QUAN_BY_TINH[tinh] || [];

  function buildUrl(next: { q?: string; loai?: string; tinh?: string; quan?: string; giao_dich?: string; gia?: string }) {
    const params = new URLSearchParams();
    const _q = next.q !== undefined ? next.q : q;
    const _loai = next.loai !== undefined ? next.loai : loai;
    const _tinh = next.tinh !== undefined ? next.tinh : tinh;
    const _quan = next.quan !== undefined ? next.quan : quan;
    const _giao_dich = next.giao_dich !== undefined ? next.giao_dich : giaoDich;
    const _gia = next.gia !== undefined ? next.gia : gia;
    if (_q) params.set("q", _q);
    if (_loai) params.set("loai", _loai);
    if (_giao_dich) params.set("giao_dich", _giao_dich);
    if (_tinh) params.set("tinh", _tinh);
    if (_quan) params.set("quan", _quan);
    if (_gia) params.set("gia", _gia);
    const qs = params.toString();
    return "/tin-dang" + (qs ? "?" + qs : "");
  }

  function apply(next: { q?: string; loai?: string; tinh?: string; quan?: string; giao_dich?: string; gia?: string } = {}) {
    router.push(buildUrl(next));
  }

  function onTinhChange(value: string) {
    // Đổi tỉnh thì reset quận/huyện để tránh lọc sai.
    setTinh(value);
    setQuan("");
    apply({ tinh: value, quan: "" });
  }

  function reset() {
    setQ(""); setLoai(""); setTinh(""); setQuan(""); setGiaoDich(""); setGia("");
    router.push("/tin-dang");
  }

  const hasFilter = q || loai || tinh || quan || giaoDich || gia;

  return (
    <div className="card p-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <input
          className="input lg:col-span-3"
          placeholder="Tìm theo từ khóa, khu vực..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
        <select className="input" value={giaoDich} onChange={(e) => { setGiaoDich(e.target.value); apply({ giao_dich: e.target.value }); }}>
          <option value="">Bán / Cho thuê</option>
          {GIAO_DICH.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <select className="input" value={loai} onChange={(e) => { setLoai(e.target.value); apply({ loai: e.target.value }); }}>
          <option value="">Loại BĐS</option>
          {LOAI.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <select className="input" value={gia} onChange={(e) => { setGia(e.target.value); apply({ gia: e.target.value }); }}>
          {KHOANG_GIA.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <select className="input" value={tinh} onChange={(e) => onTinhChange(e.target.value)}>
          <option value="">Toàn quốc</option>
          {TINH.map((t) => <option key={t} value={t}>{counts[t] ? t + " (" + counts[t] + ")" : t}</option>)}
        </select>
        <select className="input" value={quan} disabled={!tinh || quanList.length === 0} onChange={(e) => { setQuan(e.target.value); apply({ quan: e.target.value }); }}>
          <option value="">{tinh ? (quanList.length ? "Tất cả quận/huyện" : "Không có dữ liệu quận/huyện") : "Chọn tỉnh trước"}</option>
          {quanList.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
        <button onClick={() => apply()} className="btn-primary">Tìm kiếm</button>
      </div>
      {hasFilter && (
        <button onClick={reset} className="mt-2 text-sm text-brand-600 hover:underline">Xóa bộ lọc</button>
      )}
    </div>
  );
}

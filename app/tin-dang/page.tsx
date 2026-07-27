import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import type { Post } from "@/lib/types";

export const metadata = { title: "Tin đăng bất động sản" };
export const revalidate = 0;
export const dynamic = "force-dynamic";
const PER_PAGE = 24;

// Danh sách tỉnh/thành (đồng bộ với form đăng tin & bộ lọc) để đếm số tin theo tỉnh.
const TINH_LIST: string[] = [
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
  "Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

// Trích giá trị số (đơn vị triệu VNĐ) từ chuỗi giá tự do như "5 tỷ", "500 triệu", "12 tr/tháng".
function parseGiaTrieu(raw: string | null): number | null {
  if (!raw) return null;
  const s = String(raw).toLowerCase().replace(/\./g, "").replace(/,/g, ".");
  const mm = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!mm) return null;
  const num = parseFloat(mm[1]);
  if (isNaN(num)) return null;
  if (/(tỷ|ty|tỉ)/.test(s)) return num * 1000;
  if (/(triệu|trieu|tr)/.test(s)) return num;
  if (num >= 1000000) return num / 1000000;
  return num;
}

function parseNum(raw: string | null): number | null {
  if (!raw) return null;
  const s = String(raw).replace(/,/g, ".");
  const mm = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!mm) return null;
  const num = parseFloat(mm[1]);
  return isNaN(num) ? null : num;
}

export default async function TinDangPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; giao_dich?: string; loai?: string; tinh?: string; quan?: string; gia?: string; dien_tich?: string; so_tang?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();

  // Đếm số tin đã duyệt theo từng tỉnh/thành để hiển thị cạnh bộ lọc.
  const tinhCounts: Record<string, number> = {};
  const quanCounts: Record<string, Record<string, number>> = {};
  {
    // Lấy toàn bộ cột "quan" theo lô 1000 dòng để đếm đầy đủ (PostgREST giới hạn 1000/lần).
    const _BATCH = 1000;
    let _off = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data: _rows } = await supabase
        .from("web_posts_public")
        .select("quan")
        .eq("trang_thai", "duyet")
        .order("id", { ascending: true })
        .range(_off, _off + _BATCH - 1);
      const _chunk = (_rows || []) as { quan: string | null }[];
      for (const _row of _chunk) {
        const _raw = (_row.quan || "").trim();
        if (!_raw) continue;
        const _parts = _raw.split(",").map((x) => x.trim()).filter(Boolean);
        let _tinh = "";
        let _q = "";
        if (_parts.length >= 2) {
          _tinh = _parts[_parts.length - 1];
          _q = _parts[0];
        } else {
          for (const _t of TINH_LIST) {
            if (_raw.toLowerCase().includes(_t.toLowerCase())) { _tinh = _t; break; }
          }
          _q = _raw;
        }
        if (!_tinh) continue;
        tinhCounts[_tinh] = (tinhCounts[_tinh] || 0) + 1;
        if (_q && _q !== _tinh) {
          if (!quanCounts[_tinh]) quanCounts[_tinh] = {};
          quanCounts[_tinh][_q] = (quanCounts[_tinh][_q] || 0) + 1;
        }
      }
      if (_chunk.length < _BATCH) break;
      _off += _BATCH;
      if (_off > 100000) break;
    }
  }
  let query = supabase
    .from("web_posts_public")
    .select("*", { count: "exact" })
    .eq("trang_thai", "duyet");

  if (sp.loai) {
    // Bo loc theo slug chuan (nha_pho, tho_cu, can_ho, du_an) - khop truc tiep cot loai.
    query = query.eq("loai", sp.loai);
  }
  if (sp.giao_dich) query = query.eq("giao_dich", sp.giao_dich);
  // Lọc theo tỉnh/thành trên toàn quốc. Cột "quan" chứa tên tỉnh (có thể kèm quận/huyện).
  if (sp.tinh) query = query.ilike("quan", `%${sp.tinh}%`);
  // Lọc theo quận/huyện (khớp trong cột "quan").
  if (sp.quan) query = query.ilike("quan", `${sp.quan},%`);
  if (sp.q) query = query.or(`title.ilike.%${sp.q}%,mota.ilike.%${sp.q}%,quan.ilike.%${sp.q}%`);

  // Xử lý lọc khoảng giá: cột "gia" lưu dạng chuỗi nên lọc bằng JS sau khi lấy dữ liệu.
  let _giaMin: number | null = null;
  let _giaMax: number | null = null;
  if (sp.gia) {
    const _parts = sp.gia.split("-");
    _giaMin = _parts[0] !== "" && _parts[0] !== undefined ? parseFloat(_parts[0]) : null;
    _giaMax = _parts[1] !== "" && _parts[1] !== undefined ? parseFloat(_parts[1]) : null;
  }
  const _hasGia = _giaMin !== null || _giaMax !== null;

  // Lọc diện tích (m²) và số tầng — cũng lưu dạng chuỗi nên lọc bằng JS.
  let _dtMin: number | null = null;
  let _dtMax: number | null = null;
  if (sp.dien_tich) {
    const _p = sp.dien_tich.split("-");
    _dtMin = _p[0] !== "" && _p[0] !== undefined ? parseFloat(_p[0]) : null;
    _dtMax = _p[1] !== "" && _p[1] !== undefined ? parseFloat(_p[1]) : null;
  }
  const _hasDt = _dtMin !== null || _dtMax !== null;

  let _tangMin: number | null = null;
  let _tangMax: number | null = null;
  if (sp.so_tang) {
    const _p = sp.so_tang.split("-");
    _tangMin = _p[0] !== "" && _p[0] !== undefined ? parseFloat(_p[0]) : null;
    _tangMax = _p[1] !== "" && _p[1] !== undefined ? parseFloat(_p[1]) : null;
  }
  const _hasTang = _tangMin !== null || _tangMax !== null;

  const _hasClientFilter = _hasGia || _hasDt || _hasTang;

  let posts: Post[] = [];
  let count: number | null = 0;

  if (_hasClientFilter) {
    // Lấy TẤT CẢ dòng khớp bộ lọc DB (tỉnh/quận/loại/từ khóa) theo lô 1000,
    // rồi lọc giá/diện tích/số tầng bằng JS trên toàn bộ (không giới hạn 5000 dòng nữa).
    const _cfBase = query
      .order("rank_order", { ascending: true })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true });
    const _CF_BATCH = 1000;
    let _cfOff = 0;
    const _rawAll: Post[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data: _cfData } = await _cfBase.range(_cfOff, _cfOff + _CF_BATCH - 1);
      const _cfChunk = (_cfData || []) as Post[];
      _rawAll.push(..._cfChunk);
      if (_cfChunk.length < _CF_BATCH) break;
      _cfOff += _CF_BATCH;
      if (_cfOff > 100000) break;
    }
    const _all = _rawAll.filter((pp) => {
      if (_hasGia) {
        const _g = parseGiaTrieu(pp.gia);
        if (_g === null) return false;
        if (_giaMin !== null && _g < _giaMin) return false;
        if (_giaMax !== null && _g > _giaMax) return false;
      }
      if (_hasDt) {
        const _a = parseNum((pp as { dien_tich?: string | null }).dien_tich ?? null);
        if (_a === null) return false;
        if (_dtMin !== null && _a < _dtMin) return false;
        if (_dtMax !== null && _a > _dtMax) return false;
      }
      if (_hasTang) {
        const _t = parseNum((pp as { so_tang?: string | null }).so_tang ?? null);
        if (_t === null) return false;
        if (_tangMin !== null && _t < _tangMin) return false;
        if (_tangMax !== null && _t > _tangMax) return false;
      }
      return true;
    });
    count = _all.length;
    posts = _all.slice(from, to + 1);
  } else {
    const { data, count: _c } = await query
      .order("rank_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);
    posts = (data || []) as Post[];
    count = _c;
  }
  // Xoay vong trang dau (khi khong loc): giu nhom VIP o dau, xoay phan con lai theo thoi gian
  // de khach quay lai luon thay tin moi thay vi cung mot danh sach co dinh.
  const _isDefaultFeed = page === 1 && !sp.q && !sp.loai && !sp.giao_dich && !sp.tinh && !sp.quan && !sp.gia;
  if (_isDefaultFeed && posts.length > 8) {
    const _rot = Math.floor(Date.now() / (1000 * 60 * 20));
    const _vip = posts.slice(0, 7);
    const _rest = posts.slice(7);
    const _off = _rest.length > 0 ? _rot % _rest.length : 0;
    posts = _vip.concat(_rest.slice(_off)).concat(_rest.slice(0, _off));
  }
  // Uu tien tin vua duoc day (boosted_at trong 48h) len dau danh sach (trang dau, khi khong loc).
  if (_isDefaultFeed) {
    const _now = Date.now();
    const _boostMs = 48 * 60 * 60 * 1000;
    const _isBoosted = (p: Post) => {
      const b = (p as { boosted_at?: string | null }).boosted_at;
      return !!b && (_now - new Date(b).getTime()) < _boostMs;
    };
    const _boosted = posts
      .filter(_isBoosted)
      .sort((a, b) => new Date((b as { boosted_at?: string }).boosted_at || 0).getTime() - new Date((a as { boosted_at?: string }).boosted_at || 0).getTime());
    const _conLai = posts.filter((p) => !_isBoosted(p));
    posts = _boosted.concat(_conLai);
  }
  // Uu tien hien thi tin "nha pho" len dau danh sach (trang dau, khi khong loc).
  if (_isDefaultFeed) {
    const _isNhaPho = (p: Post) => /nha_pho|Nhà phố/i.test(String(p.loai || ""));
    const _nhaPho = posts.filter(_isNhaPho);
    const _khac = posts.filter((p) => !_isNhaPho(p));
    posts = _nhaPho.concat(_khac);
  }
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.loai) params.set("loai", sp.loai);
    if (sp.giao_dich) params.set("giao_dich", sp.giao_dich);
    if (sp.tinh) params.set("tinh", sp.tinh);
    if (sp.quan) params.set("quan", sp.quan);
    if (sp.gia) params.set("gia", sp.gia);
    if (sp.dien_tich) params.set("dien_tich", sp.dien_tich);
    if (sp.so_tang) params.set("so_tang", sp.so_tang);
    params.set("page", String(p));
    return `/tin-dang?${params.toString()}`;
  }

  return (
    <div className="container-app py-8">
      <h1 className="section-title mb-4">Tin đăng bất động sản</h1>
      <PostFilter counts={tinhCounts} quanCounts={quanCounts} />

      <p className="mt-4 text-sm text-ink-muted">Tìm thấy {total.toLocaleString("vi-VN")} tin đăng trên toàn quốc{sp.tinh ? " tại " + sp.tinh : ""}.</p>

      {posts.length === 0 ? (
        <div className="card mt-4 p-10 text-center text-ink-muted">
          Không tìm thấy tin đăng phù hợp. Hãy thử bỏ bớt bộ lọc.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {pageNumbers(page, totalPages).map((p, i) =>
            p === -1 ? (
              <span key={`gap${i}`} className="px-2 py-1.5 text-ink-muted">…</span>
            ) : (
              <Link
                key={p}
                href={pageUrl(p)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium ${p === page ? "bg-brand text-white" : "border border-neutral-200 text-ink-soft hover:bg-neutral-50"}`}
              >
                {p}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Sinh danh sách trang gọn (đầu, cuối và quanh trang hiện tại) vì có rất nhiều trang.
function pageNumbers(current: number, totalPages: number): number[] {
  const pages: number[] = [];
  const add = (p: number) => { if (!pages.includes(p)) pages.push(p); };
  add(1);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p > 1 && p < totalPages) add(p);
  }
  add(totalPages);
  const withGaps: number[] = [];
  let prev = 0;
  for (const p of pages.sort((a, b) => a - b)) {
    if (prev && p - prev > 1) withGaps.push(-1);
    withGaps.push(p);
    prev = p;
  }
  return withGaps;
}

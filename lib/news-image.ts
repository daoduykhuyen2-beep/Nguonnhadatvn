// Tu dong chon anh danh lam thang canh theo thanh pho duoc nhac trong tieu de bai viet.
// Moi bai duoc gan 1 anh khac nhau trong cung 1 danh sach de khong bi trung lap.

const CITY_IMAGES: Record<string, string[]> = {
  hanoi: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Rua.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C_Vietnam_(12041825854).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi_Temple_of_Literature_(cropped).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Long_Bi%C3%AAn_Bridge_-_panoramio.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi_Opera_House%2C_24_December_2016.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%B9a_Tr%E1%BA%A5n_Qu%E1%BB%91c%2C_H%C3%A0_N%E1%BB%99i.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/L%C4%83ng_B%C3%A1c_-_NKS.jpg?width=1200",
  ],
  hcm: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ho_Chi_Minh_City_panorama_2019_(cropped).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/20190923_Independence_Palace-10.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_03.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/DJI_0550-HDR-Pano_Bitexco_Financial_Tower.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ho_Chi_Minh_City%2C_City_Hall%2C_2020-01_CN-02.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Saigon_Central_Post_Office_(52681461470).jpg?width=1200",
  ],
  danang: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ngu_hanh_son_toan_canh.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dragon_bridge_from_above.png?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dragon_Bridge%2C_Da_Nang_during_day_-_20230819_(cropped).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bai_bien_My_Khe.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/The_Golden_Bridge%2C_Ba_Na_Hills%2C_Vietnam.jpg?width=1200",
  ],
  hue: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BA%A1i_n%E1%BB%99i.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/ThienMuPagoda.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/PERFUME_RIVER_HUE_VIETNAM_OCT_2010_(5106817809).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Annam_-_Hu%C3%A9_-_Pavillons_sur_le_bassin_fleuri_au_Tombeau_de_Tu-Duc.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hue%2C_le_pont_Trang_Tien.jpg?width=1200",
  ],
  haiphong: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/S%C3%B4ng_C%E1%BA%A5m_H%E1%BA%A3i_Ph%C3%B2ng_V%E1%BB%81_%C4%90%C3%AAm_n%C4%83m_2025.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Haiphong_Opera_House.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cat_Ba_town.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Haiphong2020.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cat_Ba_Town_6.jpg?width=1200",
  ],
  cantho: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ninhkieuquay.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Can-tho-tuonglamphotos.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/M%E1%BB%99t_c%E1%BA%A3nh_%E1%BB%9F_ch%E1%BB%A3_n%E1%BB%95i_C%C3%A1i_R%C4%83ng.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cau-can-tho-tuonglamphotos.jpg?width=1200",
  ],
  nhatrang: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Trang%2C_Kh%C3%A1nh_H%C3%B2a.png?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Arriving_in_Nha_Trang_-_Vietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hon_Chong_from_Co_Tien_beach.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Nha_Trang_Ch%E1%BB%A3_%C4%90%E1%BA%A7m_market_-_panoramio.jpg?width=1200",
  ],
  halong: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ha_Long_Bay_in_2019.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/V%E1%BB%8Bnh_H%E1%BA%A1_Long_-_NKS.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ha_Long_2019_taken_by_DJI_FC220.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tu%E1%BA%A7n_Ch%C3%A2u.jpg?width=1200",
  ],
  dalat: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Xuan_Huong_Lake_11.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Xuan_Huong_Lake_08.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Da_Lat_train_station_37.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/TLTY2.jpg?width=1200",
  ],
  generic: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ho_Chi_Minh_City_panorama_2019_(cropped).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Thap_Rua.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dragon_Bridge,_Da_Nang_during_day_-_20230819_(cropped).jpg?width=1200",
  ],
};

const CITY_PATTERNS: { key: string; kws: string[] }[] = [
  { key: "hanoi", kws: ["ha noi", "thu do", "hoan kiem", "ba dinh", "cau giay", "tay ho", "long bien"] },
  { key: "hcm", kws: ["tp hcm", "tphcm", "ho chi minh", "sai gon", "thu duc", "quan 1", "quan 7", "binh thanh", "nha be"] },
  { key: "danang", kws: ["da nang", "son tra", "ngu hanh son", "my khe", "ba na"] },
  { key: "hue", kws: ["hue", "thua thien", "lang co"] },
  { key: "haiphong", kws: ["hai phong", "cat ba", "do son", "le chan"] },
  { key: "cantho", kws: ["can tho", "ninh kieu", "cai rang"] },
  { key: "nhatrang", kws: ["nha trang", "khanh hoa", "cam ranh"] },
  { key: "halong", kws: ["ha long", "quang ninh", "van don", "cam pha"] },
  { key: "dalat", kws: ["da lat", "lam dong", "bao loc"] },
];

function stripDiacritics(s: string): string {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();
}

export function detectCity(title: string): string | null {
  const noDia = stripDiacritics(title || "");
  for (const { key, kws } of CITY_PATTERNS) {
    for (const kw of kws) {
      if (noDia.includes(kw)) return key;
    }
  }
  return null;
}

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

function isRealPhoto(url?: string | null): boolean {
  if (!url) return false;
  const u = url.trim();
  if (!u || !/^https?:\/\//i.test(u)) return false;
  if (u.includes("/logo") || u.endsWith(".svg")) return false;
  return true;
}

function poolFor(city: string): string[] {
  const p = CITY_IMAGES[city];
  return p && p.length ? p : CITY_IMAGES.generic;
}

/**
 * Tao bo gan anh cho 1 DANH SACH bai viet.
 * Goi assign(title, ownImage, key) lan luot theo thu tu hien thi:
 * - Neu bai da co anh that -> giu nguyen.
 * - Nguoc lai -> chon anh danh lam theo thanh pho, xoay vong trong pool
 *   de cac bai cung thanh pho khong trung anh (den khi het pool moi lap lai).
 */
export function createImageAssigner() {
  const used = new Set<string>();
  const counter: Record<string, number> = {};

  function pick(city: string, key: string): string {
    const pool = poolFor(city);
    const start = counter[city] || 0;
    // Uu tien anh chua dung; neu het thi xoay vong theo counter.
    for (let i = 0; i < pool.length; i++) {
      const cand = pool[(start + i) % pool.length];
      if (!used.has(cand)) {
        counter[city] = start + i + 1;
        used.add(cand);
        return cand;
      }
    }
    const idx = (start + hashString(key)) % pool.length;
    counter[city] = start + 1;
    return pool[idx];
  }

  return function assign(title: string, ownImage: string | null | undefined, key: string): string {
    const city = detectCity(title);
    // Bai nhac den 1 thanh pho -> luon dung anh danh lam cua thanh pho do.
    if (city) return pick(city, key || title || "x");
    // Khong ro thanh pho -> giu anh that cua bai neu co.
    if (isRealPhoto(ownImage)) return ownImage as string;
    return pick("generic", key || title || "x");
  };
}

/** Chon anh don le (khong dam bao khong trung) - dung khi khong co danh sach. */
export function pickCityImage(title: string, key: string): string {
  const city = detectCity(title) || "generic";
  const pool = poolFor(city);
  return pool[hashString(key || title || "x") % pool.length];
}

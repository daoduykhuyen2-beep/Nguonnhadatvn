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
  vungtau: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/V%C5%A9ng%20T%C3%A0u%20City%20view%20from%20the%20sea.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/%E1%BA%A2nh%20%C4%91%E1%BA%B9p%20V%C5%A9ng%20T%C3%A0u%20-%20On%20the%20Back%20Beach%201.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/M%E1%BB%99t%20ph%E1%BA%A7n%20V%C5%A9ng%20T%C3%A0u%202.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BB%9D%20bi%E1%BB%83n%20V%C5%A9ng%20T%C3%A0u.JPG?width=1200",
  ],
  gialai: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bi%E1%BB%83n%20H%E1%BB%93%20-%20Pleiku%2C%20Gia%20Lai%2C%20Vi%E1%BB%87t%20Nam%20(cropped).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bi%E1%BB%83n%20H%E1%BB%93%2C%20TP%20Pleiku%2C%20Gia%20Lai.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ho%20T'Nung%20(2).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bi%E1%BB%83n%20H%E1%BB%93%20-%20Pleiku%2C%20Gia%20Lai%2C%20Vi%E1%BB%87t%20Nam.jpg?width=1200",
  ],
  phanthiet: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam%2C%20Mui%20Ne%20sand%20dunes%2C%20trees%20on%20the%20sand.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mui%20Ne%20rough%20dunes.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/M%C5%A9i%20N%C3%A9%20Fishing%20Village.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam%2C%20Mui%20Ne%20sand%20dune.jpg?width=1200",
  ],
  dongnai: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/V%C4%83n%20Mi%E1%BA%BFu%20Tr%E1%BA%A5n%20Bi%C3%AAn%20%C4%90%E1%BB%93ng%20Nai%2C%20ng%C3%A0y%2027%20th%C3%A1ng%209%20n%C4%83m%202019%20(3).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Nh%C3%A0%20th%E1%BB%9D%20ch%C3%ADnh%20V%C4%83n%20mi%E1%BA%BFu%20Tr%E1%BA%A5n%20Bi%C3%AAn.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bien%20Hoa%2C%20Dong%20Nai%2C%20Vietnam%20-%20panoramio.jpg?width=1200",
  ],
  binhduong: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/250624%20Qu%E1%BB%91c%20L%E1%BB%99%2013%2C%20Ph%C3%BA%20L%E1%BB%A3i%2C%20Th%E1%BB%A7%20D%E1%BA%A7u%20M%E1%BB%99t%2C%20B%C3%ACnh%20D%C6%B0%C6%A1ng%20(1).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/250624%20Qu%E1%BB%91c%20L%E1%BB%99%2013%2C%20Ph%C3%BA%20H%C3%B2a%2C%20Th%E1%BB%A7%20D%E1%BA%A7u%20M%E1%BB%99t%2C%20B%C3%ACnh%20D%C6%B0%C6%A1ng%20(5).jpg?width=1200",
  ],
  nghean: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Thanh%20vinh%20nhin%20tu%20nui%20quyet.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/B%C3%A3i%20bi%E1%BB%83n%20C%E1%BB%ADa%20L%C3%B2..jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Lenin%20Avenue%20in%20Vinh%20city.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Cualovedem.jpg?width=1200",
  ],
  quangngai: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ly%20Son%20Island%2001%20-%20panoramio.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ly%20Son%20Island%2019%20-%20panoramio.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/L%C3%BD%20S%C6%A1n%2C%20Vietnam%20(Unsplash).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ly%20Son3.jpg?width=1200",
  ],
  sonla: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/S%C6%A1n%20La%20Province.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Terraced%20paddy%20fields%2C%20Sonla%2C%20Vietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Chi%E1%BB%81u%20v%E1%BB%81%20S%C6%A1n%20La%20-%20panoramio.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Moc-chau-tea-doi-2094890%20960%20720.jpg?width=1200",
  ],
  vinhlong: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Th%E1%BB%8B%20tr%E1%BA%A5n%20Long%20H%E1%BB%93%2C%20V%C4%A9nh%20Long.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/S%C3%B4ng%20Long%20H%E1%BB%93%202.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vinh%20Long%20Can%20Tho%20roundabout.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Long%20H%E1%BB%93%20District%2C%20Vinh%20Long%2C%20Vietnam%20-%20panoramio.jpg?width=1200",
  ],
  generic: [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ho%20Chi%20Minh%20City%20panorama%202019%20(cropped).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Saigon%20at%20Blue%20Hour.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/H%C3%A0%20T%C4%A9nh%20Province%20scenery.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam%2C%20Ninh%20Binh%2C%20Rural%20Scenery.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam%2C%20Ninh%20Binh%2C%20Limestone%20scenery.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sunrise%20Vietnam%20-%20Flickr%20-%20Lenny%20K%20Photography.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ninh%20Binh-Tam%20Coc%2003.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ninh%20Binh-Tam%20Coc%2005.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Tam%20Coc%2C%20Ninh%20Binh%20%2CVietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ha%20Giang%20Vietnam.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Ma%20Pi%20Leng%20Pass%20winding%20road%20Ha%20Giang%20Vietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mountain%20road%20at%20M%C3%A3%20P%C3%AD%20L%C3%A8ng%20Pass%2C%20H%C3%A0%20Giang%20Province%2C%20Vietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam%2C%20Bassac%20River%2C%20Mekong%20Delta.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam%2C%20Phong%20Dien%2C%20Mekong%20Delta%2C%20River.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Mekong%20River%20in%20Vietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/H%E1%BB%99i%20An%2C%20Ancient%20Town%2C%202020-01%20CN-02.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/H%E1%BB%99i%20An%2C%20Ancient%20Town%2C%202020-01%20CN-06.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/H%E1%BB%99i%20An%2C%20Ancient%20Town%2C%202020-01%20CN-10.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Terraced%20fields%20Sa%20Pa%20Vietnam.JPG?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Terraced%20fields%20Sa%20Pa%201.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Terraced%20fields%20Sa%20Pa%203.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Road%20and%20paddy%20fields%20in%20Sa%20Pa%2C%20Vietnam%2C%2020240126%201202%203586.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fansipan%20cable%20car%20terraced%20rice%20fields%20valley%20aerial%20view%20Sa%20Pa%20Vietnam.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Scenery%20from%20Liang%20Biang%20Mountain%2C%20Da%20Lat%20-%20panoramio.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful%20beach%20on%20Phu%20Quoc%20island%20Vietnam%20(39543775721).jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bai-sao-phu-quoc-tuonglamphotos.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/1%20Phu%20Quoc%20sunset.jpg?width=1200",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kem%20Beach%20aerial%20view%20Phu%20Quoc%20Island%20Vietnam.jpg?width=1200",
  ],
};

const CITY_PATTERNS: { key: string; kws: string[] }[] = [
  { key: "hanoi", kws: ["ha noi", "thu do", "hoan kiem", "ba dinh", "cau giay", "tay ho", "long bien", "dong da", "ha dong", "hai ba trung", "hoang mai", "thanh xuan", "nam tu liem", "bac tu liem"] },
  { key: "hcm", kws: ["tp hcm", "tphcm", "tp ho chi minh", "ho chi minh", "sai gon", "thu duc", "quan 1", "quan 2", "quan 3", "quan 4", "quan 5", "quan 6", "quan 7", "quan 8", "quan 9", "quan 10", "quan 11", "quan 12", "binh thanh", "nha be", "go vap", "tan binh", "tan phu", "phu nhuan", "binh tan", "hoc mon", "cu chi"] },
  { key: "danang", kws: ["da nang", "son tra", "ngu hanh son", "my khe", "ba na", "hai chau", "lien chieu", "cam le", "thanh khe"] },
  { key: "hue", kws: ["thua thien hue", "co do hue", "tp hue", "thanh pho hue", "dai noi", "kinh thanh hue", "lang co"] },
  { key: "haiphong", kws: ["hai phong", "cat ba", "do son", "le chan", "thuy nguyen", "hong bang", "ngo quyen", "kien an"] },
  { key: "cantho", kws: ["can tho", "ninh kieu", "cai rang", "binh thuy"] },
  { key: "nhatrang", kws: ["nha trang", "khanh hoa", "cam ranh"] },
  { key: "halong", kws: ["ha long", "quang ninh", "van don", "cam pha", "mong cai", "uong bi"] },
  { key: "dalat", kws: ["da lat", "lam dong", "bao loc"] },
  { key: "vungtau", kws: ["vung tau", "ba ria", "con dao", "xuyen moc", "phu my"] },
  { key: "gialai", kws: ["gia lai", "pleiku", "an khe", "bien ho"] },
  { key: "phanthiet", kws: ["phan thiet", "mui ne", "binh thuan", "la gi", "ke ga"] },
  { key: "dongnai", kws: ["dong nai", "bien hoa", "long thanh", "nhon trach", "trang bom", "long khanh"] },
  { key: "binhduong", kws: ["binh duong", "thu dau mot", "di an", "thuan an", "ben cat", "tan uyen"] },
  { key: "nghean", kws: ["nghe an", "cua lo", "vinh city", "thanh vinh", "cua hoi"] },
  { key: "quangngai", kws: ["quang ngai", "ly son", "dung quat", "binh son", "tra bong"] },
  { key: "sonla", kws: ["son la", "moc chau", "mai son", "thuan chau", "phu yen son la"] },
  { key: "vinhlong", kws: ["vinh long", "long ho", "binh minh vinh long", "mang thit", "tam binh"] },
];

function stripDiacritics(s: string): string {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[.,_\-/]+/g, " ")
    .replace(/\s+/g, " ");
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

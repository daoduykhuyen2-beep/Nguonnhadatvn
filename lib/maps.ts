import type { Post } from '@/lib/types';

// Server-side Google Maps helpers.
// Uses Geocoding, Places Nearby Search and Distance Matrix.
// Every call is wrapped so a failure (quota, no key, no result) returns null
// and the UI falls back to reference estimates.

const KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export type NearbyPlace = {
  name: string;
  type: string;
  km: number;
  minutesDrive: number | null;
  minutesWalk: number | null;
};

export type PropertyMapData = {
  lat: number;
  lng: number;
  formatted: string;
  places: NearbyPlace[];
};

// Categories we look up around each property, with a Vietnamese label.
const CATEGORIES: { type: string; label: string; keyword?: string }[] = [
  { type: 'school', label: 'Trường học' },
  { type: 'hospital', label: 'Bệnh viện' },
  { type: 'supermarket', label: 'Siêu thị' },
  { type: 'bank', label: 'Ngân hàng' },
  { type: 'bus_station', label: 'Bến xe / trạm xe buýt' },
  { type: 'restaurant', label: 'Nhà hàng / quán ăn' },
  { type: 'pharmacy', label: 'Nhà thuốc' },
  { type: 'park', label: 'Công viên' },
];

export function buildAddress(post: Post): string {
  const parts = [post.duong, post.phuong, post.quan]
    .filter((s) => s && String(s).trim().length > 0);
  const base = parts.join(', ');
  if (base) return base + ', Việt Nam';
  return (post.title || '') + ', Việt Nam';
}

async function jsonFetch(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function geocode(address: string): Promise<{ lat: number; lng: number; formatted: string } | null> {
  if (!KEY) return null;
  const url =
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    encodeURIComponent(address) +
    '&region=vn&language=vi&key=' +
    KEY;
  const data = await jsonFetch(url);
  if (!data || data.status !== 'OK' || !data.results || !data.results.length) return null;
  const r = data.results[0];
  return {
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    formatted: r.formatted_address || address,
  };
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

async function nearest(
  lat: number,
  lng: number,
  cat: { type: string; label: string; keyword?: string }
): Promise<{ name: string; plat: number; plng: number } | null> {
  const url =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
    lat +
    ',' +
    lng +
    '&rankby=distance&type=' +
    cat.type +
    '&language=vi&key=' +
    KEY;
  const data = await jsonFetch(url);
  if (!data || !data.results || !data.results.length) return null;
  const p = data.results[0];
  return {
    name: p.name,
    plat: p.geometry.location.lat,
    plng: p.geometry.location.lng,
  };
}

async function distanceMatrix(
  oLat: number,
  oLng: number,
  dests: { lat: number; lng: number }[],
  mode: 'driving' | 'walking'
): Promise<({ min: number | null; km: number | null })[]> {
  if (!dests.length) return [];
  const destStr = dests.map((d) => d.lat + ',' + d.lng).join('|');
  const url =
    'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' +
    oLat +
    ',' +
    oLng +
    '&destinations=' +
    encodeURIComponent(destStr) +
    '&mode=' +
    mode +
    '&language=vi&key=' +
    KEY;
  const data = await jsonFetch(url);
  if (!data || !data.rows || !data.rows[0]) return dests.map(() => ({ min: null, km: null }));
  return data.rows[0].elements.map((el: any) =>
    el && el.status === 'OK'
      ? {
          min: el.duration ? Math.round(el.duration.value / 60) : null,
          km: el.distance ? Math.round((el.distance.value / 1000) * 10) / 10 : null,
        }
      : { min: null, km: null }
  );
}

export async function getPropertyMapData(post: Post): Promise<PropertyMapData | null> {
  if (!KEY) return null;
  const geo = await geocode(buildAddress(post));
  if (!geo) return null;

  const found = await Promise.all(CATEGORIES.map((c) => nearest(geo.lat, geo.lng, c)));
  const items: { label: string; type: string; lat: number; lng: number; name: string; km: number }[] = [];
  found.forEach((f, i) => {
    if (f) {
        const straightKm = haversineKm(geo.lat, geo.lng, f.plat, f.plng);
        // Bỏ qua địa điểm cách căn nhà hơn 10 km (đường chim bay).
        if (straightKm > 10) return;
      items.push({
        label: CATEGORIES[i].label,
        type: CATEGORIES[i].type,
        lat: f.plat,
        lng: f.plng,
        name: f.name,
        km: Math.round(straightKm * 10) / 10,
      });
    }
  });

  if (!items.length) {
    return { lat: geo.lat, lng: geo.lng, formatted: geo.formatted, places: [] };
  }

  const dests = items.map((it) => ({ lat: it.lat, lng: it.lng }));
  const [drive, walk] = await Promise.all([
    distanceMatrix(geo.lat, geo.lng, dests, 'driving'),
    distanceMatrix(geo.lat, geo.lng, dests, 'walking'),
  ]);

  const places: NearbyPlace[] = items.map((it, i) => ({
    name: it.label + ' – ' + it.name,
    type: it.type,
    // Km hien thi lay tu khoang cach duong that (driving); fallback ve duong chim bay.
    km: drive[i] && drive[i].km != null ? drive[i].km : it.km,
    minutesDrive: drive[i] ? drive[i].min : null,
    minutesWalk: walk[i] ? walk[i].min : null,
  }));

  return { lat: geo.lat, lng: geo.lng, formatted: geo.formatted, places };
}

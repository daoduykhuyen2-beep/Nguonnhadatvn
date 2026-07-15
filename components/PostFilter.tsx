"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LOAI = ["Nhà phố", "Đất nền", "Căn hộ", "Biệt thự", "Nhà xưởng", "Mặt bằng"];
const QUAN = ["Quận 1", "Quận 2", "Quận 3", "Quận 7", "Quận 9", "Bình Thạnh", "Thủ Đức", "Gò Vấp"];

export default function PostFilter() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [loai, setLoai] = useState(sp.get("loai") || "");
  const [quan, setQuan] = useState(sp.get("quan") || "");

  function apply() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loai) params.set("loai", loai);
    if (quan) params.set("quan", quan);
    router.push(`/tin-dang?${params.toString()}`);
  }

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
        <select className="input md:w-40" value={loai} onChange={(e) => setLoai(e.target.value)}>
          <option value="">Loại BĐS</option>
          {LOAI.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input md:w-40" value={quan} onChange={(e) => setQuan(e.target.value)}>
          <option value="">Khu vực</option>
          {QUAN.map((qq) => <option key={qq} value={qq}>{qq}</option>)}
        </select>
        <button onClick={apply} className="btn-primary md:w-32">Tìm kiếm</button>
      </div>
    </div>
  );
}

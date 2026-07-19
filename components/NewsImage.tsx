"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
};

// Cac host anh ngoai duoc phep proxy qua /api/img de tranh chan hotlink / gioi han tai.
const PROXY_HOSTS = [
  "images.unsplash.com",
  "vnecdn.net",
  "vnexpress.net",
  "cafefcdn.com",
  "cafeland.vn",
  "dantricdn.com",
  "vietnamplus.vn",
  "tienphong.vn",
  "vneconomy.vn",
];

function toDisplaySrc(src: string): string {
  try {
    const u = new URL(src);
    if (u.protocol === "https:" && PROXY_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h))) {
      return "/api/img?u=" + encodeURIComponent(src);
    }
  } catch {
    // ignore, dung nguyen src
  }
  return src;
}

/**
 * Anh tin tuc: anh ngoai duoc tai qua proxy noi bo cho on dinh.
 * Neu van loi thi hien placeholder co logo thay vi anh vo.
 */
export default function NewsImage({ src, alt = "", className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-emerald-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Nha Dat Viet Nam" className="h-10 w-auto opacity-70" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={toDisplaySrc(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

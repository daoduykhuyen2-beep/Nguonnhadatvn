"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
};

/**
 * Anh tin tuc: neu link anh ngoai bi loi (403 hotlink / 404) thi
 * hien placeholder co logo thay vi anh vo.
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
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}


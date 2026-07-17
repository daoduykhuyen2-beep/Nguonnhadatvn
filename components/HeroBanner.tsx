'use client';

import { useEffect, useRef, useState } from 'react';

type Slide = { img: string; title: string; sub: string };

const SLIDES: Slide[] = [  { img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80", title: "Nhà phố trung tâm Sài Gòn", sub: "Giá thật · Pháp lý rõ ràng · Uy tín" },
  { img: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800&q=80", title: "Bất động sản Hà Nội", sub: "Hơn 14.000 căn nhà thật trên toàn quốc" },
  { img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", title: "Đầu tư nhà đất thông minh", sub: "Cập nhật giá thị trường từng khu vực mỗi ngày" },
  { img: "https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80", title: "Nhà đẹp · Vị trí đắc địa", sub: "Kết nối trực tiếp chủ nhà, không qua trung gian" },
  { img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", title: "Cho thuê & mua bán", sub: "Nhà phố, căn hộ, đất nền khắp cả nước" },
  { img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80", title: "Nguồn hàng phong phú", sub: "20.000+ tin đăng bất động sản chính chủ" },
  { img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", title: "Nhà phố trung tâm Sài Gòn", sub: "Giá thật · Pháp lý rõ ràng · Uy tín" },
  { img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", title: "Bất động sản Hà Nội", sub: "Hơn 14.000 căn nhà thật trên toàn quốc" }
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = SLIDES.length;

  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count]);

  function goTo(i: number) {
    setIndex(i);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((p) => (p + 1) % count), 5000);
  }

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4">
      <div className="relative h-64 overflow-hidden rounded-3xl shadow-lg sm:h-80 md:h-96">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: 'translateX(-' + index * 100 + '%)' }}
        >
          {SLIDES.map((s, i) => (
            <div key={i} className="relative h-full w-full flex-shrink-0">
              <img
                src={s.img}
                alt={s.title}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
                <h2 className="max-w-xl text-2xl font-bold text-white drop-shadow-md sm:text-3xl md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-2 max-w-md text-sm text-white/90 drop-shadow sm:text-base">
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        <button
          type="button"
          aria-label="Truoc"
          onClick={() => goTo((index - 1 + count) % count)}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-slate-800 shadow transition hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Sau"
          onClick={() => goTo((index + 1) % count)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-slate-800 shadow transition hover:bg-white"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={'Slide ' + (i + 1)}
              onClick={() => goTo(i)}
              className={
                'h-2.5 rounded-full transition-all ' +
                (i === index ? 'w-7 bg-emerald-400' : 'w-2.5 bg-white/60 hover:bg-white')
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

/* ==== 1. Tiêu điểm nổi bật trong tuần ==== */
const spotlights = [
  {
    tag: "Dự án tiêu điểm",
    title: "Căn hộ & nhà phố được quan tâm nhất tuần này",
    desc: "Danh sách bất động sản có lượt xem cao nhất, đã qua kiểm duyệt vị trí và pháp lý trước khi hiển thị.",
    href: "/tin-dang",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    tag: "Cơ hội đầu tư",
    title: "Khu vực hạ tầng đang chuyển động mạnh",
    desc: "Những nơi có vành đai, metro, cao tốc kết nối - tiềm năng tăng giá trong 6 đến 12 tháng tới.",
    href: "/tin-tuc",
    icon: <path d="m3 17 6-6 4 4 8-8M21 7v6h-6" />,
  },
  {
    tag: "Chính sách mới",
    title: "Cập nhật nhanh quy định đất đai vừa ban hành",
    desc: "Thủ tục, luật và chính sách mới nhất ảnh hưởng trực tiếp tới người mua và nhà đầu tư.",
    href: "/tin-tuc",
    icon: (
      <path d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM9 13h6M9 17h6" />
    ),
  },
];

export function SpotlightSection() {
  return (
    <section className="border-t border-neutral-100 bg-gradient-to-b from-white to-neutral-50/40">
      <div className="container-app py-16">
        <div className="mb-10 text-center">
          <span className="chip">Tiêu điểm</span>
          <h2 className="section-title mt-4">Nổi bật trong tuần</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full accent-line" />
          <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
            Những thông tin đáng chú ý nhất trên Nguồn Nhà Đất Việt Nam, được chọn lọc mỗi tuần.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {spotlights.map((s) => (
            <div
              key={s.title}
              className="group card relative flex flex-col overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="absolute inset-x-0 top-0 h-1 accent-line opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    {s.icon}
                  </svg>
                </span>
                <span className="chip">{s.tag}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{s.desc}</p>
              <Link
                href={s.href}
                className="mt-6 inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-700 transition-all group-hover:gap-2"
              >
                Xem chi tiết <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==== 2. Chúng tôi giúp bạn điều gì (4 trụ cột) ==== */
const pillars = [
  {
    title: "Kho nhà thật",
    desc: "Hơn 20.000 căn đã kiểm duyệt, đúng vị trí và diện tích. Để lại nhu cầu là được kết nối đúng căn bạn quan tâm, không tin ảo.",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9M9 21v-6h6v6" />
    ),
  },
  {
    title: "Thuê & cho thuê minh bạch",
    desc: "Phòng trọ, nhà riêng, mặt bằng, kho xưởng đến văn phòng - thông tin rõ ràng, giá thật, giúp bạn nhanh chóng chốt nơi ưng ý.",
    icon: (
      <path d="M3 21h18M6 21V8l6-4 6 4v13M10 21v-5h4v5M9 11h.01M15 11h.01" />
    ),
  },
  {
    title: "Góc nhìn thị trường",
        desc: "Phân tích và tin thị trường cập nhật liên tục, giúp bạn nhìn rõ bức tranh giá cả trước khi xuống tiền.",
    icon: <path d="M4 19V5M4 19h16M8 16V9M12 16v-4M16 16v-7M20 16v-3" />,
  },
  {
    title: "Cẩm nang nhà đất",
    desc: "Kinh nghiệm mua bán, cách kiểm tra pháp lý, vay vốn, phong thủy và thiết kế - dẫn lối bạn từng bước tới căn nhà mơ ước.",
    icon: (
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v14M8 7h7M8 11h7" />
    ),
  },
];

export function PillarsSection() {
  return (
    <section className="border-t border-neutral-100 bg-white">
      <div className="container-app py-16">
        <div className="mb-10 text-center">
          <span className="chip">Dịch vụ</span>
          <h2 className="section-title mt-4">Chúng tôi giúp bạn điều gì</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full accent-line" />
          <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
            Một nơi đủ đầy cho mọi nhu cầu nhà đất của bạn.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group card flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  {p.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-base font-bold text-ink">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==== 3. Khách hàng & nhân viên nói gì ==== */
type Testimonial = { name: string; role: string; text: string };

const trustStats = [
  { value: "10+", label: "Năm đồng hành" },
  { value: "50.000+", label: "Khách đã kết nối" },
  { value: "98%", label: "Khách hài lòng" },
  { value: "20.084", label: "Tin đã kiểm duyệt" },
];

const clientReviews: Testimonial[] = [
  {
    name: "Chị Ngọc Anh",
    role: "Mua căn hộ Quận 4",
    text: "Nhà thật, đúng vị trí như mô tả. Nhân viên dẫn tôi xem đúng căn mình chọn, không mất thời gian đi lòng vòng.",
  },
  {
    name: "Anh Minh Tuấn",
    role: "Mua nhà phố Thủ Đức",
    text: "Để lại số điện thoại là được gọi lại ngay. Tư vấn rõ ràng về pháp lý và diện tích trước khi tôi quyết định.",
  },
  {
    name: "Chị Thu Hà",
    role: "Mua căn hộ Quận 7",
    text: "Giá đúng như đăng, không phát sinh. Tôi tìm được căn hộ vừa túi tiền chỉ sau vài ngày liên hệ.",
  },
];

const staffReviews: Testimonial[] = [
  {
    name: "Anh Quốc Bảo",
    role: "Chuyên viên tư vấn",
    text: "Nguồn tin sạch, khách để lại nhu cầu thật nên mình chốt nhanh hơn hẳn so với chỗ cũ.",
  },
  {
    name: "Chị Phương Linh",
    role: "Nhân viên kinh doanh",
    text: "Hệ thống quản lý lead rõ ràng, mình tập trung tư vấn thay vì mất công đi tìm data.",
  },
  {
    name: "Anh Đức Thịnh",
    role: "Trưởng nhóm sale",
    text: "Làm ở Nguồn Nhà Đất Việt Nam thấy yên tâm vì tin đăng được kiểm duyệt, khách tin tưởng ngay từ cuộc gọi đầu.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteCard({ t }: { t: Testimonial }) {
  const initial = t.name.trim().split(" ").pop()!.charAt(0);
  return (
    <figure className="group card relative flex flex-col p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <span className="pointer-events-none absolute right-6 top-4 font-serif text-6xl leading-none text-brand-100 transition-colors group-hover:text-brand-200">
        &rdquo;
      </span>
      <Stars />
      <blockquote className="relative mt-4 flex-1 text-sm italic leading-relaxed text-neutral-600">
        {t.text}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-paper-line pt-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
          {initial}
        </span>
        <span>
          <span className="block text-sm font-bold text-ink">{t.name}</span>
          <span className="block text-xs text-neutral-500">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  return (
    <section className="border-t border-neutral-100 bg-gradient-to-b from-neutral-50/60 to-white">
      <div className="container-app py-16">
        <div className="mb-10 text-center">
          <span className="chip">Cảm nhận</span>
          <h2 className="section-title mt-4">Khách hàng & nhân viên nói gì</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full accent-line" />
          <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
            Những chia sẻ thật từ người mua nhà và đội ngũ tư vấn tại Nguồn Nhà Đất Việt Nam.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 rounded-2xl border border-paper-line bg-white p-6 shadow-soft md:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-brand-700 md:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-neutral-500 md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-brand-700">
              <span className="h-5 w-1 rounded-full accent-line" /> Khách hàng nói gì
            </h3>
            <div className="space-y-5">
              {clientReviews.map((t) => (
                <QuoteCard key={t.name} t={t} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-brand-700">
              <span className="h-5 w-1 rounded-full accent-line" /> Nhân viên kinh doanh nói gì
            </h3>
            <div className="space-y-5">
              {staffReviews.map((t) => (
                <QuoteCard key={t.name} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

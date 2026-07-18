import Link from "next/link";

/* ==== 1. Tiêu điểm nổi bật trong tuần ==== */
const spotlights = [
  {
    tag: "Dự án tiêu điểm",
    title: "Căn hộ & nhà phố được quan tâm nhất tuần này",
    desc: "Danh sách bất động sản có lượt xem cao nhất, đã qua kiểm duyệt vị trí và pháp lý trước khi hiển thị.",
  },
  {
    tag: "Cơ hội đầu tư",
    title: "Khu vực hạ tầng đang chuyển động mạnh",
    desc: "Những nơi có vành đai, metro, cao tốc kết nối - tiềm năng tăng giá trong 6 đến 12 tháng tới.",
  },
  {
    tag: "Chính sách mới",
    title: "Cập nhật nhanh quy định đất đai vừa ban hành",
    desc: "Thủ tục, luật và chính sách mới nhất ảnh hưởng trực tiếp tới người mua và nhà đầu tư.",
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
            Những thông tin đáng chú ý nhất trên Nhà Đất Việt Nam, được chọn lọc mỗi tuần.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {spotlights.map((s) => (
            <div
              key={s.title}
              className="group card relative flex flex-col overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="absolute inset-x-0 top-0 h-1 accent-line opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="chip self-start">{s.tag}</span>
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">{s.desc}</p>
              <Link
                href="/tin-tuc"
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
  },
  {
    title: "Thuê & cho thuê minh bạch",
    desc: "Phòng trọ, nhà riêng, mặt bằng, kho xưởng đến văn phòng - thông tin rõ ràng, giá thật, giúp bạn nhanh chóng chốt nơi ưng ý.",
  },
  {
    title: "Góc nhìn thị trường",
    desc: "Video phân tích và tin thị trường cập nhật liên tục, giúp bạn nhìn rõ bức tranh giá cả trước khi xuống tiền.",
  },
  {
    title: "Cẩm nang nhà đất",
    desc: "Kinh nghiệm mua bán, cách kiểm tra pháp lý, vay vốn, phong thủy và thiết kế - dẫn lối bạn từng bước tới căn nhà mơ ước.",
  },
];

export function PillarsSection() {
  return (
    <section className="border-t border-neutral-100 bg-white">
      <div className="container-app py-16">
        <div className="mb-10 text-center">
          <h2 className="section-title">Chúng tôi giúp bạn điều gì</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full accent-line" />
          <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
            Một nơi đủ đầy cho mọi nhu cầu nhà đất của bạn.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="group card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 font-serif text-2xl font-bold text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-base font-bold text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==== 3. Khách hàng & nhân viên nói gì ==== */
const clientReviews = [
  "Nhà thật, đúng vị trí như mô tả. Nhân viên dẫn tôi xem đúng căn mình chọn, không mất thời gian đi lòng vòng.",
  "Để lại số điện thoại là được gọi lại ngay. Tư vấn rõ ràng về pháp lý và diện tích trước khi tôi quyết định.",
  "Giá đúng như đăng, không phát sinh. Tôi tìm được căn hộ vừa túi tiền chỉ sau vài ngày liên hệ.",
];
const staffReviews = [
  "Nguồn tin sạch, khách để lại nhu cầu thật nên mình chốt nhanh hơn hẳn so với chỗ cũ.",
  "Hệ thống quản lý lead rõ ràng, mình tập trung tư vấn thay vì mất công đi tìm data.",
  "Làm ở Nhà Đất Việt Nam thấy yên tâm vì tin đăng được kiểm duyệt, khách tin tưởng ngay từ cuộc gọi đầu.",
];

function Quote({ text }: { text: string }) {
  return (
    <figure className="group card relative p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <span className="pointer-events-none absolute right-5 top-2 font-serif text-6xl leading-none text-brand-100 transition-colors group-hover:text-brand-200">
        &rdquo;
      </span>
      <blockquote className="relative text-sm italic leading-relaxed text-neutral-600">{text}</blockquote>
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
            Những chia sẻ thật từ người mua nhà và đội ngũ tư vấn tại Nhà Đất Việt Nam.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-brand-700">
              <span className="h-5 w-1 rounded-full accent-line" /> Khách hàng nói gì
            </h3>
            <div className="space-y-5">
              {clientReviews.map((t) => (
                <Quote key={t} text={t} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-brand-700">
              <span className="h-5 w-1 rounded-full accent-line" /> Nhân viên kinh doanh nói gì
            </h3>
            <div className="space-y-5">
              {staffReviews.map((t) => (
                <Quote key={t} text={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

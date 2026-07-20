"use client";

import { useState } from "react";
import Link from "next/link";

type Faq = { q: string; a: string };
type Section = { id: string; title: string; desc: string; faqs: Faq[] };

const SECTIONS: Section[] = [
  {
    id: "dang-tin",
    title: "Đăng tin bất động sản",
    desc: "Hướng dẫn cách đăng tin, các loại tin và những lưu ý khi đăng tin trên Nguồn Nhà Đất Việt Nam.",
    faqs: [
      { q: "Đăng tin trên Nguồn Nhà Đất Việt Nam có mất phí không?", a: "Bạn có thể đăng tin Thường hoặc nâng cấp lên tin VIP để tin hiển thị nổi bật hơn. Mức phí và quyền lợi của từng loại tin được liệt kê chi tiết trong trang Bảng giá." },
      { q: "Có những loại tin đăng nào?", a: "Hiện có hai nhóm chính là tin Thường và tin VIP. Tin VIP luôn được ưu tiên hiển thị ở vị trí cao hơn, có kích thước hình ảnh lớn hơn và tiếp cận được nhiều người xem hơn so với tin Thường." },
      { q: "Làm thế nào để đăng một tin mới?", a: "Bạn đăng nhập tài khoản, chọn mục Đăng tin, điền đầy đủ thông tin bất động sản rồi bấm Đăng tin. Tin sẽ được kiểm duyệt trước khi hiển thị công khai." },
      { q: "Vì sao tin của tôi chưa hiển thị sau khi đăng?", a: "Tin đăng cần trải qua bước kiểm duyệt để đảm bảo đúng quy định. Nếu tin bị từ chối, bạn sẽ nhận được thông báo kèm lý do để chỉnh sửa và đăng lại." },
      { q: "Tôi có thể chỉnh sửa hoặc xóa tin đã đăng không?", a: "Có. Trong mục Tin của tôi ở trang Tài khoản, bạn có thể sửa nội dung, đăng lại, đẩy tin lên đầu hoặc ẩn/xóa tin bất cứ lúc nào." },
    ],
  },
  {
    id: "tin-vip",
    title: "Tin VIP & Đẩy tin",
    desc: "Cách giúp tin đăng của bạn hiển thị nổi bật và tiếp cận nhiều người mua hơn.",
    faqs: [
      { q: "Tin VIP là gì và có lợi ích gì?", a: "Tin VIP là tin được ưu tiên hiển thị ở vị trí cao, có hình ảnh lớn và nổi bật hơn tin Thường, nhờ đó tiếp cận được nhiều người xem và tăng khả năng có khách liên hệ." },
      { q: "Đẩy tin là gì?", a: "Đẩy tin giúp đưa tin đăng của bạn trở lại vị trí đầu danh sách như khi vừa đăng mới, nhờ đó tin được nhiều người nhìn thấy hơn mà không cần đăng lại từ đầu." },
      { q: "Khi nào nên dùng tin VIP hoặc đẩy tin?", a: "Bạn nên cân nhắc dùng tin VIP hoặc đẩy tin với những bất động sản cần bán hoặc cho thuê nhanh, hoặc trong khu vực có nhiều tin cạnh tranh." },
      { q: "Chi phí cho tin VIP và đẩy tin được tính thế nào?", a: "Mức phí phụ thuộc vào loại tin và thời gian hiển thị bạn chọn. Bạn có thể xem chi tiết trong trang Bảng giá trước khi quyết định nâng cấp." },
    ],
  },
  {
    id: "tai-khoan",
    title: "Tài khoản người dùng",
    desc: "Các câu hỏi về đăng ký, đăng nhập và quản lý thông tin tài khoản.",
    faqs: [
      { q: "Đăng ký tài khoản có lợi ích gì?", a: "Khi có tài khoản, bạn có thể đăng và quản lý tin không giới hạn số lượng, lưu tin yêu thích, theo dõi lịch sử giao dịch, nạp tiền và sử dụng các tiện ích dành cho thành viên." },
      { q: "Tôi quên mật khẩu thì phải làm sao?", a: "Tại trang Đăng nhập, bấm vào Quên mật khẩu và làm theo hướng dẫn. Hệ thống sẽ gửi liên kết đặt lại mật khẩu về email đã đăng ký của bạn." },
      { q: "Làm sao để cập nhật thông tin cá nhân?", a: "Vào trang Tài khoản, chọn mục Thông tin cá nhân để cập nhật họ tên, số điện thoại, email và ảnh đại diện." },
      { q: "Tôi có thể đổi mật khẩu ở đâu?", a: "Trong trang Tài khoản có mục Đổi mật khẩu. Bạn nhập mật khẩu hiện tại và mật khẩu mới để hoàn tất việc thay đổi." },
    ],
  },
  {
    id: "thanh-toan",
    title: "Thanh toán & Nạp tiền",
    desc: "Thông tin về các hình thức thanh toán và nạp tiền vào tài khoản.",
    faqs: [
      { q: "Có những hình thức thanh toán nào?", a: "Bạn có thể nạp tiền vào tài khoản qua chuyển khoản ngân hàng và quét mã QR. Số tiền sau khi nạp sẽ được dùng để thanh toán cho các dịch vụ đăng tin và nâng cấp tin." },
      { q: "Sau khi chuyển khoản, bao lâu tiền vào tài khoản?", a: "Với hình thức chuyển khoản hoặc QR, tiền thường được ghi nhận tự động trong ít phút. Nếu số dư chưa cập nhật, vui lòng liên hệ bộ phận hỗ trợ kèm biên lai giao dịch." },
      { q: "Tôi có thể kiểm tra lịch sử nạp tiền và chi tiêu ở đâu?", a: "Trong trang Tài khoản, mục Biến động số dư và Nhật ký hiển thị chi tiết các lần nạp tiền cũng như chi tiêu cho từng dịch vụ." },
      { q: "Tôi có được xuất hóa đơn không?", a: "Có. Bạn có thể yêu cầu xuất hóa đơn cho các khoản đã thanh toán trong mục Hóa đơn VAT ở trang Tài khoản." },
    ],
  },
  {
    id: "tim-kiem",
    title: "Tìm kiếm bất động sản",
    desc: "Dành cho người mua, thuê và tìm kiếm bất động sản.",
    faqs: [
      { q: "Làm sao để tìm bất động sản phù hợp?", a: "Bạn dùng thanh tìm kiếm và bộ lọc theo khu vực, loại hình, khoảng giá và diện tích để thu hẹp kết quả. Bạn cũng có thể lưu những tin ưng ý vào mục Tin yêu thích." },
      { q: "Làm sao để liên hệ với người đăng tin?", a: "Trên mỗi tin đăng đều có thông tin liên hệ của người đăng. Bạn có thể gọi điện hoặc nhắn tin trực tiếp để trao đổi thêm về bất động sản." },
      { q: "Tôi thấy một tin đăng có dấu hiệu sai lệch thì báo ở đâu?", a: "Bạn có thể sử dụng chức năng báo xấu trên tin đăng hoặc liên hệ bộ phận hỗ trợ. Chúng tôi sẽ kiểm tra và xử lý các tin vi phạm quy định." },
    ],
  },
];

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-paper-line bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-ink">{faq.q}</span>
        <span className="text-xl leading-none text-primary">{open ? "-" : "+"}</span>
      </button>
      {open ? (
        <div className="border-t border-paper-line px-5 py-4 leading-relaxed text-ink-soft">
          {faq.a}
        </div>
      ) : null}
    </div>
  );
}

export default function TroGiup() {
  return (
    <div className="container-app max-w-4xl py-12">
      <h1 className="section-title">Trung tâm trợ giúp</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Tổng hợp hướng dẫn và các câu hỏi thường gặp giúp bạn sử dụng Nguồn Nhà Đất Việt Nam
        thuận tiện hơn. Nếu không tìm thấy câu trả lời, vui lòng liên hệ bộ phận hỗ trợ.
      </p>

      <nav className="mt-8 flex flex-wrap gap-3">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={"#" + s.id}
            className="rounded-full border border-paper-line bg-paper-soft px-4 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-2xl font-extrabold text-ink">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{s.desc}</p>
            <div className="mt-5 space-y-3">
              {s.faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-paper-line bg-paper-soft p-6">
        <h2 className="text-xl font-extrabold text-ink">Vẫn cần hỗ trợ?</h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Nếu bạn chưa tìm được câu trả lời, hãy gửi email cho chúng tôi qua{" "}
          <a href="mailto:hotro.nguonnhadatvn@gmail.com" className="text-primary hover:underline">
            hotro.nguonnhadatvn@gmail.com
          </a>{" "}
          hoặc xem thêm tại các trang{" "}
          <Link href="/bang-gia" className="text-primary hover:underline">
            Bảng giá
          </Link>{" "}
          và{" "}
          <Link href="/gioi-thieu" className="text-primary hover:underline">
            Giới thiệu
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

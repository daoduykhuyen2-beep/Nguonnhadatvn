export const metadata = { title: "Điều khoản sử dụng" };
export default function DieuKhoan() {
  return (
    <div className="container-app max-w-3xl py-12">
      <h1 className="section-title">Điều khoản sử dụng</h1>
      <div className="mt-6 space-y-6 leading-relaxed text-ink-soft">
        <p>
          Khi truy cập và sử dụng website Nguồn Nhà Đất Việt Nam, bạn đồng ý tuân
          thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">1. Chấp nhận điều khoản</h2>
          <p>
            Việc bạn tiếp tục sử dụng website đồng nghĩa với việc bạn đã đọc, hiểu
            và đồng ý với toàn bộ điều khoản này cùng các chính sách liên quan như
            Chính sách bảo mật và Quy chế đăng tin. Nếu không đồng ý, vui lòng ngừng
            sử dụng dịch vụ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">2. Tài khoản người dùng</h2>
          <p>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn
            ra dưới tài khoản của mình. Vui lòng cung cấp thông tin chính xác, trung
            thực khi đăng ký và cập nhật khi có thay đổi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">3. Trách nhiệm khi đăng tin</h2>
          <p>
            Người đăng tin chịu trách nhiệm về tính chính xác và hợp pháp của nội
            dung tin đăng, bao gồm hình ảnh, giá, vị trí và thông tin pháp lý của bất
            động sản. Nghiêm cấm đăng tin sai sự thật, trùng lặp, spam, hoặc vi phạm
            pháp luật.
          </p>
          <p>
            Chúng tôi có quyền kiểm duyệt, tạm ẩn hoặc gỡ bỏ những tin đăng vi phạm
            quy định mà không cần báo trước.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">4. Gói dịch vụ và thanh toán</h2>
          <p>
            Một số dịch vụ đăng tin, đẩy tin và hiển thị ưu tiên là dịch vụ có phí.
            Chi tiết gói cước, thời hạn và quyền lợi được nêu tại trang Bảng giá và
            Quy chế đăng tin. Các khoản phí đã thanh toán để kích hoạt gói dịch vụ
            sẽ không được hoàn lại, trừ trường hợp có thỏa thuận khác.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">5. Quyền sở hữu nội dung</h2>
          <p>
            Giao diện, thương hiệu và mã nguồn của website thuộc quyền sở hữu của
            Nguồn Nhà Đất Việt Nam. Nội dung tin đăng do người dùng cung cấp; khi
            đăng tin, bạn cho phép website hiển thị và quảng bá nội dung đó nhằm phục
            vụ mục đích giao dịch bất động sản.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">6. Giới hạn trách nhiệm</h2>
          <p>
            Website là nền tảng kết nối người mua, người thuê với người bán, người
            cho thuê và nhà môi giới. Chúng tôi không phải là một bên trong giao dịch
            và không chịu trách nhiệm về các thỏa thuận, tranh chấp phát sinh giữa
            các bên. Người dùng cần tự thẩm định thông tin và pháp lý trước khi giao
            dịch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">7. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản sử dụng theo thời gian để phù hợp
            với hoạt động dịch vụ và quy định pháp luật. Phiên bản mới sẽ có hiệu lực
            ngay khi được đăng tải trên website.
          </p>
        </section>

        <p className="text-sm text-ink-soft/80">
          Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua
          trang Trợ giúp.
        </p>
      </div>
    </div>
  );
}

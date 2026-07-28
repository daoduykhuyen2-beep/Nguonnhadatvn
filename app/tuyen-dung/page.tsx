import { createClient } from "@/lib/supabase/server";
import RecruitmentForm from "@/components/RecruitmentForm";

export const metadata = { title: "Tuyển dụng" };
export const revalidate = 120;

export default async function TuyenDung() {
  const supabase = await createClient();
  const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
  const jobs = data || [];

  return (
    <div className="container-app max-w-5xl py-12">
      {/* Hero */}
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Cơ hội nghề nghiệp</p>
        <h1 className="section-title mt-2">Gia nhập đội ngũ Nguồn Nhà Đất Việt Nam</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
          Chúng tôi đang tìm những chuyên viên môi giới và cộng tác viên máu lửa, muốn làm nghề bài bản
          và có thu nhập xứng đáng. Điểm khác biệt lớn nhất: bạn không phải vất vả tự đi tìm hàng —
          Nguồn Nhà Đất đã có sẵn kho hàng chục nghìn tin bất động sản thật trên toàn quốc, giúp bạn tập
          trung vào việc quan trọng nhất là phục vụ khách và chốt giao dịch.
        </p>
        <a href="#vi-tri" className="mt-5 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
          Xem vị trí đang tuyển →
        </a>
      </div>

      {/* Stats */}
      <section className="mt-12">
        <h2 className="text-center text-xl font-bold text-ink">Vì sao chọn Nguồn Nhà Đất?</h2>
        <p className="mb-5 mt-1 text-center text-ink-muted">Cơ chế minh bạch — quyền lợi thật</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="card p-5 text-center">
            <div className="text-2xl font-extrabold text-brand">1,5–3%</div>
            <p className="mt-2 text-sm text-ink-soft">Hoa hồng trên giá trị giao dịch, theo mặt bằng thị trường.</p>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-extrabold text-brand">27.000+</div>
            <p className="mt-2 text-sm text-ink-soft">Tin bất động sản có sẵn trong kho, không phải tự đi kiếm hàng.</p>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-extrabold text-brand">Nhanh</div>
            <p className="mt-2 text-sm text-ink-soft">Chi trả hoa hồng gọn gàng, rõ ràng ngay sau khi giao dịch hoàn tất.</p>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-extrabold text-brand">0đ</div>
            <p className="mt-2 text-sm text-ink-soft">Không thu phí đầu vào — hỗ trợ marketing và đào tạo miễn phí.</p>
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">Cơ chế hoa hồng</h2>
        <p className="mb-4 mt-1 text-ink-muted">Rõ ràng như thị trường, không mập mờ</p>
        <div className="card space-y-3 p-6 text-ink-soft">
          <p><b className="text-ink">Hoa hồng 1,5% – 3% giá trị giao dịch.</b> Mức hoa hồng thay đổi theo từng
            sản phẩm và hiệu suất: giao dịch thứ cấp thông thường quanh mức 1,5–2%, các thương vụ giá trị lớn
            hoặc do bạn tự phát triển nguồn khách có thể lên tới 3%.</p>
          <p>Cơ chế chia áp dụng theo chuẩn thị trường: cộng tác viên và chuyên viên giữ phần lớn hoa hồng,
            phần còn lại công ty dùng để vận hành marketing, chăm data, hỗ trợ pháp lý và xây dựng thương hiệu
            chung — nghĩa là bạn được đứng trên vai cả một hệ thống thay vì đơn thương độc mã.</p>
          <p>Càng đóng góp nhiều — tự phát triển nguồn hàng, nguồn khách — tỷ lệ bạn nhận càng cao. Minh bạch,
            có bảng tính rõ ràng trước mỗi thương vụ.</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">Quyền lợi khi gia nhập</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="card p-5">
            <h3 className="font-semibold text-ink">✓ Kho hàng sẵn hàng chục nghìn tin</h3>
            <p className="mt-2 text-sm text-ink-soft">Không tốn chi phí tự đi tìm hàng — nguồn bất động sản thật, pháp lý rõ ràng, sẵn sàng dẫn khách.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">✓ Hỗ trợ marketing & data khách</h3>
            <p className="mt-2 text-sm text-ink-soft">Được cung cấp công cụ đăng tin đa kênh, hỗ trợ chạy quảng cáo và chia sẻ nguồn khách quan tâm.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">✓ Đào tạo bài bản, chú trọng pháp lý</h3>
            <p className="mt-2 text-sm text-ink-soft">Học cách kiểm tra sổ, quy hoạch, tranh chấp — kỹ năng giúp bạn tư vấn uy tín và chốt deal an toàn.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">✓ Lộ trình thăng tiến rõ ràng</h3>
            <p className="mt-2 text-sm text-ink-soft">Từ cộng tác viên đến chuyên viên rồi trưởng nhóm. Năng lực tới đâu, vị trí và thu nhập tới đó.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">✓ Chi trả hoa hồng nhanh, minh bạch</h3>
            <p className="mt-2 text-sm text-ink-soft">Có bảng tính trước mỗi thương vụ, thanh toán gọn gàng sau khi giao dịch hoàn tất.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">✓ Môi trường làm nghề tử tế</h3>
            <p className="mt-2 text-sm text-ink-soft">Làm thật, nói thật, không tin ảo giá ảo — xây dựng sự nghiệp lâu dài bằng uy tín.</p>
          </div>
        </div>
      </section>

      {/* Positions */}
      <section id="vi-tri" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-bold text-ink">Các vị trí đang tuyển</h2>
        <p className="mb-4 mt-1 text-ink-muted">Nhiều lựa chọn — toàn thời gian, bán thời gian, thực tập</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <h3 className="font-bold text-ink">Chuyên viên môi giới bất động sản</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Tư vấn và dẫn khách xem sản phẩm có sẵn trong kho, chốt giao dịch. Hoa hồng 1,5–3%, thu nhập theo năng lực. Ưu tiên ứng viên có kinh nghiệm.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="font-bold text-ink">Cộng tác viên môi giới</h3>
                <span className="chip mt-1 inline-block">Bán thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Chủ động thời gian, phù hợp người đang đi làm hoặc sinh viên muốn có thêm thu nhập từ hoa hồng.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="font-bold text-ink">Trưởng nhóm kinh doanh</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Dẫn dắt đội sale, chia sẻ nguồn hàng và kinh nghiệm. Yêu cầu kinh nghiệm BĐS và khả năng quản lý đội.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <h3 className="font-bold text-ink">Nhân viên Telesales / CSKH</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Gọi điện, chăm sóc data khách quan tâm, đặt lịch xem nhà cho đội môi giới. Lương cứng cộng thưởng.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📣</span>
              <div>
                <h3 className="font-bold text-ink">Nhân viên Marketing</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Sáng tạo nội dung, chạy quảng cáo Facebook/TikTok, quản lý fanpage. Phù hợp người mê digital.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="font-bold text-ink">Nhân viên pháp lý / hồ sơ</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Kiểm tra sổ, soạn hợp đồng, hỗ trợ công chứng sang tên. Ưu tiên người học luật hoặc từng làm hồ sơ nhà đất.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <h3 className="font-bold text-ink">Nhân viên dựng video / thiết kế</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Quay dựng clip bất động sản, cắt reels, thiết kế ấn phẩm. Phù hợp bạn trẻ thạo CapCut, Canva, Premiere.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <h3 className="font-bold text-ink">Thực tập sinh kinh doanh</h3>
                <span className="chip mt-1 inline-block">Thực tập</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Chưa có kinh nghiệm vẫn nhận — được đào tạo từ đầu về sản phẩm, pháp lý và kỹ năng bán hàng.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="font-bold text-ink">Chuyên viên tư vấn đầu tư BĐS</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Tư vấn khách có dòng tiền lớn về cơ hội đầu tư, dòng tiền cho thuê và tiềm năng tăng giá theo khu vực.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏘️</span>
              <div>
                <h3 className="font-bold text-ink">Nhân viên phát triển nguồn hàng</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Tìm kiếm, kết nối và chăm sóc chủ nhà để mở rộng kho hàng ký gửi. Phù hợp người quan hệ rộng, chăm chỉ.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗂️</span>
              <div>
                <h3 className="font-bold text-ink">Nhân viên vận hành / hành chính</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Điều phối lịch xem nhà, quản lý dữ liệu kho hàng và giấy tờ nội bộ. Cẩn thận, ngăn nắp, thạo tin học văn phòng.</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-bold text-ink">Quản lý sàn / Giám đốc kinh doanh</h3>
                <span className="chip mt-1 inline-block">Toàn thời gian</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">Xây dựng và điều hành đội ngũ, đặt mục tiêu doanh số, phát triển thị trường khu vực. Dành cho người có kinh nghiệm quản lý.</p>
          </div>
        </div>
      </section>

      {/* Job description & requirements */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink">Công việc & yêu cầu</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-semibold text-ink">📋 Mô tả công việc</h3>
            <p className="mt-2 text-sm text-ink-soft">Tiếp nhận nguồn khách, tư vấn và dẫn khách đi xem sản
              phẩm trong kho, phối hợp các team khảo sát – đàm phán – pháp lý để chốt giao dịch, chăm sóc
              khách sau bán.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">🎯 Yêu cầu</h3>
            <p className="mt-2 text-sm text-ink-soft">Giao tiếp tốt, chăm chỉ, trung thực, có tinh thần cầu
              tiến. Ưu tiên người đã có kinh nghiệm bất động sản — nhưng người mới nhiệt huyết vẫn được đào
              tạo từ đầu.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">🕐 Hình thức</h3>
            <p className="mt-2 text-sm text-ink-soft">Nhận cả toàn thời gian và cộng tác viên bán thời gian.
              Chủ động thời gian, thu nhập theo năng lực.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">📍 Khu vực</h3>
            <p className="mt-2 text-sm text-ink-soft">Làm việc trên toàn quốc, tập trung các thành phố lớn
              và khu vực bạn am hiểu.</p>
          </div>
        </div>
      </section>

      {/* Jobs from DB (if any) */}
      {jobs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">Tin tuyển dụng mới nhất</h2>
          <div className="mt-4 space-y-4">
            {jobs.map((j: any) => (
              <div key={j.id} className="card p-5">
                <h3 className="font-bold text-ink">{j.vi_tri}</h3>
                <p className="text-sm text-ink-muted">{j.dia_diem} · {j.loai_hinh}</p>
                {j.mo_ta && <p className="mt-2 whitespace-pre-line text-ink-soft">{j.mo_ta}</p>}
                {j.hoa_hong && <p className="mt-2 chip">Hoa hồng: {j.hoa_hong}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Apply form */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-ink">Sẵn sàng gia nhập?</h2>
        <p className="mb-4 mt-1 text-ink-muted">
          Để lại thông tin bên dưới, bộ phận tuyển dụng sẽ liên hệ tư vấn về vị trí, cơ chế hoa hồng và lộ
          trình đào tạo — hoàn toàn miễn phí.
        </p>
        <RecruitmentForm />
      </section>
    </div>
  );
}

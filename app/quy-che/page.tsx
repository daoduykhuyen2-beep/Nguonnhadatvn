export const metadata = {
  title: "Quy chế đăng tin - Nguồn Nhà Đất Việt Nam",
  description: "Quy chế và quy định đăng tin bất động sản trên Nguồn Nhà Đất Việt Nam.",
};

const intro = "Mọi quy định của website đều nhằm mục đích tốt cho cả người mua/thuê và người bán/cho thuê, vì đây là nguồn khách hàng của các cá nhân và nhà môi giới. Mong quý thành viên đăng tin có tính xây dựng, trung thực để website ngày càng phát triển.";

const displayRules = [
  ["Gói Đăng Tin Thoải Mái - 199.000đ / 30 ngày", "Gói dành cho môi giới và chủ nhà: đăng tin bất động sản KHÔNG GIỚI HẠN số lượng trong 30 ngày, tặng kèm 30 lượt đẩy tin lên đầu danh sách. Giá ưu đãi 199.000đ (giá gốc 399.000đ). Xem chi tiết tại trang Bảng giá."],
  ["Tin hiển thị ngay - không chờ duyệt", "Khi đăng bằng gói trả phí, tin của bạn được hiển thị ngay sau khi đăng mà không phải chờ kiểm duyệt. Bộ phận soát tin sẽ kiểm tra lại các tin này sau; tin vi phạm quy định vẫn có thể bị gỡ hoặc khóa tài khoản."],
  ["Tin VIP Vàng - 49.000đ / 15 ngày", "Nâng 1 tin lên hạng VIP Vàng trong 15 ngày: hiển thị ưu tiên phía trên tin thường, gắn nhãn nổi bật thu hút nhiều khách xem hơn."],
  ["Tin Kim Cương - 99.000đ / 15 ngày", "Nâng 1 tin lên hạng Kim Cương (hạng cao nhất) trong 15 ngày: vị trí hiển thị cao nhất - trên cả tin VIP Vàng, khung nổi bật cao cấp gắn nhãn Kim Cương, tiếp cận tối đa khách hàng tiềm năng."],
  ["Gói Xem Kho Nhà Toàn Quốc - 299.000đ / 30 ngày", "Mở khóa toàn bộ kho hơn 20.000 căn nhà phố đang bán trên cả nước trong 30 ngày: xem đầy đủ địa chỉ, giá bán thật, diện tích, hình ảnh và video thực tế của từng căn. Giá ưu đãi 299.000đ (giá gốc 2.999.000đ)."],
  ["Thanh toán và kích hoạt", "Thanh toán nhanh qua chuyển khoản, gói dịch vụ được kích hoạt tự động sau khi thanh toán thành công. Mọi mức giá và thời hạn được công bố công khai tại trang Bảng giá."],
  ];

const rejectReasons = [
  "Nội dung không có dấu, mô tả không chi tiết hoặc chứa tag từ khóa.",
  "Nội dung hoặc hình ảnh chứa đường dẫn đến website khác.",
  "Nội dung chứa quảng cáo dịch vụ khác không liên quan đến tài sản đang rao.",
  "Địa chỉ tài sản không đúng hoặc không hợp lệ (tối thiểu phải có tên đường, tên tổ, xóm hoặc ấp).",
  "Nội dung chứa số điện thoại (không được để số điện thoại trong nội dung tin đăng).",
  "Đăng sai loại bất động sản.",
  "Mức giá không đúng (giá phải đúng thực tế giá bán, không đăng giá trả trước).",
  "Hình ảnh không đúng với nội dung (phải đăng ảnh thật của tài sản hoặc không sử dụng ảnh).",
  "Chọn sai hoặc không chọn dự án.",
  "Tên liên hệ không hợp lệ (phải là tên cá nhân hoặc doanh nghiệp).",
  "Tên liên hệ trong nội dung không giống tên trong ô người liên hệ.",
  "Số điện thoại không hợp lệ.",
  "Số điện thoại trong nội dung không giống số trong ô liên hệ.",
  "Giả chính chủ trong tin đăng.",
  "Đăng lại tin cũ (đăng trùng tin).",
  "Đăng nhiều tài sản trong 1 tin.",
  "Không duyệt ngẫu nhiên một vài tin để xác minh tính hiện hữu của tài sản, tránh tin ảo.",
  ];

const lockRules = [
  ["Đăng tin không đúng sự thật", "Đăng tin nhưng khi khách hàng liên hệ thì báo tài sản đã giao dịch và hướng khách sang tài sản khác, hoặc thông tin trong tin đăng không đúng thực tế (giá, hình ảnh, địa chỉ). Nếu phát hiện tin đã giao dịch nhưng không xóa hoặc cố tình đăng tin không đúng sự thật, chúng tôi sẽ khóa tài khoản vĩnh viễn.", []],
  ["Đăng lại tin cũ (đăng trùng tin)", "Đăng lại tài sản mà chính thành viên đó đã đăng trước đó khiến nội dung website bị trùng lặp. Vui lòng sử dụng chức năng Làm mới để up tin lên đầu trang.", [["Lần 1", "Khóa lần 1 (liên hệ ban quản trị để mở khóa)"], ["Lần 2", "Không duyệt tất cả các tin + Khóa lần 2"], ["Lần 3", "Khóa vĩnh viễn + Xóa toàn bộ bài viết"]]],
  ["Đăng trùng nội dung với thành viên khác", "Sao chép giống 70% nội dung tin đăng của thành viên khác đã đăng trước đó khiến tin bị Google đánh giá thấp và ảnh hưởng đến độ tín nhiệm của website. Thành viên nên soạn nội dung riêng cho mỗi tài sản.", [["Lần 1", "Không duyệt tin"], ["Nhiều lần", "Không duyệt tất cả các tin + Khóa lần 1"], ["Cố tình", "Khóa vĩnh viễn + Xóa toàn bộ bài viết"]]],
  ["Đăng nhiều tin cùng 1 dự án", "Việc một thành viên đăng nhiều tin về cùng 1 dự án khiến nội dung trùng lặp, gây khó khăn cho người tìm mua. Nên đăng duy nhất 1 tin bằng chức năng Đăng tin dự án, cập nhật lại tin đã đăng thay vì tạo tin mới.", [["Lần 1", "Khóa lần 1"], ["Lần 2", "Khóa lần 2 + Không duyệt tất cả các tin"], ["Lần 3", "Khóa vĩnh viễn + Xóa toàn bộ bài viết"]]],
  ["Tạo nhiều tài khoản để đăng lại tin cũ", "Cho phép một cá nhân tạo nhiều tài khoản để đăng các tin khác nhau, nhưng không cho phép tạo nhiều tài khoản để đăng lại các tài sản cũ đã đăng trước đó nhằm tránh trùng lặp nội dung.", [["Lần 1", "Khóa lần 1 (khóa tài khoản mới tạo)"], ["Lần 2", "Khóa lần 2 (khóa toàn bộ tài khoản)"]]],
  ["Sử dụng chức năng Up tin tự động", "Việc dùng phần mềm Up tin tự động liên tục khiến máy chủ quá tải, ảnh hưởng tốc độ website và toàn bộ người dùng. Vì vậy không cho phép sử dụng phần mềm Up tin tự động.", [["Lần 1", "Khóa lần 1"], ["Lần 2", "Khóa lần 2 + Không duyệt tất cả các tin"], ["Lần 3", "Khóa vĩnh viễn + Xóa toàn bộ bài viết"]]],
  ["Không xóa các tin đã giao dịch", "Việc không xóa các tin đã giao dịch khiến khách hàng mất niềm tin vào chất lượng nội dung website. Thành viên vui lòng xóa các tin đã giao dịch.", [["Lần 1", "Khóa lần 1"], ["Lần 2", "Khóa lần 2 + Không duyệt tất cả các tin"], ["Lần 3", "Khóa vĩnh viễn + Xóa toàn bộ bài viết"]]],
  ["Không liên lạc được với người đăng", "Các tin đang hiển thị nhưng khách hàng không liên lạc được, nhân viên sẽ liên hệ lại 3 ngày liên tiếp; nếu vẫn không liên lạc được sẽ tiến hành khóa tài khoản.", [["Lần 1", "Khóa lần 1 + Không duyệt tất cả các tin"], ["Lần 2", "Khóa lần 2 + Không duyệt tất cả các tin"], ["Lần 3", "Khóa vĩnh viễn + Xóa toàn bộ bài viết"]]],
  ];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function levelBadge(i: number) {
  const colors = ["bg-amber-100 text-amber-800", "bg-orange-100 text-orange-800", "bg-red-100 text-red-700"];
  return colors[Math.min(i, colors.length - 1)];
}

function buildHtml() {
  let h = "";

h += '<div class="rounded-2xl bg-gradient-to-r from-rose-500 to-red-400 px-6 py-10 text-white shadow-lg">';
  h += '<p class="text-sm font-medium uppercase tracking-wide text-rose-100">Nguồn Nhà Đất Việt Nam</p>';
  h += '<h1 class="mt-2 text-3xl font-bold leading-tight">Quy chế đăng tin</h1>';
  h += '<p class="mt-3 max-w-2xl text-rose-50 leading-relaxed">' + esc(intro) + "</p>";
  h += "</div>";

h += '<section class="mt-10">';
  h += '<div class="flex items-center gap-3"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 font-bold text-white">A</span>';
  h += '<h2 class="text-xl font-bold text-gray-900">Quy định về gói dịch vụ và hiển thị tin đăng</h2></div>';
  h += '<div class="mt-5 grid gap-4 sm:grid-cols-2">';
  let n = 1;
  for (const r of displayRules) {
    h += '<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">';
    h += '<div class="flex items-start gap-3"><span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-rose-600">' + n + "</span>";
    h += "<div><h3 class=\"font-semibold text-gray-900\">" + esc(r[0] as string) + "</h3>";
    h += '<p class="mt-1 text-sm text-gray-600 leading-relaxed">' + esc(r[1] as string) + "</p></div></div></div>";
    n++;
  }
  h += "</div></section>";

h += '<section class="mt-12">';
  h += '<div class="flex items-center gap-3"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 font-bold text-white">B</span>';
  h += '<h2 class="text-xl font-bold text-gray-900">Những lý do khiến tin không được duyệt hoặc bị xóa</h2></div>';
  h += '<div class="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">';
  h += '<ol class="grid gap-x-8 gap-y-3 sm:grid-cols-2">';
  let m = 1;
  for (const r of rejectReasons) {
    h += '<li class="flex gap-3 text-sm text-gray-700 leading-relaxed"><span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">' + m + "</span><span>" + esc(r) + "</span></li>";
    m++;
  }
  h += "</ol></div>";
  h += '<div class="mt-4 rounded-xl border-l-4 border-rose-400 bg-rose-50 p-4 text-sm text-rose-900 leading-relaxed">Trường hợp vô tình vi phạm, bộ phận kiểm duyệt sẽ chủ động sửa tin giúp thành viên; nếu cố tình vi phạm nhiều lần sẽ không duyệt hoặc khóa tài khoản tùy theo số lần vi phạm.</div>';
  h += "</section>";

h += '<section class="mt-12">';
  h += '<div class="flex items-center gap-3"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 font-bold text-white">C</span>';
  h += '<h2 class="text-xl font-bold text-gray-900">Những lý do khiến tài khoản bị khóa</h2></div>';
  h += '<div class="mt-5 space-y-4">';
  let k = 1;
  for (const r of lockRules) {
    h += '<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">';
    h += '<div class="flex items-start gap-3"><span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">' + k + "</span>";
    h += '<div class="flex-1"><h3 class="font-semibold text-gray-900">' + esc(r[0] as string) + "</h3>";
    h += '<p class="mt-1 text-sm text-gray-600 leading-relaxed">' + esc(r[1] as string) + "</p>";
    const levels = r[2] as string[][];
    if (levels && levels.length) {
      h += '<div class="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">';
      let li = 0;
      for (const lv of levels) {
        h += '<div class="flex items-center gap-2 rounded-lg ' + levelBadge(li) + ' px-3 py-1.5 text-xs font-medium"><span class="font-bold">' + esc(lv[0]) + "</span><span>" + esc(lv[1]) + "</span></div>";
        li++;
      }
      h += "</div>";
    } else {
      h += '<div class="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">Khóa tài khoản vĩnh viễn</div>';
    }
    h += "</div></div></div>";
    k++;
  }
  h += "</div></section>";

h += '<div class="mt-12 rounded-2xl bg-gray-900 px-6 py-8 text-center text-white">';
  h += '<p class="text-lg font-semibold">Xin cảm ơn sự hợp tác của Quý thành viên!</p>';
  h += '<p class="mt-2 text-sm text-gray-300">Nguồn Nhà Đất Việt Nam luôn nỗ lực xây dựng một cộng đồng bất động sản uy tín và minh bạch.</p>';
  h += "</div>";

return h;
}

export default function QuyChePage() {
  return (
    <div className="container-app max-w-5xl py-12">
    <div dangerouslySetInnerHTML={{ __html: buildHtml() }} />
    </div>
    );
}
</div>

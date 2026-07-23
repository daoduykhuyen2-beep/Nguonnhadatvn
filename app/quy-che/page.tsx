// deploy trigger: dong bo mau xanh la hero
export const metadata = {
    title: "Quy chế đăng tin - Nguồn Nhà Đất Việt Nam",
    description: "Quy chế, gói dịch vụ và quy định đăng tin bất động sản trên Nguồn Nhà Đất Việt Nam.",
};

const intro = "Mọi quy định của website đều nhằm mục đích tốt cho cả người mua/thuê và người bán/cho thuê, vì đây là nguồn khách hàng của các cá nhân và nhà môi giới. Mong quý thành viên đăng tin có tính xây dựng, trung thực để website ngày càng phát triển.";

const packages = [
    ["Gói Đăng Tin Thoải Mái", "199.000đ", "399.000đ", "30 ngày", "Đăng tin không giới hạn + tặng 30 lượt đẩy tin lên đầu, tin hiển thị ngay không chờ duyệt.", true],
    ["Tin VIP Vàng", "49.000đ", "", "15 ngày", "Nâng 1 tin lên hạng VIP Vàng, hiển thị ưu tiên phía trên tin thường, gắn nhãn nổi bật.", false],
    ["Tin Kim Cương", "99.000đ", "", "15 ngày", "Nâng 1 tin lên hạng cao nhất, vị trí trên cả VIP Vàng, khung nổi bật cao cấp.", false],
    ["Gói Xem Kho Nhà Toàn Quốc", "299.000đ", "2.999.000đ", "30 ngày", "Mở khóa hơn 20.000 nhà phố toàn quốc: địa chỉ, giá thật, hình ảnh và video thực tế.", false],
  ];

const displayRules = [
    ["Đăng tin hiển thị ngay", "Khi đăng bằng gói trả phí, tin của bạn hiển thị ngay sau khi đăng mà không phải chờ kiểm duyệt. Bộ phận soát tin sẽ kiểm tra lại sau."],
    ["Thanh toán và kích hoạt", "Thanh toán nhanh qua chuyển khoản, gói dịch vụ được kích hoạt tự động sau khi thanh toán thành công."],
    ["Đẩy tin lên đầu", "Gói Đăng Tin Thoải Mái tặng 30 lượt đẩy tin, giúp tin của bạn quay lại đầu danh sách, tiếp cận nhiều khách hơn mỗi ngày."],
    ["Minh bạch giá", "Mọi mức giá và thời hạn đều được công bố công khai tại trang Bảng giá, không phát sinh chi phí ẩn."],
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
    ["Đăng tin không đúng sự thật", "Đăng tin nhưng khi khách hàng liên hệ thì báo tài sản đã giao dịch và hướng khách sang tài sản khác, hoặc thông tin trong tin đăng không đúng thực tế (giá, hình ảnh, địa chỉ). Nếu cố tình đăng tin không đúng sự thật, chúng tôi sẽ khóa tài khoản vĩnh viễn.", [["Vi phạm", "Khóa tài khoản vĩnh viễn"]]],
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

function sectionHead(letter: string, id: string, title: string) {
    return '<div id="' + id + '" class="scroll-mt-24 flex items-center gap-3"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">' + letter + '</span><h2 class="text-xl font-bold text-gray-900">' + esc(title) + '</h2></div>';
}

function buildHtml() {
    let h = '<div class="rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-6 py-12 text-white shadow-sm">';
    h += '<span class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Nguồn Nhà Đất Việt Nam</span>';
    h += '<h1 class="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Quy chế đăng tin</h1>';
    h += '<p class="mt-3 max-w-2xl text-green-50 leading-relaxed">' + esc(intro) + '</p>';
    h += '<div class="mt-6 flex flex-wrap gap-3">';
    h += '<a href="/bang-gia" class="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50">Xem bảng giá dịch vụ</a>';
    h += '<a href="/dang-tin" class="rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Đăng tin ngay</a>';
    h += '</div></div>';

  h += '<nav class="mt-6 flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">';
    const toc = [["#goi-dich-vu", "Gói dịch vụ & bảng giá"], ["#quy-dinh", "Quy định hiển thị tin"], ["#khong-duyet", "Lý do tin bị từ chối"], ["#khoa-tk", "Lý do khóa tài khoản"]];
    for (const t of toc) {
          h += '<a href="' + t[0] + '" class="rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700">' + esc(t[1]) + '</a>';
    }
    h += '</nav>';

  h += '<section class="mt-10">';
    h += sectionHead("A", "goi-dich-vu", "Gói dịch vụ & bảng giá");
    h += '<div class="mt-5 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">';
    h += '<table class="w-full border-collapse text-left text-sm">';
    h += '<thead class="bg-gray-50 text-gray-600"><tr>';
    h += '<th class="px-4 py-3 font-semibold">Gói dịch vụ</th><th class="px-4 py-3 font-semibold">Giá</th><th class="px-4 py-3 font-semibold">Thời hạn</th><th class="hidden px-4 py-3 font-semibold sm:table-cell">Quyền lợi</th>';
    h += '</tr></thead><tbody>';
    for (const p of packages) {
          const popular = p[5] as unknown as boolean;
          h += '<tr class="border-t border-gray-100 ' + (popular ? "bg-green-50/60" : "bg-white") + '">';
          h += '<td class="px-4 py-4 align-top"><div class="font-semibold text-gray-900">' + esc(p[0] as string) + '</div>';
          if (popular) h += '<span class="mt-1 inline-block rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">Phổ biến</span>';
          h += '</td>';
          h += '<td class="px-4 py-4 align-top"><div class="font-bold text-green-700">' + esc(p[1] as string) + '</div>';
          if (p[2]) h += '<div class="text-xs text-gray-400 line-through">' + esc(p[2] as string) + '</div>';
          h += '</td>';
          h += '<td class="px-4 py-4 align-top text-gray-700">' + esc(p[3] as string) + '</td>';
          h += '<td class="hidden px-4 py-4 align-top text-gray-600 leading-relaxed sm:table-cell">' + esc(p[4] as string) + '</td>';
          h += '</tr>';
    }
    h += '</tbody></table></div>';
    h += '<div class="mt-4 text-center"><a href="/bang-gia" class="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700">Xem chi tiết bảng giá &rarr;</a></div>';
    h += '</section>';

  h += '<section class="mt-12">';
    h += sectionHead("B", "quy-dinh", "Quy định về hiển thị tin đăng");
    h += '<div class="mt-6 grid gap-4 sm:grid-cols-2">';
    let n = 1;
    for (const r of displayRules) {
          h += '<div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">';
          h += '<div class="flex items-start gap-3"><span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">' + n + '</span>';
          h += '<div><h3 class="font-semibold text-gray-900">' + esc(r[0]) + '</h3>';
          h += '<p class="mt-1 text-sm text-gray-600 leading-relaxed">' + esc(r[1]) + '</p></div></div></div>';
          n++;
    }
    h += '</div></section>';

  h += '<section class="mt-12">';
    h += sectionHead("C", "khong-duyet", "Những lý do khiến tin không được duyệt hoặc bị xóa");
    h += '<div class="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">';
    h += '<ol class="grid gap-x-8 gap-y-3 sm:grid-cols-2">';
    let k = 1;
    for (const r of rejectReasons) {
          h += '<li class="flex gap-3 text-sm text-gray-700 leading-relaxed"><span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">' + k + '</span><span>' + esc(r) + '</span></li>';
          k++;
    }
    h += '</ol></div>';
    h += '<div class="mt-4 rounded-xl border-l-4 border-green-500 bg-green-50 p-4 text-sm text-green-900 leading-relaxed">Trường hợp vô tình vi phạm, bộ phận kiểm duyệt sẽ chủ động sửa tin giúp thành viên; nếu cố tình vi phạm nhiều lần sẽ không duyệt hoặc khóa tài khoản tùy theo số lần vi phạm.</div>';
    h += '</section>';

  h += '<section class="mt-12">';
    h += sectionHead("D", "khoa-tk", "Những lý do khiến tài khoản bị khóa");
    h += '<div class="mt-5 space-y-4">';
    let m = 1;
    for (const l of lockRules) {
          h += '<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">';
          h += '<div class="flex items-start gap-3"><span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">' + m + '</span>';
          h += '<div class="flex-1"><h3 class="font-semibold text-gray-900">' + esc(l[0] as string) + '</h3>';
          h += '<p class="mt-1 text-sm text-gray-600 leading-relaxed">' + esc(l[1] as string) + '</p>';
          const levels = l[2] as unknown as string[][];
          h += '<div class="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">';
          let j = 0;
          for (const lv of levels) {
                  h += '<div class="flex items-center gap-2 rounded-lg ' + levelBadge(j) + ' px-3 py-1.5 text-xs font-medium"><span class="font-bold">' + esc(lv[0]) + '</span><span>' + esc(lv[1]) + '</span></div>';
                  j++;
          }
          h += '</div></div></div></div>';
          m++;
    }
    h += '</div></section>';

  h += '<div class="mt-12 rounded-3xl bg-gray-900 px-6 py-10 text-center text-white sm:px-10">';
    h += '<p class="text-xl font-bold">Xin cảm ơn sự hợp tác của Quý thành viên!</p>';
    h += '<p class="mt-2 text-sm text-gray-300 mx-auto max-w-xl leading-relaxed">Nguồn Nhà Đất Việt Nam luôn nỗ lực xây dựng một cộng đồng bất động sản minh bạch, uy tín và chất lượng cho mọi thành viên.</p>';
    h += '<div class="mt-6 flex flex-wrap justify-center gap-3">';
    h += '<a href="/bang-gia" class="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">Chọn gói dịch vụ</a>';
    h += '<a href="/tro-giup" class="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Cần hỗ trợ?</a>';
    h += '</div></div>';
    return h;
}

export default function QuyChePage() {
    return <div className="container-app max-w-5xl py-12"><div dangerouslySetInnerHTML={{ __html: buildHtml() }} /></div>;
}
</div>

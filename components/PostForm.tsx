"use client";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import ImageMultiUploadField from "@/components/ImageMultiUploadField";
import type { Post } from "@/lib/types";

const TINH = ["An Giang","Bà Rịa - Vũng Tàu","Bạc Liêu","Bắc Giang","Bắc Kạn","Bắc Ninh","Bến Tre","Bình Dương","Bình Định","Bình Phước","Bình Thuận","Cà Mau","Cao Bằng","Cần Thơ","Đà Nẵng","Đắk Lắk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","Hà Nội","Hà Tĩnh","Hải Dương","Hải Phòng","Hậu Giang","Hòa Bình","Hưng Yên","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hóa","Thừa Thiên Huế","Tiền Giang","TP. Hồ Chí Minh","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"];
const LOAI = [
  { label: "Nhà phố", value: "nha_pho" },
  { label: "Nhà thổ cư", value: "tho_cu" },
  { label: "Căn hộ", value: "can_ho" },
  { label: "Dự án / Đất nền", value: "du_an" },
];
const GIAO_DICH = [
  { label: "Bán", value: "ban" },
  { label: "Cho thuê", value: "thue" },
];

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-700";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang lưu…" : label}</button>;
}

type Props = {
  action: (prev: any, fd: FormData) => Promise<any>;
  post?: Post;
  submitLabel?: string;
};

export default function PostForm({ action, post, submitLabel = "Đăng tin" }: Props) {
  const [state, formAction] = useActionState(action, {} as any);
  const anh: string[] = (post?.anh as string[]) || [];
  const [loai, setLoai] = useState<string>(post?.loai || "");
  const [giaoDich, setGiaoDich] = useState<string>((post as any)?.giao_dich || "ban");
  const [gia, setGia] = useState<string>(post?.gia || "");
  const isRent = giaoDich === "thue";
  return (
    <form action={formAction} className="space-y-6">
      {state?.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Thông tin cơ bản</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Tiêu đề *</label>
            <input name="title" defaultValue={post?.title || ""} required className={inputCls} placeholder="VD: Bán nhà phố 4x16 hẻm xe hơi Quận 7" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Giao dịch</label>
              <select name="giao_dich" value={giaoDich} onChange={(e) => setGiaoDich(e.target.value)} className={inputCls}>
                {GIAO_DICH.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Loại BĐS</label>
              <select name="loai" value={loai} onChange={(e) => setLoai(e.target.value)} className={inputCls}>
                <option value="">-- Chọn loại --</option>
                {LOAI.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Giá</label>
              <input name="gia" value={gia} onChange={(e) => setGia(e.target.value)} className={inputCls} placeholder={isRent ? "VD: 8 triệu/tháng" : "VD: 5.2 tỷ"} />
            <p className="mt-1 text-xs text-neutral-400">{isRent ? "Nhà cho thuê: nhập giá theo tháng (VD: 8 triệu/tháng), không tính theo tỷ." : "Nhà bán: có thể nhập theo tỷ (VD: 5.2 tỷ) hoặc theo triệu."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Vị trí</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Tỉnh / Thành phố</label>
            <select name="quan" defaultValue={post?.quan || ""} className={inputCls}>
              <option value="">-- Chọn --</option>
              {TINH.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Phường / Xã</label><input name="phuong" defaultValue={post?.phuong || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Đường</label><input name="duong" defaultValue={post?.duong || ""} className={inputCls} /></div>
            <div><label className={labelCls}>Số nhà <span className="text-xs text-neutral-400">(chỉ hội viên Đối tác xem được)</span></label><input name="so_nha" defaultValue={(post as any)?.so_nha || ""} className={inputCls} placeholder="VD: 123/45" /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Diện tích & Kết cấu</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div><label className={labelCls}>Diện tích (m²)</label><input name="dien_tich" defaultValue={post?.dien_tich || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Chiều ngang (m)</label><input name="chieu_ngang" defaultValue={post?.chieu_ngang || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Chiều dài (m)</label><input name="chieu_dai" defaultValue={post?.chieu_dai || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Số tầng</label><input name="so_tang" defaultValue={post?.so_tang || ""} className={inputCls} /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Mô tả & Media</h2>
        <div className="space-y-4">
          <div><label className={labelCls}>Mô tả chi tiết</label><textarea name="mota" defaultValue={post?.mota || ""} rows={5} className={inputCls} placeholder="Mô tả chi tiết về bất động sản…" /></div>
          <div><label className={labelCls}>Link video (YouTube)</label><input name="video" defaultValue={post?.video || ""} className={inputCls} placeholder="https://youtube.com/…" /></div>
          <div><label className={labelCls}>Hình ảnh</label><ImageMultiUploadField initial={anh} /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Thông tin liên hệ</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelCls}>Tên liên hệ</label><input name="contact_name" defaultValue={post?.contact_name || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Số điện thoại *</label><input name="contact_phone" defaultValue={post?.contact_phone || ""} required className={inputCls} /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-neutral-900">Nâng cấp tin</h2>
        <p className="mb-4 text-sm text-neutral-500">Đưa tin lên hạng cao hơn để tiếp cận nhiều khách hơn. Áp dụng trong 30 ngày, sau đó tự động về tin thường.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="relative flex cursor-pointer flex-col rounded-xl border border-neutral-200 p-4 transition hover:border-brand has-[:checked]:border-brand has-[:checked]:ring-1 has-[:checked]:ring-brand/40">
            <input type="radio" name="nang_cap" value="thuong" defaultChecked className="absolute right-3 top-3 accent-brand" />
            <span className="text-sm font-semibold text-neutral-900">Tin thường</span>
            <span className="mt-1 text-xs text-neutral-500">Đăng miễn phí</span>
            <span className="mt-2 text-lg font-bold text-neutral-900">0đ</span>
          </label>
          <label className="relative flex cursor-pointer flex-col rounded-xl border border-neutral-200 p-4 transition hover:border-brand has-[:checked]:border-brand has-[:checked]:ring-1 has-[:checked]:ring-brand/40">
            <input type="radio" name="nang_cap" value="tin_vip_49" className="absolute right-3 top-3 accent-brand" />
            <span className="text-sm font-semibold text-amber-600">VIP Vàng</span>
            <span className="mt-1 text-xs text-neutral-500">Nổi bật, ưu tiên hiển thị</span>
            <span className="mt-2 text-lg font-bold text-neutral-900">49.000đ</span>
          </label>
          <label className="relative flex cursor-pointer flex-col rounded-xl border border-neutral-200 p-4 transition hover:border-brand has-[:checked]:border-brand has-[:checked]:ring-1 has-[:checked]:ring-brand/40">
            <input type="radio" name="nang_cap" value="tin_kc_99" className="absolute right-3 top-3 accent-brand" />
            <span className="text-sm font-semibold text-brand-600">Kim Cương</span>
            <span className="mt-1 text-xs text-neutral-500">Cao cấp nhất, hiển thị đầu tiên</span>
            <span className="mt-2 text-lg font-bold text-neutral-900">99.000đ</span>
          </label>
        </div>
        <p className="mt-3 text-xs text-neutral-400">Sau khi đăng, bạn sẽ được chuyển tới trang thanh toán (trừ số dư trước, hoặc chuyển khoản).</p>
      </section>

      <div className="flex justify-end"><Submit label={submitLabel} /></div>
    </form>
  );
}

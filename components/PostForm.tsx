"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import ImageMultiUploadField from "@/components/ImageMultiUploadField";
import type { Post } from "@/lib/types";

const QUAN = ["Quận 1","Quận 2","Quận 3","Quận 4","Quận 5","Quận 6","Quận 7","Quận 8","Quận 9","Quận 10","Quận 11","Quận 12","Bình Thạnh","Phú Nhuận","Gò Vấp","Tân Bình","Tân Phú","Bình Tân","Thủ Đức","Bình Chánh","Nhà Bè","Hóc Môn","Củ Chi"];
const LOAI = ["Nhà phố","Nhà mặt tiền","Nhà hẻm","Biệt thự","Căn hộ","Đất nền","Cho thuê"];

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
              <label className={labelCls}>Loại BĐS</label>
              <select name="loai" defaultValue={post?.loai || ""} className={inputCls}>
                <option value="">-- Chọn loại --</option>
                {LOAI.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Giá</label>
              <input name="gia" defaultValue={post?.gia || ""} className={inputCls} placeholder="VD: 5.2 tỷ" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Vị trí</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Quận / Huyện</label>
            <select name="quan" defaultValue={post?.quan || ""} className={inputCls}>
              <option value="">-- Chọn --</option>
              {QUAN.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Phường / Xã</label><input name="phuong" defaultValue={post?.phuong || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Đường</label><input name="duong" defaultValue={post?.duong || ""} className={inputCls} /></div>
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

      <div className="flex justify-end"><Submit label={submitLabel} /></div>
    </form>
  );
}

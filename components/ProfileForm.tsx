"use client";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "@/app/actions/profile";
import type { Profile } from "@/lib/types";
import AvatarUpload from "@/components/AvatarUpload";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-700";

function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang lưu…" : "Lưu thay đổi"}</button>; }

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfile, {} as any);
  useEffect(() => {}, [state]);
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Ảnh đại diện</h2>
        <AvatarUpload initial={profile.avatar_url} name={profile.full_name} />
      </div>
      <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Thông tin cá nhân</h2>
        {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
        {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã lưu thông tin.</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelCls}>Họ và tên</label><input name="full_name" defaultValue={profile.full_name || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Số điện thoại</label><input name="phone" defaultValue={profile.phone || ""} className={inputCls} /></div>
          <div><label className={labelCls}>Tuổi</label><input name="age" type="number" defaultValue={profile.age || ""} className={inputCls} /></div>
          <div>
            <label className={labelCls}>Giới tính</label>
            <select name="gender" defaultValue={profile.gender || ""} className={inputCls}>
              <option value="">-- Chọn --</option><option value="nam">Nam</option><option value="nu">Nữ</option><option value="khac">Khác</option>
            </select>
          </div>
          <div className="sm:col-span-2"><label className={labelCls}>Địa chỉ</label><input name="address" defaultValue={profile.address || ""} className={inputCls} /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Giới thiệu</label><textarea name="bio" rows={3} defaultValue={profile.bio || ""} className={inputCls} /></div>
        </div>
        <div className="mt-5 flex justify-end"><Save /></div>
      </form>
    </div>
  );
}

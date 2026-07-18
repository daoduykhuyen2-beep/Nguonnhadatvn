"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DangKyPage() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;
  const tooShort = form.password.length > 0 && form.password.length < 6;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (form.password.length < 6) { setErr("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    if (form.password !== form.confirm) { setErr("Mật khẩu xác nhận không khớp."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, phone: form.phone },
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/dang-ky-thanh-cong` : undefined,
      },
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold text-ink">Đăng ký thành công!</h1>
          <p className="mt-2 text-ink-muted">Chúng tôi đã gửi email xác nhận tới <strong>{form.email}</strong>. Vui lòng mở email và bấm vào liên kết xác nhận để kích hoạt tài khoản.</p>
          <Link href="/dang-nhap" className="btn-primary mt-6 inline-flex">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-ink">Tạo tài khoản</h1>
        <p className="mt-1 text-sm text-ink-muted">Miễn phí – chỉ mất một phút.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><label className="label">Họ tên</label><input required className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><label className="label">Số điện thoại</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div>
            <label className="label">Mật khẩu</label>
            <div className="relative">
              <input type={show ? "text" : "password"} required minLength={6} className="input pr-16" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-700 hover:underline">{show ? "Ẩn" : "Hiện"}</button>
            </div>
            {tooShort && <p className="mt-1 text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự.</p>}
          </div>
          <div>
            <label className="label">Xác nhận mật khẩu</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} required className="input pr-16" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-700 hover:underline">{showConfirm ? "Ẩn" : "Hiện"}</button>
            </div>
            {mismatch && <p className="mt-1 text-xs text-red-600">Mật khẩu xác nhận không khớp.</p>}
            {!mismatch && form.confirm.length > 0 && <p className="mt-1 text-xs text-green-600">Mật khẩu khớp.</p>}
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading || mismatch || tooShort} className="btn-primary w-full disabled:opacity-60">{loading ? "Đang tạo..." : "Đăng ký"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-ink-muted">Đã có tài khoản? <Link href="/dang-nhap" className="text-brand-700 hover:underline">Đăng nhập</Link></p>
      </div>
    </div>
  );
}

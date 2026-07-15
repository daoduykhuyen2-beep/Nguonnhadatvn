"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DangKyPage() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, phone: form.phone } },
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
          <p className="mt-2 text-ink-muted">Bạn có thể đăng nhập ngay bây giờ.</p>
          <Link href="/dang-nhap" className="btn-primary mt-6 inline-flex">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-ink">Tạo tài khoản</h1>
        <p className="mt-1 text-sm text-ink-muted">Miễn phí — chỉ mất một phút.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><label className="label">Họ tên</label><input required className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><label className="label">Số điện thoại</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label">Mật khẩu</label><input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Đang tạo..." : "Đăng ký"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-ink-muted">Đã có tài khoản? <Link href="/dang-nhap" className="text-brand-700 hover:underline">Đăng nhập</Link></p>
      </div>
    </div>
  );
}

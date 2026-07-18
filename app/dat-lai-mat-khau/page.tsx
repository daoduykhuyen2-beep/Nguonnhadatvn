"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DatLaiMatKhau() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const mismatch = confirm.length > 0 && password !== confirm;
  const tooShort = password.length > 0 && password.length < 6;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 6) { setErr("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    if (password !== confirm) { setErr("Mật khẩu xác nhận không khớp."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setDone(true);
    setTimeout(() => router.push("/dang-nhap"), 2000);
  }

  if (done) {
    return (
      <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold text-ink">Đổi mật khẩu thành công!</h1>
          <p className="mt-2 text-ink-muted">Đang chuyển bạn tới trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-ink">Đặt lại mật khẩu</h1>
        <p className="mt-1 text-sm text-ink-muted">Nhập mật khẩu mới cho tài khoản của bạn.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Mật khẩu mới</label>
            <div className="relative">
              <input type={show ? "text" : "password"} required minLength={6} className="input pr-16" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-700 hover:underline">{show ? "Ẩn" : "Hiện"}</button>
            </div>
            {tooShort && <p className="mt-1 text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự.</p>}
          </div>
          <div>
            <label className="label">Xác nhận mật khẩu</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} required className="input pr-16" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-700 hover:underline">{showConfirm ? "Ẩn" : "Hiện"}</button>
            </div>
            {mismatch && <p className="mt-1 text-xs text-red-600">Mật khẩu xác nhận không khớp.</p>}
            {!mismatch && confirm.length > 0 && <p className="mt-1 text-xs text-green-600">Mật khẩu khớp.</p>}
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading || mismatch || tooShort} className="btn-primary w-full disabled:opacity-60">{loading ? "Đang lưu..." : "Đặt lại mật khẩu"}</button>
        </form>
      </div>
    </div>
  );
}

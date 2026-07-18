"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function QuenMatKhau() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/dat-lai-mat-khau` : undefined,
    });
    setSent(true);
  }
  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-ink">Quên mật khẩu</h1>
        {sent ? (
          <p className="mt-4 text-ink-muted">Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div><label className="label">Email</label><input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <button className="btn-primary w-full">Gửi link đặt lại</button>
          </form>
        )}
      </div>
    </div>
  );
}

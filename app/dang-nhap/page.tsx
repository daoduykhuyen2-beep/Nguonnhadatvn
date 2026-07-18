"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DangNhapPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr("Email hoặc mật khẩu không đúng."); return; }
    const { data: prof } = await supabase.from("profiles").select("locked").eq("id", (await supabase.auth.getUser()).data.user?.id || "").maybeSingle();
    if (prof?.locked) { await supabase.auth.signOut(); setErr("Tài khoản của bạn đang bị khóa. Vui lòng liên hệ hỗ trợ."); return; }
    router.push("/tai-khoan");
    router.refresh();
  }

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-ink">Đăng nhập</h1>
        <p className="mt-1 text-sm text-ink-muted">Chào mừng bạn trở lại!</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Mật khẩu</label>
            <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Đang xử lý..." : "Đăng nhập"}</button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/quen-mat-khau" className="text-brand-700 hover:underline">Quên mật khẩu?</Link>
          <Link href="/dang-ky" className="text-brand-700 hover:underline">Tạo tài khoản</Link>
        </div>
      </div>
    </div>
  );
}

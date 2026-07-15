"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PaymentStatus({ paymentId, initialStatus }: { paymentId: number; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (status === "paid") return;
    const timer = setInterval(async () => {
      const { data } = await supabase.from("payments").select("status").eq("id", paymentId).maybeSingle();
      if (data?.status === "paid") { setStatus("paid"); clearInterval(timer); }
    }, 4000);
    return () => clearInterval(timer);
  }, [paymentId, status, supabase]);

  if (status === "paid") {
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</div>
        <h2 className="mt-3 text-lg font-bold text-neutral-900">Thanh toán thành công!</h2>
        <p className="mt-1 text-sm text-neutral-500">Gói dịch vụ của bạn đã được kích hoạt.</p>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => router.push("/tai-khoan/bien-dong")} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Xem giao dịch</button>
          <button onClick={() => router.push("/tai-khoan/tin-cua-toi")} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Về tài khoản</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      Đang chờ thanh toán… Hệ thống tự động xác nhận trong vài giây sau khi bạn chuyển khoản.
    </div>
  );
}

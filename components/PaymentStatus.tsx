"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Detail = {
  plan_code?: string | null;
  amount?: number | null;
  so_du?: number | null;
  membership_expires_at?: string | null;
};

export default function PaymentStatus({ paymentId, initialStatus }: { paymentId: number; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [detail, setDetail] = useState<Detail | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Lay chi tiet goi + trang thai tai khoan sau khi kich hoat de hien thi cu the.
  const loadDetail = useCallback(async () => {
    const { data: pay } = await supabase
      .from("payments")
      .select("plan_code, amount, user_id")
      .eq("id", paymentId)
      .maybeSingle();
    let so_du: number | null = null;
    let membership_expires_at: string | null = null;
    if (pay?.user_id) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("so_du, membership_expires_at")
        .eq("id", pay.user_id)
        .maybeSingle();
      so_du = prof?.so_du ?? null;
      membership_expires_at = prof?.membership_expires_at ?? null;
    }
    setDetail({ plan_code: pay?.plan_code ?? null, amount: pay?.amount ?? null, so_du, membership_expires_at });
  }, [paymentId, supabase]);

  useEffect(() => {
    let done = false;
    const check = async () => {
      const { data } = await supabase.from("payments").select("status").eq("id", paymentId).maybeSingle();
      if (data?.status === "paid" && !done) {
        done = true;
        setStatus("paid");
        await loadDetail();
        router.refresh(); // cap nhat lai so du / goi tren toan trang
      }
    };
    if (status === "paid") { loadDetail(); return; }
    check(); // kiem tra ngay lap tuc, khong cho 3s
    const timer = setInterval(() => { if (!done) check(); else clearInterval(timer); }, 3000);
    return () => clearInterval(timer);
  }, [paymentId, status, supabase, loadDetail, router]);

  if (status === "paid") {
    const isTopup = detail?.plan_code === "NAPTIEN";
    const expires = detail?.membership_expires_at
      ? new Date(detail.membership_expires_at).toLocaleDateString("vi-VN")
      : null;
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</div>
        <h2 className="mt-3 text-lg font-bold text-neutral-900">Thanh toán thành công!</h2>
        <p className="mt-1 text-sm text-neutral-500">Gói dịch vụ của bạn đã được kích hoạt.</p>

        <div className="mx-auto mt-4 max-w-sm rounded-xl border border-neutral-200 bg-white p-4 text-left text-sm">
          {detail?.plan_code && (
            <div className="flex justify-between py-1"><span className="text-neutral-500">Gói</span><span className="font-semibold text-neutral-900">{isTopup ? "Nạp tiền" : detail.plan_code}</span></div>
          )}
          {detail?.amount != null && (
            <div className="flex justify-between py-1"><span className="text-neutral-500">Số tiền</span><span className="font-semibold text-neutral-900">{detail.amount.toLocaleString("vi-VN")}đ</span></div>
          )}
          {detail?.so_du != null && (
            <div className="flex justify-between py-1"><span className="text-neutral-500">Số dư hiện tại</span><span className="font-semibold text-brand-dark">{detail.so_du.toLocaleString("vi-VN")}đ</span></div>
          )}
          {expires && (
            <div className="flex justify-between py-1"><span className="text-neutral-500">Hội viên đến</span><span className="font-semibold text-neutral-900">{expires}</span></div>
          )}
        </div>

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
      Đang chờ xác nhận thanh toán… Trang sẽ tự cập nhật ngay khi nhận được tiền.
    </div>
  );
}

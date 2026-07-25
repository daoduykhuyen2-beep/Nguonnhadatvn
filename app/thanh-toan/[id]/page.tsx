import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/plans";
import { payFromWallet } from "@/app/actions/payment";
import PaymentStatus from "@/components/PaymentStatus";

export const metadata = { title: "Thanh toán | Nguồn Nhà Đất Việt Nam" };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ vi?: string }> }) {
  const { id } = await params;
  const { vi } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/thanh-toan/" + id);
  const { data: order } = await supabase.from("payments").select("*").eq("id", Number(id)).eq("user_id", user.id).maybeSingle();
  if (!order) notFound();

  const { data: prof } = await supabase.from("profiles").select("so_du").eq("id", user.id).maybeSingle();
  const balance = Number(prof?.so_du || 0);
  const canWallet = order.status === "pending" && order.plan_code !== "NAPTIEN";
  const enough = balance >= Number(order.amount || 0);

  const bank = process.env.NEXT_PUBLIC_SEPAY_BANK || "";
  const account = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || "";
  const accountName = process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NAME || "";
  const configured = Boolean(bank && account);
  const qrUrl =
    "https://qr.sepay.vn/img?acc=" + encodeURIComponent(account) +
    "&bank=" + encodeURIComponent(bank) +
    "&amount=" + order.amount +
    "&des=" + encodeURIComponent(order.transfer_content || "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Thanh toán đơn hàng</h1>
      <p className="mt-1 text-sm text-neutral-500">Quét mã QR hoặc chuyển khoản theo đúng nội dung bên dưới. Hệ thống tự động xác nhận qua SePay.</p>

      <div className="mt-6"><PaymentStatus paymentId={order.id} initialStatus={order.status} /></div>
      <div className="mt-4 rounded-2xl border border-brand/20 bg-brand/5 p-5">
        <div className="text-sm font-semibold text-brand-dark">Hướng dẫn thanh toán nhanh</div>
        <ol className="mt-2 space-y-1.5 text-sm text-neutral-600">
          <li>1. Quét mã QR bằng app ngân hàng, hoặc chuyển khoản thủ công đúng số tiền và nội dung bên dưới.</li>
          <li>2. Giữ nguyên nội dung chuyển khoản để hệ thống đối soát chính xác.</li>
          <li>3. Sau khi chuyển khoản 1-2 phút, hệ thống tự động xác nhận và kích hoạt gói cho bạn.</li>
        </ol>
        <p className="mt-3 text-xs text-neutral-500">Trạng thái ở trên sẽ tự cập nhật khi thanh toán thành công, bạn không cần tải lại trang. Nếu sau 5 phút chưa được kích hoạt, vui lòng liên hệ hỗ trợ.</p>
      </div>

      {vi === "ok" && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">Thanh toán bằng số dư thành công! Quyền lợi đã được kích hoạt.</div>
      )}
      {vi === "thieu" && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Số dư trong ví không đủ. Vui lòng nạp thêm hoặc chuyển khoản theo mã QR bên dưới.</div>
      )}
      {vi === "loi" && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Không thể thanh toán bằng số dư. Vui lòng thử lại hoặc chuyển khoản.</div>
      )}

      {canWallet && (
        <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-neutral-900">Thanh toán bằng số dư</div>
              <div className="mt-0.5 text-xs text-neutral-500">Số dư hiện có: <span className="font-semibold text-brand-dark">{formatVND(balance)}</span></div>
            </div>
            {enough ? (
              <form action={payFromWallet}>
                <input type="hidden" name="id" value={order.id} />
                <button className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark">Trả bằng số dư</button>
              </form>
            ) : (
              <a href="/tai-khoan/nap-tien" className="rounded-xl border border-brand px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand/10">Nạp thêm tiền</a>
            )}
          </div>
          {!enough && (
            <p className="mt-2 text-xs text-amber-700">Số dư chưa đủ để thanh toán đơn này. Bạn có thể nạp thêm hoặc chuyển khoản theo mã QR bên dưới.</p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center">
          {configured ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={qrUrl} alt="Mã QR chuyển khoản" className="h-52 w-52 rounded-xl border border-neutral-100" />
          ) : (
            <div className="flex h-52 w-52 items-center justify-center rounded-xl border border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-400">Chưa cấu hình tài khoản SePay (biến môi trường NEXT_PUBLIC_SEPAY_*).</div>
          )}
          <span className="mt-2 text-xs text-neutral-400">Quét bằng app ngân hàng</span>
        </div>
        <div className="space-y-3 text-sm">
          <Row label="Số tiền" value={<span className="text-lg font-bold text-brand-dark">{formatVND(order.amount)}</span>} />
          <Row label="Ngân hàng" value={bank || "—"} />
          <Row label="Số tài khoản" value={account || "—"} copy={account} />
          <Row label="Chủ tài khoản" value={accountName || "—"} />
          <Row label="Nội dung CK" value={<span className="font-semibold text-neutral-900">{order.transfer_content}</span>} copy={order.transfer_content} />
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">Vui lòng chuyển đúng số tiền và giữ nguyên nội dung "{order.transfer_content}" để được kích hoạt tự động.</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, copy }: { label: string; value: React.ReactNode; copy?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-50 pb-2">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right text-neutral-800">{value}</span>
    </div>
  );
}

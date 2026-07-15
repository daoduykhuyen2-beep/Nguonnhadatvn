import { createClient } from "@/lib/supabase/server";
import VatForm from "@/components/VatForm";
import type { Profile } from "@/lib/types";
export const metadata = { title: "Thông tin xuất hóa đơn | Tài khoản" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-neutral-900">Thông tin xuất hóa đơn</h1>
      <p className="mb-6 text-sm text-neutral-500">Thông tin dùng để xuất hóa đơn GTGT (VAT) khi bạn thanh toán dịch vụ.</p>
      <VatForm profile={(profile || { id: user!.id }) as Profile} />
    </div>
  );
}

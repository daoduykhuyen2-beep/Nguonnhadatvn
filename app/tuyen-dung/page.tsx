import { createClient } from "@/lib/supabase/server";
import RecruitmentForm from "@/components/RecruitmentForm";
export const metadata = { title: "Tuyển dụng" };
export const revalidate = 120;
export default async function TuyenDung() {
  const supabase = await createClient();
  const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
  const jobs = data || [];
  return (
    <div className="container-app max-w-4xl py-12">
      <h1 className="section-title">Tuyển dụng</h1>
      <p className="mt-1 text-ink-muted">Cùng chúng tôi phát triển sàn bất động sản hàng đầu.</p>
      {jobs.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-ink-muted">Hiện chưa có vị trí tuyển dụng.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {jobs.map((j: any) => (
            <div key={j.id} className="card p-5">
              <h3 className="font-bold text-ink">{j.vi_tri}</h3>
              <p className="text-sm text-ink-muted">{j.dia_diem} · {j.loai_hinh}</p>
              {j.mo_ta && <p className="mt-2 whitespace-pre-line text-ink-soft">{j.mo_ta}</p>}
              {j.hoa_hong && <p className="mt-2 chip">Hoa hồng: {j.hoa_hong}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <RecruitmentForm />
      </div>
    </div>
  );
}

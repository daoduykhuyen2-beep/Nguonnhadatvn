import { formatVND } from "@/lib/plans";

type Props = { soDu: number; tongNap: number; daSuDung: number; tier?: string | null; expires?: string | null; };

const TIER_LABEL: Record<string, string> = { free: "Miễn phí", bac: "Bạc", vang: "Vàng", kim_cuong: "Kim cương" };

export default function WalletCard({ soDu, tongNap, daSuDung, tier, expires }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs opacity-90">Số dư khả dụng</div>
          <div className="mt-1 text-3xl font-bold">{formatVND(soDu || 0)}</div>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{TIER_LABEL[tier || "free"] || "Miễn phí"}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-sm">
        <div><div className="opacity-80">Tổng đã nạp</div><div className="font-semibold">{formatVND(tongNap || 0)}</div></div>
        <div><div className="opacity-80">Đã sử dụng</div><div className="font-semibold">{formatVND(daSuDung || 0)}</div></div>
      </div>
      {expires && <div className="mt-3 text-xs opacity-80">Hội viên đến: {new Date(expires).toLocaleDateString("vi-VN")}</div>}
    </div>
  );
}

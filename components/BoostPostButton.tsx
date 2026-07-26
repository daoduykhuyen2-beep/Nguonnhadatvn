"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { boostPost } from "@/app/actions/posts";

export default function BoostPostButton({ postId, credits }: { postId: number; credits: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<boolean>(false);
  const disabled = pending || credits < 1;

  function handleClick() {
    setMsg("");
    setErr(false);
    start(async () => {
      const res = await boostPost(postId);
      if (res.ok) {
        setErr(false);
        setMsg("Đã đẩy tin lên đầu! Còn lại " + (res.remaining ?? 0) + " lượt.");
        router.refresh();
      } else {
        setErr(true);
        setMsg(res.error || "Không đẩy được tin.");
      }
    });
  }

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={credits < 1 ? "Bạn đã hết lượt đẩy tin" : "Đẩy tin lên đầu danh sách"}
        className={
          "rounded-lg px-3 py-1.5 text-sm font-semibold transition " +
          (disabled
            ? "cursor-not-allowed border border-neutral-200 bg-neutral-100 text-neutral-400"
            : "border border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-400 hover:text-white")
        }
      >
        {pending ? "Đang đẩy..." : "Đẩy tin"}
      </button>
      {msg && (
        <span className={"mt-1 text-xs " + (err ? "text-red-600" : "text-brand-dark")}>{msg}</span>
      )}
    </span>
  );
}

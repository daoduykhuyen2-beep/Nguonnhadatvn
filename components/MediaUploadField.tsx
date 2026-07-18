"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

type Props = { name: string; label?: string; accept?: string; initial?: string };

export default function MediaUploadField({ name, label = "Tải lên (tối đa 5 ảnh hoặc video)", accept = "image/*,video/*", initial = "" }: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>(initial || "");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const uploaded: string[] = [];
    const list = Array.from(files).slice(0, 5);
    for (const file of list) {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
      if (!error) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setUrls((prev) => {
      const next = [...prev, ...uploaded].slice(0, 5);
      if (!selected && next[0]) setSelected(next[0]);
      return next;
    });
    if (uploaded[0] && !selected) setSelected(uploaded[0]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function isVideo(u: string) { return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(u); }

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      {label && <label className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>}
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u} onClick={() => setSelected(u)} className={"relative h-20 w-28 cursor-pointer overflow-hidden rounded-xl border-2 " + (selected === u ? "border-brand" : "border-neutral-200")}>
            {isVideo(u) ? (
              <video src={u} className="h-full w-full object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u} alt="" className="h-full w-full object-cover" />
            )}
            {selected === u && <span className="absolute left-1 top-1 rounded bg-brand px-1 text-[10px] font-semibold text-white">Dùng</span>}
          </div>
        ))}
        {urls.length < 5 && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-brand">
            <span className="text-xl leading-none">+</span>
            <span className="text-xs">{busy ? "Đang tải…" : "Thêm"}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <p className="mt-1 text-xs text-neutral-400">Tải ảnh hoặc video từ máy. Bấm chọn ảnh/video để dùng khi không có link.</p>
    </div>
  );
}


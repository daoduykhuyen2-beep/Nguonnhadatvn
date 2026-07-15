"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "post-images";

export default function ImageMultiUploadField({ initial = [] }: { initial?: string[] }) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
      if (!error) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setUrls((prev) => [...prev, ...uploaded]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(u: string) { setUrls((prev) => prev.filter((x) => x !== u)); }
  function makeCover(u: string) { setUrls((prev) => [u, ...prev.filter((x) => x !== u)]); }

  return (
    <div>
      <input type="hidden" name="anh" value={JSON.stringify(urls)} />
      <input type="hidden" name="anh_bia" value={urls[0] || ""} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((u, i) => (
          <div key={u} className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">Ảnh bìa</span>}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
              {i !== 0 && <button type="button" onClick={() => makeCover(u)} className="rounded-md bg-white px-2 py-1 text-xs font-medium text-neutral-800">Đặt bìa</button>}
              <button type="button" onClick={() => remove(u)} className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white">Xóa</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-500 transition hover:border-brand hover:text-brand disabled:opacity-50">
          <span className="text-2xl leading-none">+</span>
          <span className="text-xs">{busy ? "Đang tải…" : "Thêm ảnh"}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <p className="mt-2 text-xs text-neutral-400">Ảnh đầu tiên sẽ là ảnh bìa. Bạn có thể tải nhiều ảnh cùng lúc.</p>
    </div>
  );
}

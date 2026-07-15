"use client";
import { useState, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar } from "@/app/actions/profile";

export default function AvatarUpload({ initial, name }: { initial?: string | null; name?: string | null }) {
  const [url, setUrl] = useState(initial || "");
  const [busy, setBusy] = useState(false);
  const [, start] = useTransition();
  const ref = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      setUrl(data.publicUrl);
      start(() => { updateAvatar(data.publicUrl); });
    }
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-brand/10 text-brand">
        {url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={url} alt="" className="h-full w-full object-cover" /> : <span className="text-2xl font-semibold">{(name || "U").charAt(0).toUpperCase()}</span>}
      </div>
      <div>
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-brand hover:text-brand disabled:opacity-50">{busy ? "Đang tải…" : "Đổi ảnh"}</button>
        <p className="mt-1.5 text-xs text-neutral-400">JPG, PNG tối đa 5MB.</p>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

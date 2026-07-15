import { createClient } from "@/lib/supabase/client";

const BUCKET = "post-images";

export async function uploadImage(file: File, folder = "posts"): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadImages(files: File[], folder = "posts"): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) urls.push(await uploadImage(f, folder));
  return urls;
}

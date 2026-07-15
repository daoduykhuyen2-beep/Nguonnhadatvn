"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DangXuatPage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    })();
  }, [router]);
  return <div className="container-app py-24 text-center text-ink-muted">Đang đăng xuất...</div>;
}

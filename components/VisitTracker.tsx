"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      let newVisitor = false;
      if (!sessionStorage.getItem("__visit_session")) {
        sessionStorage.setItem("__visit_session", "1");
        newVisitor = true;
      }
      fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newVisitor }),
      }).catch(() => {});
    } catch {}
  }, [pathname]);
  return null;
}

"use client";
import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("__visit_tracked")) return;
      sessionStorage.setItem("__visit_tracked", "1");
      fetch("/api/track-visit", { method: "POST" }).catch(() => {});
    } catch {}
  }, []);
  return null;
}

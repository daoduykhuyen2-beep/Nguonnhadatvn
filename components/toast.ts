"use client";

// Lightweight global toast notifications (no provider needed).
// Usage: import { toast } from "@/components/toast"; toast("Message", "success" | "error" | "info");

type ToastType = "success" | "error" | "info";

function ensureContainer(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let el = document.getElementById("__toast_root");
  if (!el) {
    el = document.createElement("div");
    el.id = "__toast_root";
    el.style.cssText =
      "position:fixed;top:16px;right:16px;z-index:99999;display:flex;flex-direction:column;gap:10px;max-width:360px;pointer-events:none";
    document.body.appendChild(el);
    const style = document.createElement("style");
    style.textContent =
      "@keyframes __toast_in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}@keyframes __toast_out{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(24px)}}";
    document.head.appendChild(style);
  }
  return el;
}

export function toast(message: string, type: ToastType = "success", duration = 3500) {
  const root = ensureContainer();
  if (!root) return;
  const colors: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
    success: { bg: "#ecfdf3", border: "#16a34a", text: "#14532d", icon: "\u2713" },
    error: { bg: "#fef2f2", border: "#dc2626", text: "#7f1d1d", icon: "\u2715" },
    info: { bg: "#eff6ff", border: "#2563eb", text: "#1e3a8a", icon: "\u2139" },
  };
  const c = colors[type] || colors.info;
  const item = document.createElement("div");
  item.style.cssText =
    "pointer-events:auto;display:flex;align-items:flex-start;gap:10px;background:" +
    c.bg +
    ";border:1px solid " +
    c.border +
    ";border-left-width:4px;color:" +
    c.text +
    ";padding:12px 14px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.10);font-size:14px;line-height:1.4;font-weight:500;animation:__toast_in .22s ease-out";
  const badge = document.createElement("span");
  badge.textContent = c.icon;
  badge.style.cssText =
    "flex:none;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:9999px;background:" +
    c.border +
    ";color:#fff;font-size:12px;font-weight:700";
  const span = document.createElement("span");
  span.textContent = message;
  span.style.flex = "1";
  item.appendChild(badge);
  item.appendChild(span);
  root.appendChild(item);
  const remove = () => {
    item.style.animation = "__toast_out .22s ease-in forwards";
    setTimeout(() => item.remove(), 220);
  };
  item.addEventListener("click", remove);
  setTimeout(remove, duration);
}


"use client";
import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-1337313717244533";

type AdSlotProps = {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
};

export default function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
  label = "Quang cao",
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!slot) return;
    try {
      // @ts-expect-error adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ignore: ad blocker or script not ready
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={"my-6 " + className}>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-paper-line bg-paper-soft">
        <p className="border-b border-paper-line px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </p>
        <ins
          className="adsbygoogle"
          style={style || { display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}

'use client';
import { useEffect } from "react";

export default function AdSenseSlot({
  slot,
  label,
  className = "",
  style = { display: "block" },
  format = "auto",
  responsive = "true",
}) {
  useEffect(() => {
    if (!slot) return;
    try {
      // Renders the ad only in this explicit slot location.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore ad render errors in local/dev.
    }
  }, [slot]);

  if (!slot) {
    return (
      <div className={`rounded-2xl border border-dashed border-[#6CDDC2]/40 bg-[#0b1116] p-6 text-center ${className}`}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#6CDDC2]">Ad Space</p>
        <p className="mt-2 text-sm text-gray-400">{label}</p>
        <p className="mt-3 text-xs text-gray-500">Set AdSense slot id in env to activate this area.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-dashed border-[#6CDDC2]/40 bg-[#0b1116] p-3 ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

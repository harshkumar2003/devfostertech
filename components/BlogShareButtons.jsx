'use client'
import { useState } from "react";
import { trackEvent } from "@/lib/clientAnalytics";

export default function BlogShareButtons({ title, url, slug }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackEvent("article_share_copy_link", { slug, title });
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#0f1115] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Share Article</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("article_share_x", { slug, title })}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/60"
        >
          X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("article_share_linkedin", { slug, title })}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/60"
        >
          LinkedIn
        </a>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("article_share_whatsapp", { slug, title })}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/60"
        >
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/60"
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

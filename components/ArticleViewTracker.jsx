'use client';
import { useEffect } from "react";
import { trackEvent } from "@/lib/clientAnalytics";

export default function ArticleViewTracker({ slug, title }) {
  useEffect(() => {
    if (!slug) return;
    trackEvent("article_view", { slug, title });
  }, [slug, title]);

  return null;
}

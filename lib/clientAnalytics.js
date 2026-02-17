'use client';

export function trackEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    ...payload,
    timestamp: new Date().toISOString(),
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  try {
    const body = JSON.stringify({
      event: eventName,
      ...payload,
      page_path: window.location.pathname,
      source: "web",
      timestamp: eventPayload.timestamp,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
      return;
    }

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore analytics transport errors
  }
}

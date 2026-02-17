'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchAnalytics = async (rangeDays) => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session expired. Please login again.");
      }

      const response = await fetch(`/api/admin/analytics?days=${rangeDays}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Failed to load analytics.");
      setData(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  return (
    <section className="mt-10 rounded-xl border border-[#6CDDC2]/30 bg-black p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="range" className="text-xs text-gray-400">
            Range
          </label>
          <select
            id="range"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-md border border-white/20 bg-[#0f1115] px-3 py-1.5 text-sm text-white"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
          <button
            type="button"
            onClick={() => fetchAnalytics(days)}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:border-[#6CDDC2]/70"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-gray-400">Loading analytics...</p>}
      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {!loading && !error && data && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-[#0f1115] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Total Events</p>
            <p className="mt-2 text-3xl font-bold text-[#6CDDC2]">{data.totalEvents}</p>
            <p className="mt-1 text-xs text-gray-500">Last {data.rangeDays} days</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0f1115] p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Top Share Channels</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(data.topShareChannels || []).length === 0 && <p className="text-sm text-gray-500">No share data yet.</p>}
              {(data.topShareChannels || []).map((item) => (
                <span key={item.channel} className="rounded-full border border-[#6CDDC2]/35 bg-[#6CDDC2]/10 px-3 py-1 text-xs text-[#6CDDC2]">
                  {item.channel}: {item.count}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0f1115] p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Top Posts</p>
            <div className="mt-3 space-y-2">
              {(data.topPosts || []).length === 0 && <p className="text-sm text-gray-500">No post analytics yet.</p>}
              {(data.topPosts || []).map((post) => (
                <div key={post.slug} className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2">
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="line-clamp-1 text-sm text-white hover:text-[#6CDDC2]">
                    {post.title}
                  </a>
                  <span className="text-xs text-gray-400">{post.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0f1115] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Event Types</p>
            <div className="mt-3 space-y-2">
              {(data.eventsByType || []).slice(0, 8).map((item) => (
                <div key={item.key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{item.key}</span>
                  <span className="text-gray-400">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

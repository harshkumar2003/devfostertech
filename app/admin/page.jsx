'use client'
import AdminBlogUpload from "@/components/AdminBlogUpload";
import AdminAnalyticsPanel from "@/components/AdminAnalyticsPanel";

export default function AdminPage() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-6">Upload New Blog</h1> */}
      <AdminBlogUpload />
      <AdminAnalyticsPanel />
    </div>
  );
}

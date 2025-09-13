'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAuthLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }
      console.log(session.user)

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return <p className="text-center pt-32 text-gray-400">Loading...</p>;

  return isAdmin ? <div className="min-h-screen bg-gray-900 text-white p-6">{children}</div> : null;
}

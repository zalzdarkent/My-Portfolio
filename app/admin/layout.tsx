"use client";

import type { Metadata } from "next";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authOk, setAuthOk] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        setAuthOk(true);
      } catch {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }, [router]);

  if (!authOk) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen flex items-center justify-center bg-brutal-white">
          <div className="font-mono text-sm animate-pulse">LOADING...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <div className="h-screen flex bg-brutal-white overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 h-screen overflow-y-auto flex flex-col">
          <AdminHeader onLogout={handleLogout} />
          <div className="flex-1 p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

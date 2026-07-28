"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ExternalLink, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout?: () => void; // kept for backwards compat, but self-handles if omitted
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    if (onLogout) { onLogout(); return; }
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }, [onLogout, router]);

  return (
    <header className="sticky top-0 z-10 border-b-4 border-brutal-black bg-brutal-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-brutal-black border-3 border-brutal-black shadow-brutal-sm">
            <span className="font-mono font-extrabold text-brutal-yellow text-xs">ADM</span>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight">Admin Dashboard</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">
              Neo Brutal Portfolio CMS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 border-3 border-brutal-black shadow-brutal-sm bg-brutal-white font-body font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <ExternalLink size={13} strokeWidth={2.5} />
            View Site
          </Link>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border-3 border-brutal-black shadow-brutal-sm bg-red-50 font-body font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={13} strokeWidth={2.5} />
            {loading ? "..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}

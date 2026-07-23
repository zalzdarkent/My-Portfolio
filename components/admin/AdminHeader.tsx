"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
  loading?: boolean;
}

export default function AdminHeader({ onLogout, loading }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-4 border-brutal-black shadow-brutal bg-brutal-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-brutal-black border-4 border-brutal-black shadow-brutal-sm">
              <span className="font-mono font-extrabold text-brutal-yellow">
                ADM
              </span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl tracking-tight">
                Admin Dashboard
              </h1>
              <p className="font-body text-sm text-black/60">
                Neo Brutal Retro UI untuk kelola konten portfolio.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2 border-4 border-brutal-black shadow-brutal bg-brutal-white font-body font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            <ExternalLink size={14} strokeWidth={2.5} />
            View Portfolio
          </Link>

          <button
            onClick={onLogout}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 border-4 border-brutal-black shadow-brutal bg-brutal-orange/20 font-body font-bold text-xs uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={14} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

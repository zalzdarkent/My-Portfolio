"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError("Username / password harus diisi.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal.");
        setLoading(false);
        return;
      }

      router.push(from);
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg border-4 border-brutal-black shadow-brutal bg-brutal-white">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-brutal-black border-4 border-brutal-black shadow-brutal-sm">
              <span className="font-mono font-extrabold text-brutal-yellow">ADM</span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl tracking-tight">
                Neo Brutal Admin
              </h1>
              <p className="font-body text-sm text-black/60">
                Login dulu biar konten bisa diupdate.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="font-body font-bold text-xs uppercase tracking-widest text-black/60">
                Username
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full px-4 py-3 border-3 border-brutal-black bg-brutal-white font-body font-bold text-sm outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-brutal-hover"
                placeholder="Masukkan username..."
              />
            </label>

            <label className="block">
              <span className="font-body font-bold text-xs uppercase tracking-widest text-black/60">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-4 py-3 border-3 border-brutal-black bg-brutal-white font-body font-bold text-sm outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-brutal-hover"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="border-3 border-brutal-black bg-brutal-orange/20 p-3 font-body text-sm text-brutal-black">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 border-4 border-brutal-black shadow-brutal font-body font-bold text-sm uppercase tracking-widest transition-all duration-100 cursor-pointer disabled:cursor-not-allowed ${
                loading
                  ? "bg-brutal-orange/90 text-white translate-x-[3px] translate-y-[3px] animate-pulse"
                  : "bg-brutal-yellow text-brutal-black hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
              }`}
            >
              {loading ? "⚡ Checking..." : "Login →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminLoginInner />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState("/admin");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/admin");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    document.cookie = `novanode_admin_token=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 14}; SameSite=Lax`;

    const res = await fetch("/api/admin/metrics", {
      cache: "no-store",
      headers: { "x-admin-token": token },
    });

    if (!res.ok) {
      setError("Invalid token. Try again.");
      return;
    }

    router.push(nextPath);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h1>
        <p className="text-sm text-slate-600 mb-4">Enter your NoVaNode admin token to continue.</p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="w-full px-3 py-2 rounded-lg border border-slate-300"
            required
          />
          <button className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            Continue
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving…");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "Subscribed to NoVA Nomad weekly digest." : "Could not subscribe right now.");
    if (res.ok) setEmail("");
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-2">📰 Weekly NoVA Nomad</h3>
      <p className="text-sm text-slate-600 mb-3">Get a weekly digest: best work spots, policy updates, and hidden gems.</p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="you@email.com"
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300"
        />
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Subscribe</button>
      </form>
      {status && <p className="mt-2 text-xs text-slate-500">{status}</p>}
    </div>
  );
}

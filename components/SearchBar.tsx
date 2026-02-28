"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [wifiFast, setWifiFast] = useState(false);
  const [seatNow, setSeatNow] = useState(false);
  const [ev, setEv] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (wifiFast) params.set("wifi", "true");
      if (seatNow) params.set("seat", "true");
      if (ev) params.set("ev", "true");
      router.push(`/?${params.toString()}`);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, wifiFast, seatNow, ev, router]);

  const btn = "px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Where are you working today?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-14 px-5 rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:outline-none text-base"
      />

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={() => setWifiFast(!wifiFast)} className={`${btn} ${wifiFast ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 bg-white text-slate-700"}`}>
          📶 WiFi Speed
        </button>
        <button onClick={() => setSeatNow(!seatNow)} className={`${btn} ${seatNow ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 bg-white text-slate-700"}`}>
          🪑 Seat Availability
        </button>
        <button onClick={() => setEv(!ev)} className={`${btn} ${ev ? "border-green-600 bg-green-50 text-green-700" : "border-slate-200 bg-white text-slate-700"}`}>
          ⚡ EV Charger
        </button>
      </div>
    </div>
  );
}

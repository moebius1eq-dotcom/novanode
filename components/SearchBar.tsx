"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  highSpeedWifi: boolean;
  openLate: boolean;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [highSpeedWifi, setHighSpeedWifi] = useState(false);
  const [openLate, setOpenLate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (highSpeedWifi) params.set("wifi", "true");
      if (openLate) params.set("late", "true");
      
      router.push(`/?${params.toString()}`);
      onSearch?.({ query, highSpeedWifi, openLate });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, highSpeedWifi, openLate, router, onSearch]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
            isFocused ? "text-indigo-500" : "text-slate-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search spots by name, neighborhood, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="search-input"
        />
      </div>

      {/* Filter Toggles */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => setHighSpeedWifi(!highSpeedWifi)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            highSpeedWifi
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
          <span className="font-medium">High-Speed Wi-Fi</span>
          {highSpeedWifi && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <button
          onClick={() => setOpenLate(!openLate)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            openLate
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Open Late</span>
          {openLate && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

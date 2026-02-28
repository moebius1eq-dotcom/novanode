"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyFilterBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-lg border-t border-slate-200/50 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Quick Filters:</span>

          <Link
            href="/?highSpeed=true"
            className="flex-shrink-0 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-200 transition-colors"
          >
            ⚡ Fast WiFi
          </Link>

          <Link
            href="/?openLate=true"
            className="flex-shrink-0 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
          >
            🌙 Open Now
          </Link>

          <Link
            href="/free-parking-remote-work"
            className="flex-shrink-0 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
          >
            🅿️ Free Parking
          </Link>

          <Link
            href="/laptop-friendly-weekends"
            className="flex-shrink-0 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full hover:bg-amber-200 transition-colors"
          >
            💻 Weekends
          </Link>
        </div>
      </div>
    </div>
  );
}

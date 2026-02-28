"use client";

import Link from "next/link";
import { useState } from "react";
import { NEIGHBORHOODS, NEIGHBORHOOD_SLUGS } from "@/lib/constants";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <span className="text-xl font-bold text-slate-900">
              NoVa<span className="text-indigo-600">Node</span>
            </span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100">
                All Spots
              </Link>
              {NEIGHBORHOOD_SLUGS.map((hood) => (
                <Link
                  key={hood}
                  href={`/?neighborhood=${hood}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
                >
                  {NEIGHBORHOODS[hood]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

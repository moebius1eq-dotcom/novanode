"use client";

import Link from "next/link";
import { useState } from "react";
import { NEIGHBORHOODS, NEIGHBORHOOD_SLUGS } from "@/lib/constants";
import { Neighborhood } from "@/lib/types";

interface NavbarProps {
  selectedNeighborhood?: Neighborhood | null;
}

export default function Navbar({ selectedNeighborhood }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const neighborhoodColors: Record<Neighborhood, string> = {
    arlington: "bg-indigo-600 hover:bg-indigo-700",
    alexandria: "bg-cyan-600 hover:bg-cyan-700",
    tysons: "bg-violet-600 hover:bg-violet-700",
    reston: "bg-emerald-600 hover:bg-emerald-700",
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <span className="text-xl font-bold text-slate-900">
              NoVa<span className="text-indigo-600">Node</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/virginia-laptop-policies"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              💻 Laptop Policies
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
              >
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
              <Link
                href="/virginia-laptop-policies"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-lg font-medium text-amber-700 bg-amber-50"
              >
                💻 Laptop Policies
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import NewsletterSignup from "@/components/NewsletterSignup";
import NeighborhoodPushSubscribe from "@/components/NeighborhoodPushSubscribe";

export default function HomeSecondarySections({ spots }: { spots: WorkSpot[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-8 px-4 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            {open ? "Hide extra tools" : "Show extra tools"}
          </button>
        </div>

        {open && (
          <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <NeighborhoodPushSubscribe />
              <NewsletterSignup />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Explore by Neighborhood</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(NEIGHBORHOODS).map(([slug, name]) => {
                  const count = spots.filter((s) => s.neighborhood === slug).length;
                  return (
                    <Link
                      key={slug}
                      href={`/neighborhood/${slug}`}
                      className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center"
                    >
                      <h3 className="font-semibold text-slate-900">{name}</h3>
                      <p className="text-sm text-slate-500">{count} spots</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

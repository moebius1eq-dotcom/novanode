"use client";

import { WorkSpot } from "@/lib/types";
import { trackMonetizationEvent } from "@/lib/analytics";
import SponsoredDisclosure from "@/components/SponsoredDisclosure";

interface OutletAffiliateCardProps {
  spot: WorkSpot;
}

export default function OutletAffiliateCard({ spot }: OutletAffiliateCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">🔋 Low-outlet backup</h3>
      <p className="text-sm text-slate-600 mb-4">
        {spot.name} has {spot.logistics.outletDensity} outlet coverage. A portable power bank can save long sessions.
      </p>
      <a
        href="https://www.amazon.com/s?k=portable+laptop+power+bank"
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={() =>
          trackMonetizationEvent({
            type: "affiliate_power_click",
            spotId: spot.id,
            spotSlug: spot.slug,
            neighborhood: spot.neighborhood,
          })
        }
        className="block w-full text-center px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
      >
        View Recommended Power Banks
      </a>
      <div className="mt-2">
        <SponsoredDisclosure />
      </div>
    </div>
  );
}

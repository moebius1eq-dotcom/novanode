"use client";

import { WorkSpot } from "@/lib/types";
import { trackMonetizationEvent } from "@/lib/analytics";
import SponsoredDisclosure from "@/components/SponsoredDisclosure";

interface PartnerDayPassCTAProps {
  spot: WorkSpot;
}

export default function PartnerDayPassCTA({ spot }: PartnerDayPassCTAProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">🤝 Book a Day Pass</h3>
      <p className="text-sm text-slate-600 mb-4">
        Looking for a more structured setup near {spot.name}? Check verified partner coworking options.
      </p>
      <a
        href="https://www.wework.com/"
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={() =>
          trackMonetizationEvent({
            type: "partner_day_pass_click",
            spotId: spot.id,
            spotSlug: spot.slug,
            neighborhood: spot.neighborhood,
          })
        }
        className="block w-full text-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
      >
        View Partner Day Passes
      </a>
      <div className="mt-2">
        <SponsoredDisclosure />
      </div>
    </div>
  );
}

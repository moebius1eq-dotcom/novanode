import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "./constants";

export interface WorkSpotSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  description: string;
  url: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  telephone?: string;
  priceRange?: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
  };
  amenityFeature?: {
    "@type": "LocationFeatureSpecification";
    name: string;
    value: string;
  }[];
  openingHoursSpecification?: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string | string[];
    opens?: string;
    closes?: string;
  }[];
}

export const generateWorkSpotJsonLd = (spot: WorkSpot, baseUrl: string = "https://novanode.dev"): WorkSpotSchema => {
  // Build amenity features from logistics
  const amenityFeatures = [
    {
      "@type": "LocationFeatureSpecification" as const,
      name: "High-Speed Wi-Fi",
      value: `${spot.logistics.wifiSpeedDown} Mbps download`,
    },
    {
      "@type": "LocationFeatureSpecification" as const,
      name: "Wi-Fi Upload Speed",
      value: `${spot.logistics.wifiSpeedUp} Mbps upload`,
    },
    {
      "@type": "LocationFeatureSpecification" as const,
      name: "Power Outlets",
      value: spot.logistics.outletDensity,
    },
    {
      "@type": "LocationFeatureSpecification" as const,
      name: "Noise Level",
      value: `${spot.logistics.noiseLevel} dB`,
    },
    {
      "@type": "LocationFeatureSpecification" as const,
      name: "Weekend Friendly",
      value: spot.weekendFriendly ? "Laptops welcome on weekends" : "Restricted weekend laptop policy",
    },
    {
      "@type": "LocationFeatureSpecification" as const,
      name: "Remote Work Verified",
      value: `Last verified: ${spot.logistics.lastVerified || "Recently"}`,
    },
  ];

  // Add optional features
  if (spot.hasZoomPods) {
    amenityFeatures.push({
      "@type": "LocationFeatureSpecification",
      name: "Zoom Pods",
      value: "Private soundproof pods available",
    });
  }

  if (spot.has5G) {
    amenityFeatures.push({
      "@type": "LocationFeatureSpecification",
      name: "5G Connectivity",
      value: "Verified 5G for outdoor work",
    });
  }

  if (spot.powerPlayer) {
    amenityFeatures.push({
      "@type": "LocationFeatureSpecification",
      name: "Power Coverage",
      value: "100% outlet coverage",
    });
  }

  // Build opening hours
  const openingHours = spot.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: h.day,
      opens: h.open!,
      closes: h.close!,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: spot.name,
    description: `Verified remote work logistics for ${spot.name} in ${NEIGHBORHOODS[spot.neighborhood]}, VA: ${spot.logistics.wifiSpeedDown} Mbps Wi-Fi, ${spot.logistics.outletDensity} outlets, ${spot.logistics.noiseLevel}dB noise. ${spot.laptopPolicy || ""}`,
    url: `${baseUrl}/location/${spot.neighborhood}/${spot.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: NEIGHBORHOODS[spot.neighborhood],
      addressRegion: "VA",
      addressCountry: "US",
    },
    telephone: spot.phone,
    priceRange: spot.seo.priceRange,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: spot.seo.rating,
      reviewCount: spot.seo.reviewCount,
      bestRating: 5,
    },
    amenityFeature: amenityFeatures,
    ...(openingHours.length > 0 && { openingHoursSpecification: openingHours }),
  };
};

export const generateBreadcrumbJsonLd = (
  items: { name: string; url: string }[],
  baseUrl: string = "https://novanode.dev"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
};

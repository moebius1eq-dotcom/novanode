// data/locations.ts - Seed data for Phase 2 SEO
// This file provides instant-render data for NoVa's best remote work spots

export interface SeedLocation {
  id: string;
  name: string;
  slug: string;
  neighborhood: string;
  address: string;
  wifiSpeed: number;
  outlets: number; // /10 scale
  insiderTip: string;
  neighborhoodName: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  laptopPolicy: string;
  weekendFriendly: boolean;
  highSpeedWifi: boolean;
  openLate: boolean;
  // New E-E-A-T fields
  lastVerified: string;
  parkingInfo: string;
}

export const POWER_SPOTS: SeedLocation[] = [
  {
    id: "caboose-commons",
    name: "Caboose Commons",
    slug: "caboose-commons",
    neighborhood: "tysons",
    neighborhoodName: "Fairfax/Mosaic",
    address: "2985 District Ave, Fairfax, VA 22031",
    wifiSpeed: 152,
    outlets: 9,
    insiderTip: "Use the 3rd floor for \"Deep Work\" (strictly no calls).",
    rating: 4.5,
    reviewCount: 234,
    priceRange: "$$",
    laptopPolicy: "Laptops welcome all day - 3 floors of seating",
    weekendFriendly: true,
    highSpeedWifi: true,
    openLate: true,
    lastVerified: "Feb 27, 2026",
    parkingInfo: "Free garage parking - enter from District Ave",
  },
  {
    id: "northside-social",
    name: "Northside Social",
    slug: "northside-social",
    neighborhood: "arlington",
    neighborhoodName: "Arlington",
    address: "3251 N 20th St, Arlington, VA 22206",
    wifiSpeed: 48,
    outlets: 6,
    insiderTip: "Laptops are banned upstairs on weekends after 10 AM.",
    rating: 4.4,
    reviewCount: 418,
    priceRange: "$$",
    laptopPolicy: "Upstairs wine bar: laptops OK | Downstairs cafe: laptops OK all day",
    weekendFriendly: false,
    highSpeedWifi: false,
    openLate: true,
    lastVerified: "Feb 27, 2026",
    parkingInfo: "Street parking - metered until 9 PM, free on Sundays",
  },
  {
    id: "3den-tysons",
    name: "3DEN Tysons Corner",
    slug: "3den-tysons",
    neighborhood: "tysons",
    neighborhoodName: "Tysons Mall",
    address: "Tysons Corner Center, 1961 Chain Bridge Rd, Tysons, VA 22102",
    wifiSpeed: 240,
    outlets: 10,
    insiderTip: "It's a paid lounge, but the \"phone booths\" are soundproof.",
    rating: 4.7,
    reviewCount: 156,
    priceRange: "$$$",
    laptopPolicy: "Full access - this IS a coworking lounge ($35/day or membership)",
    weekendFriendly: true,
    highSpeedWifi: true,
    openLate: false,
    lastVerified: "Feb 27, 2026",
    parkingInfo: "Free validation at mall garage - ask front desk",
  },
  {
    id: "mishas-coffee",
    name: "Misha's Coffee",
    slug: "mishas-coffee-alexandria",
    neighborhood: "alexandria",
    neighborhoodName: "Alexandria",
    address: "717 King St, Alexandria, VA 22314",
    wifiSpeed: 32,
    outlets: 4,
    insiderTip: "Best \"vibe\" in Old Town, but get there before 9 AM for a seat.",
    rating: 4.3,
    reviewCount: 534,
    priceRange: "$$",
    laptopPolicy: "Laptops welcome but very limited seating - arrive early",
    weekendFriendly: true,
    highSpeedWifi: false,
    openLate: false,
    lastVerified: "Feb 27, 2026",
    parkingInfo: "Street parking only - difficult on weekends",
  },
  {
    id: "capital-one-hall",
    name: "Capital One Hall",
    slug: "capital-one-hall",
    neighborhood: "tysons",
    neighborhoodName: "Tysons",
    address: "1601 Spring Hill Rd, Tysons, VA 22102",
    wifiSpeed: 110,
    outlets: 8,
    insiderTip: "The public lobby is massive and almost always quiet.",
    rating: 4.5,
    reviewCount: 89,
    priceRange: "$",
    laptopPolicy: "Free guest WiFi - open to public during food court hours",
    weekendFriendly: true,
    highSpeedWifi: true,
    openLate: true,
    lastVerified: "Feb 27, 2026",
    parkingInfo: "Free garage parking - best in Tysons",
  },
];

// Helper to filter by neighborhood
export function getSpotsByNeighborhood(neighborhood: string): SeedLocation[] {
  return POWER_SPOTS.filter(spot => spot.neighborhood === neighborhood);
}

// Helper to get a single spot
export function getSpotBySlug(slug: string): SeedLocation | undefined {
  return POWER_SPOTS.find(spot => spot.slug === slug);
}

// Helper to get weekend-friendly spots only
export function getWeekendFriendlySpots(): SeedLocation[] {
  return POWER_SPOTS.filter(spot => spot.weekendFriendly);
}

// Generate JSON-LD Schema for a spot
export function generateLocalBusinessSchema(spot: SeedLocation, baseUrl: string = "https://novanode.moebius1eq.workers.dev") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: spot.name,
    description: spot.laptopPolicy,
    url: `${baseUrl}/location/${spot.neighborhood}/${spot.slug}/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: spot.address,
      addressLocality: spot.neighborhoodName,
      addressRegion: "VA",
      addressCountry: "US",
    },
    priceRange: spot.priceRange,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: spot.rating,
      reviewCount: spot.reviewCount,
      bestRating: 5,
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "High-Speed Wi-Fi",
        value: `${spot.wifiSpeed} Mbps tested ${spot.lastVerified}`,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Power Outlets",
        value: spot.outlets >= 7 ? "Plenty - 80%+ tables" : spot.outlets >= 4 ? "Moderate - some tables" : "Sparse - limited",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Weekend Laptop Friendly",
        value: spot.weekendFriendly ? "Yes - laptops welcome on weekends" : "No - restricted weekend policy",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Last Verified",
        value: spot.lastVerified,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking",
        value: spot.parkingInfo,
      },
    ],
  };
}
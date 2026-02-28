// data/locations.ts - Seed data for Phase 2 SEO
// This file provides instant-render data for NoVa's best remote work spots

export interface SeedLocation {
  id: string;
  name: string;
  slug: string;
  neighborhood: string;
  address: string;
  wifiSpeed: number;
  outlets: number;  // /10 scale
  insiderTip: string;
  neighborhoodName: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  laptopPolicy: string;
  weekendFriendly: boolean;
  highSpeedWifi: boolean;
  openLate: boolean;
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

// Generate JSON-LD Schema for a spot
export function generateLocalBusinessSchema(spot: SeedLocation) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: spot.name,
    description: spot.laptopPolicy,
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
        name: "High-Speed WiFi",
        value: spot.highSpeedWifi,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Power Outlets",
        value: spot.outlets >= 7,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Laptop Friendly",
        value: spot.laptopPolicy.toLowerCase().includes("welcome"),
      },
    ],
  };
}

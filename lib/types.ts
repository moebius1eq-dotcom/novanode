// lib/types.ts - WorkSpot entity types

export type Neighborhood = "arlington" | "alexandria" | "tysons" | "reston";

export type VibePrimary = "focus" | "social" | "quiet" | "lively";

export type OutletDensity = "sparse" | "moderate" | "plenty";

export type SeatingType = "desk" | "couch" | "bar" | "communal" | "outdoor";

export interface DayHours {
  day: string;
  open: string | null;   // "07:00" or null if closed
  close: string | null;  // "20:00" or null if closed
}

export interface LogisticsData {
  wifiSpeedDown: number;      // Mbps (verified)
  wifiSpeedUp: number;        // Mbps (verified)
  outletDensity: OutletDensity;
  noiseLevel: number;         // dB reading (measured)
  seatingType: SeatingType[];
  verifiedAt: string;         // ISO timestamp of last verification
}

export interface VibeData {
  primary: VibePrimary;
  secondary?: string;
  tags: string[];             // ["coffee", "food", "outdoor", "meeting-rooms"]
}

export interface SEOData {
  description: string;
  priceRange: " $" | " $$" | " $$$";
  rating: number;             // 0-5
  reviewCount: number;
}

export interface WorkSpot {
  // Core Identity
  id: string;
  name: string;
  slug: string;
  neighborhood: Neighborhood;
  
  // Location & Contact
  address: string;
  googleMapsUrl: string;
  website?: string;
  phone?: string;
  
  // Logistics Card Data (The Data Moat)
  logistics: LogisticsData;
  
  // Vibe System
  vibe: VibeData;
  
  // Operating Hours
  hours: DayHours[];
  openLate: boolean;          // true if any day closes after 9pm
  highSpeedWifi: boolean;     // true if wifiDown >= 100
  
  // SEO & Reviews
  seo: SEOData;
  
  // Media
  images: {
    hero: string;
    gallery?: string[];
  };
  
  // Laptop Policy & Expert Tips
  laptopPolicy?: string;
  expertTip?: string;
}

// JSON-LD Schema Types
export interface LocalBusinessSchema {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  url?: string;
  priceRange?: string;
  openingHoursSpecification?: OpeningHoursSpec[];
}

export interface OpeningHoursSpec {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[];
  opens?: string;
  closes?: string;
}

export interface ReviewSchema {
  "@context": "https://schema.org";
  "@type": "Review";
  itemReviewed: {
    "@type": "LocalBusiness";
    name: string;
  };
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
  };
  author: {
    "@type": "Organization";
    name: string;
  };
  reviewBody?: string;
}

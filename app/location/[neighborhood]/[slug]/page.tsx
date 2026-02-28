import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import spotsData from "@/data/spots.json";
import { WorkSpot, LocalBusinessSchema, ReviewSchema } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";
import LogisticsCard from "@/components/LogisticsCard";
import VibeIndicator from "@/components/VibeIndicator";
import AmenitiesChecklist from "@/components/AmenitiesChecklist";
import CommunityStatus from "@/components/CommunityStatus";
import CommunitySpeedTrend from "@/components/CommunitySpeedTrend";
import SpeedTest from "@/components/SpeedTest";

// Static params for all locations (for static export)
export async function generateStaticParams() {
  const spots = spotsData.spots as WorkSpot[];
  return spots.map((spot) => ({
    neighborhood: spot.neighborhood,
    slug: spot.slug,
  }));
}

// Generate metadata for each location page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ neighborhood: string; slug: string }>;
}): Promise<Metadata> {
  const { neighborhood, slug } = await params;
  const spots = spotsData.spots as WorkSpot[];
  const spot = spots.find((s) => s.neighborhood === neighborhood && s.slug === slug);
  
  if (!spot) {
    return { title: "Location Not Found" };
  }
  
  return {
    title: `${spot.name} | Remote Work Spot in ${NEIGHBORHOODS[spot.neighborhood]} | NoVaNode`,
    description: spot.seo.description,
    openGraph: {
      title: spot.name,
      description: spot.seo.description,
      type: "website",
    },
  };
}

// Generate JSON-LD for SEO - Enhanced with Rich Snippets
function generateLocalBusinessJsonLd(spot: WorkSpot): LocalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: spot.name,
    description: `Verified remote work logistics for ${spot.name} in ${NEIGHBORHOODS[spot.neighborhood]}, VA. Wi-Fi: ${spot.logistics.wifiSpeedDown}Mbps, Noise: ${spot.logistics.noiseLevel}dB.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: spot.address,
      addressLocality: NEIGHBORHOODS[spot.neighborhood],
      addressRegion: "VA",
      addressCountry: "US",
    },
    telephone: spot.phone,
    url: spot.website,
    priceRange: spot.seo.priceRange,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: spot.seo.rating,
      reviewCount: spot.seo.reviewCount,
      bestRating: 5,
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "High-Speed Wi-Fi",
        value: spot.highSpeedWifi,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Power Outlets",
        value: spot.logistics.outletDensity === "plenty",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Quiet Environment",
        value: spot.logistics.noiseLevel <= 55,
      },
    ],
    openingHoursSpecification: spot.hours
      .filter((h) => h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open ?? undefined,
        closes: h.close ?? undefined,
      })),
  };
}

function generateReviewJsonLd(spot: WorkSpot): ReviewSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: spot.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: spot.seo.rating,
      bestRating: 5,
    },
    author: {
      "@type": "Organization",
      name: "NoVaNode",
    },
    reviewBody: spot.seo.description,
  };
}

// Main page component
export default async function LocationPage({ 
  params 
}: { 
  params: Promise<{ neighborhood: string; slug: string }>;
}) {
  const { neighborhood, slug } = await params;
  const spots = spotsData.spots as WorkSpot[];
  const spot = spots.find((s) => s.neighborhood === neighborhood && s.slug === slug);
  
  if (!spot) {
    notFound();
  }
  
  const localBusinessJsonLd = generateLocalBusinessJsonLd(spot);
  const reviewJsonLd = generateReviewJsonLd(spot);

  const compareCandidates = spots
    .filter((s) => s.slug !== spot.slug)
    .sort((a, b) => {
      const sameNeighborhoodA = a.neighborhood === spot.neighborhood ? 0 : 1;
      const sameNeighborhoodB = b.neighborhood === spot.neighborhood ? 0 : 1;
      if (sameNeighborhoodA !== sameNeighborhoodB) {
        return sameNeighborhoodA - sameNeighborhoodB;
      }

      const wifiDeltaA = Math.abs(a.logistics.wifiSpeedDown - spot.logistics.wifiSpeedDown);
      const wifiDeltaB = Math.abs(b.logistics.wifiSpeedDown - spot.logistics.wifiSpeedDown);
      return wifiDeltaA - wifiDeltaB;
    })
    .slice(0, 3);
  
  // Format today's hours
  const today = new Date().getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayHours = spot.hours[today];
  const isOpenNow = todayHours.open && todayHours.close 
    ? (() => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = (todayHours.open || "").split(":").map(Number);
        const [closeH, closeM] = (todayHours.close || "").split(":").map(Number);
        const openTime = openH * 60 + openM;
        const closeTime = closeH * 60 + closeM;
        return currentTime >= openTime && currentTime <= closeTime;
      })()
    : false;

  return (
    <>
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />
      
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-500 mb-4">
              <a href="/" className="hover:text-indigo-600">Home</a>
              <span className="mx-2">/</span>
              <a href={`/?neighborhood=${spot.neighborhood}`} className="hover:text-indigo-600">
                {NEIGHBORHOODS[spot.neighborhood]}
              </a>
              <span className="mx-2">/</span>
              <span className="text-slate-900">{spot.name}</span>
            </nav>
            
            {/* Title Row */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                {/* Freshness Badge */}
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full w-fit mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase">On-Site Verified: {new Date(spot.logistics.verifiedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {spot.name}
                </h1>
                <p className="text-slate-600">{spot.address}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <VibeIndicator vibe={spot.vibe.primary} size="lg" />
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold text-slate-900">{spot.seo.rating}</span>
                  </div>
                  <p className="text-xs text-slate-500">{spot.seo.reviewCount} reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image Placeholder */}
              <div className="h-80 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                <span className="text-8xl">☕</span>
              </div>
              
              {/* Logistics Card */}
              <LogisticsCard logistics={spot.logistics} />
              
              {/* About / Description */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Spot</h2>
                <p className="text-slate-600 leading-relaxed">{spot.seo.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {spot.vibe.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Hours */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Hours</h2>
                <div className="space-y-2">
                  {spot.hours.map((hours, idx) => (
                    <div 
                      key={hours.day} 
                      className={`flex justify-between ${
                        idx === today ? "bg-indigo-50 -mx-4 px-4 py-2 rounded-lg font-medium" : ""
                      }`}
                    >
                      <span className={idx === today ? "text-indigo-700" : "text-slate-600"}>
                        {hours.day}
                      </span>
                      <span className={idx === today ? "text-indigo-700" : "text-slate-900"}>
                        {hours.open && hours.close 
                          ? `${hours.open} - ${hours.close}` 
                          : "Closed"}
                        {idx === today && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {isOpenNow ? "Open now" : "Closed"}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Status */}
              <CommunityStatus spot={spot} />
              
              {/* Amenities Checklist */}
              <AmenitiesChecklist spot={spot} />

              {/* Community speed trend */}
              <CommunitySpeedTrend spotId={spot.id} />

              {/* Live Speed Test */}
              <SpeedTest spot={spot} />
              
              {/* Quick Info */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Info</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-indigo-600">⚡</span>
                    <span className="text-slate-600">
                      High-Speed Wi-Fi: <strong className="text-slate-900">{spot.highSpeedWifi ? "Yes" : "No"}</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-indigo-600">🌙</span>
                    <span className="text-slate-600">
                      Open Late: <strong className="text-slate-900">{spot.openLate ? "Yes" : "No"}</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-indigo-600">💰</span>
                    <span className="text-slate-600">
                      Price: <strong className="text-slate-900">{spot.seo.priceRange}</strong>
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Laptop Policy */}
              {spot.laptopPolicy && (
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">💻 Laptop Policy</h3>
                  <p className="text-amber-900 text-sm">{spot.laptopPolicy}</p>
                </div>
              )}
              
              {/* Expert Tip */}
              {spot.expertTip && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">🎯 Expert Tip</h3>
                  <p className="text-green-900 text-sm">{spot.expertTip}</p>
                </div>
              )}
              
              {/* Compare Links */}
              {compareCandidates.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">⚖️ Compare this spot</h3>
                  <div className="space-y-2">
                    {compareCandidates.map((candidate) => {
                      const slugs = [spot.slug, candidate.slug].sort((a, b) => a.localeCompare(b));
                      const pair = `${slugs[0]}-vs-${slugs[1]}`;
                      return (
                        <Link
                          key={candidate.id}
                          href={`/compare/${pair}`}
                          className="block text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          {spot.name} vs {candidate.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-3">
                <a 
                  href={spot.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  📍 Get Directions
                </a>
                {spot.website && (
                  <a 
                    href={spot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

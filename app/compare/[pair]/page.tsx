import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CompareSpots from "@/components/CompareSpots";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS } from "@/lib/constants";

const spots = spotsData.spots as WorkSpot[];

function normalizePair(pair: string) {
  const parts = pair.split("-vs-");
  if (parts.length !== 2) {
    return null;
  }

  const [slug1, slug2] = parts;
  if (!slug1 || !slug2 || slug1 === slug2) {
    return null;
  }

  const sorted = [slug1, slug2].sort((a, b) => a.localeCompare(b));
  return {
    slug1,
    slug2,
    canonicalPair: `${sorted[0]}-vs-${sorted[1]}`,
    leftSlug: sorted[0],
    rightSlug: sorted[1],
  };
}

function getSpotBySlug(slug: string) {
  return spots.find((spot) => spot.slug === slug);
}

export async function generateStaticParams() {
  const params: { pair: string }[] = [];

  for (let i = 0; i < spots.length; i += 1) {
    for (let j = i + 1; j < spots.length; j += 1) {
      const slugs = [spots[i].slug, spots[j].slug].sort((a, b) => a.localeCompare(b));
      params.push({ pair: `${slugs[0]}-vs-${slugs[1]}` });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const parsed = normalizePair(pair);

  if (!parsed) {
    return { title: "Comparison Not Found | NoVaNode" };
  }

  const leftSpot = getSpotBySlug(parsed.leftSlug);
  const rightSpot = getSpotBySlug(parsed.rightSlug);

  if (!leftSpot || !rightSpot) {
    return { title: "Comparison Not Found | NoVaNode" };
  }

  const title = `${leftSpot.name} vs ${rightSpot.name} | NoVaNode Comparison`;
  const description = `Compare ${leftSpot.name} and ${rightSpot.name} for remote work in Northern Virginia. Side-by-side Wi-Fi speeds, noise, outlets, seating, and policy details.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function ComparePairPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const parsed = normalizePair(pair);

  if (!parsed) {
    notFound();
  }

  if (pair !== parsed.canonicalPair) {
    redirect(`/compare/${parsed.canonicalPair}`);
  }

  const leftSpot = getSpotBySlug(parsed.leftSlug);
  const rightSpot = getSpotBySlug(parsed.rightSlug);

  if (!leftSpot || !rightSpot) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <nav className="text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-indigo-600">Compare</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{leftSpot.name} vs {rightSpot.name}</span>
        </nav>

        <header className="bg-white border border-slate-200 rounded-xl p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {leftSpot.name} vs {rightSpot.name}
          </h1>
          <p className="text-slate-600">
            Side-by-side comparison for remote work in {NEIGHBORHOODS[leftSpot.neighborhood]} and {NEIGHBORHOODS[rightSpot.neighborhood]}.
          </p>
        </header>

        <CompareSpots leftSpot={leftSpot} rightSpot={rightSpot} />

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick verdict</h2>
          <ul className="space-y-2 text-slate-700 text-sm">
            <li>• Best raw download speed: <strong>{leftSpot.logistics.wifiSpeedDown >= rightSpot.logistics.wifiSpeedDown ? leftSpot.name : rightSpot.name}</strong></li>
            <li>• Quieter environment: <strong>{leftSpot.logistics.noiseLevel <= rightSpot.logistics.noiseLevel ? leftSpot.name : rightSpot.name}</strong></li>
            <li>• Better review score: <strong>{leftSpot.seo.rating >= rightSpot.seo.rating ? leftSpot.name : rightSpot.name}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

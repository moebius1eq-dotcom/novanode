"use client";

import dynamic from "next/dynamic";
import { WorkSpot } from "@/lib/types";

const HomeMapToggle = dynamic(() => import("@/components/HomeMapToggle"), {
  ssr: false,
  loading: () => <p className="text-slate-500">Loading map…</p>,
});

interface HomeExploreProps {
  spots: WorkSpot[];
}

export default function HomeExplore({ spots }: HomeExploreProps) {
  return <HomeMapToggle spots={spots} />;
}

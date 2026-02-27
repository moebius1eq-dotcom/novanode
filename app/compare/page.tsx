import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare WiFi Spots | NoVaNode",
  description: "Compare remote work spots in Northern Virginia side-by-side. Find the best WiFi, seating, and amenities for your needs.",
};

// URL-based comparison page
export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ spots?: string }>;
}) {
  return <CompareClient searchParams={searchParams} />;
}

import { Metadata } from "next";
import spotsData from "@/data/spots.json";
import { WorkSpot } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Virginia Laptop Policies | NoVA Cafe & Coworking Wi-Fi Guide",
  description: "Current laptop policies for NoVA cafes and coworking spaces. Know before you go - which spots allow laptops on weekends, which have time limits, and where to work in Northern Virginia.",
};

const laptopPolicies = [
  {
    name: "Northside Social",
    neighborhood: "Arlington (Clarendon)",
    policy: "Laptops welcome - Upstairs wine bar and downstairs cafe both laptop-friendly all day",
    weekendPolicy: "No restrictions",
    wifiQuality: "45 Mbps",
    tip: "Best at the communal table downstairs"
  },
  {
    name: "Blue Print Coffee",
    neighborhood: "Arlington",
    policy: "Laptops welcome all day",
    weekendPolicy: "No restrictions",
    wifiQuality: "150 Mbps",
    tip: "Dedicated work desks available"
  },
  {
    name: "Bean There Done That",
    neighborhood: "Tysons",
    policy: "Laptops welcome until 5pm on weekdays",
    weekendPolicy: "Limited - brunch crowd takes priority",
    wifiQuality: "95 Mbps",
    tip: "Arrive early on weekends"
  },
  {
    name: "3DEN Tysons",
    neighborhood: "Tysons Corner",
    policy: "Full access - this IS a coworking space",
    weekendPolicy: "Open 10am-6pm Sun, 9am-7pm Sat",
    wifiQuality: "200 Mbps (Fiber)",
    tip: "Day passes available ($35)"
  },
  {
    name: "Misha's Coffee",
    neighborhood: "Old Town Alexandria",
    policy: "Laptops welcome but extremely limited seating",
    weekendPolicy: "Very crowded - arrive before 9am",
    wifiQuality: "30 Mbps",
    tip: "Communal table has 2 outlets only"
  },
  {
    name: "The Wireless Cowork",
    neighborhood: "Alexandria (King St)",
    policy: "Full coworking access - laptops welcome",
    weekendPolicy: "Open 9am-6pm Sat, closed Sun",
    wifiQuality: "500 Mbps",
    tip: "Soundproof phone booths available"
  },
  {
    name: "Reston Roasters",
    neighborhood: "Reston",
    policy: "Laptops welcome all day",
    weekendPolicy: "No restrictions",
    wifiQuality: "200 Mbps",
    tip: "Great morning focus sessions"
  },
  {
    name: "Arlington Public Library",
    neighborhood: "Arlington",
    policy: "Laptops welcome - study rooms available",
    weekendPolicy: "Open 12pm-6pm Sun, 10am-6pm Sat",
    wifiQuality: "100 Mbps",
    tip: "Free and library-quiet"
  },
  {
    name: "Compass Coffee",
    neighborhood: "Arlington",
    policy: "Laptops welcome",
    weekendPolicy: "No restrictions",
    wifiQuality: "75 Mbps",
    tip: "Multiple locations in Arlington"
  },
  {
    name: "Tatte Bakery",
    neighborhood: "Arlington",
    policy: "Laptops OK but discouraged during peak hours",
    weekendPolicy: "Very crowded on weekends",
    wifiQuality: "50 Mbps",
    tip: "Go early morning for best seating"
  }
];

export default function LaptopPoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-amber-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <a href="/" className="inline-flex items-center gap-2 text-amber-200 hover:text-white transition-colors">
              ← Back to NoVaNode
            </a>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💻 Virginia Laptop Policies
          </h1>
          <p className="text-lg md:text-xl text-amber-100">
            Current laptop policies for NoVA cafes & coworking spaces. 
            Updated February 2026.
          </p>
          <p className="mt-4 text-amber-200 text-sm">
            AI models miss these real-time details. Bookmark this page.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Location</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900 hidden md:table-cell">Neighborhood</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900">Weekend Policy</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-900 hidden lg:table-cell">Wi-Fi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {laptopPolicies.map((spot, idx) => {
                // Find matching spot in database
                const dbSpot = (spotsData.spots as WorkSpot[]).find(
                  s => s.name.toLowerCase().includes(spot.name.toLowerCase().split(" ")[0])
                );
                const spotUrl = dbSpot ? `/location/${dbSpot.neighborhood}/${dbSpot.slug}` : null;
                
                return (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    {spotUrl ? (
                      <a href={spotUrl} className="font-medium text-slate-900 hover:text-indigo-600">
                        {spot.name}
                      </a>
                    ) : (
                      <div className="font-medium text-slate-900">{spot.name}</div>
                    )}
                    <div className="text-sm text-slate-500 md:hidden">{spot.neighborhood}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 hidden md:table-cell">{spot.neighborhood}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      spot.weekendPolicy.includes("No restrictions") || spot.weekendPolicy.includes("Open")
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {spot.weekendPolicy}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <span className="text-indigo-600">⚡</span>
                      {spot.wifiQuality}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expert Tips Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🎯 Pro Tips</h2>
          <div className="grid gap-4">
            {laptopPolicies.filter(s => s.tip).map((spot, idx) => (
              <div key={idx} className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="font-semibold text-green-900">{spot.name}</div>
                <p className="text-green-800 text-sm">{spot.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-indigo-600 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Know a spot's policy that changed?
          </h3>
          <p className="text-indigo-100 mb-4">
            Help the NoVA remote work community stay informed.
          </p>
          <a 
            href="#" 
            className="inline-block bg-white text-indigo-600 font-medium px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Submit an Update
          </a>
        </div>
      </div>
    </div>
  );
}

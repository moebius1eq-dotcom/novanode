import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Places to Work in Northern Virginia | NoVaNode",
  description: "Discover free public spaces with WiFi in NoVA. Libraries, mall lobbies, and public buildings perfect for remote work without buying coffee.",
};

// Free alternatives data
const freeSpots = [
  {
    name: "Arlington Public Library - Central",
    neighborhood: "arlington",
    address: "1015 N Quincy St, Arlington, VA 22201",
    type: "Library",
    wifi: "Free (100 Mbps)",
    parking: "Free garage",
    hours: "Mon-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    tips: "Study rooms available. Very quiet. Power outlets at most desks.",
    url: "/location/arlington/arlington-central-library"
  },
  {
    name: "Fairfax County Public Library - Main",
    neighborhood: "fairfax",
    address: "10360 North St, Fairfax, VA 22030",
    type: "Library",
    wifi: "Free (75 Mbps)",
    parking: "Free lot",
    hours: "Mon-Thu 10am-9pm, Fri-Sat 10am-6pm, Sun 1pm-5pm",
    tips: "Good study rooms. Decent coffee shop in lobby.",
    url: "#"
  },
  {
    name: "Tysons Galleria Food Court (3rd Floor)",
    neighborhood: "tysons",
    address: "2001 International Dr, McLean, VA 22102",
    type: "Mall",
    wifi: "Free (limited)",
    parking: "Free garage",
    hours: "Daily 10am-9pm",
    tips: "Hidden gem near theater. Very quiet. Limited outlets.",
    url: "/location/tysons/tysons-galleria-third-floor"
  },
  {
    name: "Amazon HQ2 Met Park Food Court",
    neighborhood: "arlington",
    address: "2100 Crystal Dr, Arlington, VA 22202",
    type: "Corporate Lobby",
    wifi: "Free Amazon Guest WiFi",
    parking: "Paid garage nearby",
    hours: "Food court 7am-9pm",
    tips: "Clean, modern, plenty of seating. May need to sign in at desk.",
    url: "#"
  },
  {
    name: "Capital One Hall Public Spaces",
    neighborhood: "tysons",
    address: "1601 Spring Hill Rd, Tysons, VA 22102",
    type: "Corporate Campus",
    wifi: "Free Guest WiFi",
    parking: "Free visitor parking",
    hours: "Building 7am-10pm",
    tips: "Beautiful modern spaces. Coffee shop inside. Very quiet weekdays.",
    url: "#"
  },
  {
    name: "Alexandria City Hall",
    neighborhood: "alexandria",
    address: "301 King St, Alexandria, VA 22314",
    type: "Government Building",
    wifi: "Free City WiFi",
    parking: "Paid street parking",
    hours: "Mon-Fri 8am-5pm",
    tips: "Surprisingly good for focused work. Quiet atmosphere.",
    url: "#"
  },
  {
    name: "Reston Regional Library",
    neighborhood: "reston",
    address: "11925 Lawyers Rd, Reston, VA 20190",
    type: "Library",
    wifi: "Free (100 Mbps)",
    parking: "Free lot",
    hours: "Mon-Thu 10am-9pm, Fri-Sat 10am-6pm, Sun 1pm-5pm",
    tips: "Large quiet zones. Good meeting rooms. Modern facility.",
    url: "#"
  }
];

export default function FreeAlternativesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
            💰 Free Alternatives
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Work for Free in NoVA
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tired of buying $7 lattes just to use WiFi? Here's our curated list of 
            free public spaces with reliable internet for remote workers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-green-600">{freeSpots.length}</p>
            <p className="text-sm text-slate-500">Free Locations</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-sm text-slate-500">No Purchase Required</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">7</p>
            <p className="text-sm text-slate-500">Neighborhoods</p>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {freeSpots.map((spot, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {spot.type === "Library" ? "📚" : spot.type === "Mall" ? "🛒" : "🏢"}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{spot.name}</h3>
                      <p className="text-sm text-slate-500">{spot.address}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">WiFi</p>
                      <p className="text-sm font-medium text-slate-700">{spot.wifi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Parking</p>
                      <p className="text-sm font-medium text-slate-700">{spot.parking}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Hours</p>
                      <p className="text-sm font-medium text-slate-700">{spot.hours}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">💡 Pro Tip:</span> {spot.tips}
                    </p>
                  </div>
                </div>

                {spot.url.startsWith("/") && (
                  <a
                    href={spot.url}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    View Details →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-slate-600 mb-4">
            Know a free spot we missed? Help the community!
          </p>
          <a
            href="mailto:hello@novanode.com?subject=Free%20Spot%20Suggestion"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>📧</span>
            Submit a Free Spot
          </a>
        </div>
      </section>
    </div>
  );
}

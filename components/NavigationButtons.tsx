"use client";

interface NavigationButtonsProps {
  address: string;
  name: string;
}

export default function NavigationButtons({ address, name }: NavigationButtonsProps) {
  const encodedAddress = encodeURIComponent(address);
  const encodedName = encodeURIComponent(name);

  return (
    <div className="flex gap-2">
      {/* Google Maps */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Take Me There
      </a>
      
      {/* Uber */}
      <a
        href={`https://m.uber.com/ul/?action=setPickup&dropoff[query]=${encodedAddress}&dropoff[name]=${encodedName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center py-2.5 px-4 bg-black text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        title="Get an Uber"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </a>
    </div>
  );
}
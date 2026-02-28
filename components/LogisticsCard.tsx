"use client";

import { LogisticsData } from "@/lib/types";
import { formatWiFiSpeed, getNoiseLevelLabel } from "@/lib/utils";
import { OUTLET_DENSITY_LABELS, SEATING_TYPE_LABELS } from "@/lib/constants";

interface LogisticsCardProps {
  logistics: LogisticsData;
  compact?: boolean;
}

export default function LogisticsCard({ logistics, compact = false }: LogisticsCardProps) {
  const noise = getNoiseLevelLabel(logistics.noiseLevel);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-3 text-sm">
        {/* Wi-Fi */}
        <div className="flex items-center gap-1.5 text-slate-700">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <span className="font-semibold">{formatWiFiSpeed(logistics.wifiSpeedDown)}</span>
        </div>

        {/* Outlets */}
        <div className="flex items-center gap-1.5 text-slate-700">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{OUTLET_DENSITY_LABELS[logistics.outletDensity]}</span>
        </div>

        {/* Noise */}
        <div className={`flex items-center gap-1.5 ${noise.color}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75z" />
          </svg>
          <span>{noise.label}</span>
        </div>
      </div>
    );
  }

  // Full logistics card with "Logistics Pills" - Zero-Click info for 2026
  return (
    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
      {/* Zero-Click Pills Row - High Contrast for Scannability */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Wi-Fi Speed Pill */}
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
          logistics.wifiSpeedDown >= 100 
            ? "bg-green-600 text-white" 
            : "bg-slate-600 text-white"
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          {formatWiFiSpeed(logistics.wifiSpeedDown)} Mbps
        </div>

        {/* Outlets Pill */}
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
          logistics.outletDensity === "plenty"
            ? "bg-blue-600 text-white"
            : logistics.outletDensity === "moderate"
            ? "bg-amber-500 text-white"
            : "bg-slate-500 text-white"
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {logistics.outletDensity === "plenty" ? "🔋 Power" : 
           logistics.outletDensity === "moderate" ? "🔌 Some Outlets" : "⚡ Limited"}
        </div>

        {/* Noise Level Pill */}
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
          logistics.noiseLevel <= 45
            ? "bg-indigo-600 text-white"
            : logistics.noiseLevel <= 70
            ? "bg-yellow-500 text-white"
            : "bg-red-500 text-white"
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75z" />
          </svg>
          {noise.label}
        </div>

        {/* Verified Pill */}
        <div className="px-3 py-1.5 rounded-full text-sm font-bold bg-slate-800 text-white flex items-center gap-1.5">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
      </div>
      
      {/* Detailed Grid */}
      <div className="logistics-grid">
        {/* Wi-Fi Speed */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <span className="text-xs font-medium text-slate-500 uppercase">Wi-Fi Speed</span>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-slate-900">
              {formatWiFiSpeed(logistics.wifiSpeedDown)}
              <span className="text-xs font-normal text-slate-500 ml-1">down</span>
            </div>
            <div className="text-sm text-slate-600">
              {formatWiFiSpeed(logistics.wifiSpeedUp)}
              <span className="text-xs font-normal text-slate-500 ml-1">up</span>
            </div>
          </div>
        </div>

        {/* Outlet Density */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium text-slate-500 uppercase">Outlets</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            {OUTLET_DENSITY_LABELS[logistics.outletDensity]}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {logistics.outletDensity === "plenty" ? "Every seat has access" : 
             logistics.outletDensity === "moderate" ? "Shared access" : "Limited outlets"}
          </div>
        </div>

        {/* Noise Level */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75z" />
            </svg>
            <span className="text-xs font-medium text-slate-500 uppercase">Noise</span>
          </div>
          <div className={`text-lg font-bold ${noise.color}`}>
            {noise.label}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ~{logistics.noiseLevel} dB
          </div>
        </div>

        {/* Seating Type */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs font-medium text-slate-500 uppercase">Seating</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {logistics.seatingType.slice(0, 3).map((type) => (
              <span 
                key={type}
                className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded"
              >
                {SEATING_TYPE_LABELS[type]}
              </span>
            ))}
            {logistics.seatingType.length > 3 && (
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                +{logistics.seatingType.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verified Badge */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Verified {new Date(logistics.verifiedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

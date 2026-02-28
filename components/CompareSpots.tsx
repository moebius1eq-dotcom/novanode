import Link from "next/link";
import { WorkSpot } from "@/lib/types";
import { NEIGHBORHOODS, OUTLET_DENSITY_LABELS, SEATING_TYPE_LABELS } from "@/lib/constants";

interface CompareSpotsProps {
  leftSpot: WorkSpot;
  rightSpot: WorkSpot;
}

interface Metric {
  label: string;
  leftValue: number;
  rightValue: number;
  suffix?: string;
  higherIsBetter?: boolean;
}

function metricWinnerClass(isWinner: boolean) {
  return isWinner ? "text-green-700 font-semibold" : "text-slate-900";
}

function yesNo(value: boolean | undefined) {
  return value ? "Yes" : "No";
}

export default function CompareSpots({ leftSpot, rightSpot }: CompareSpotsProps) {
  const metrics: Metric[] = [
    {
      label: "Wi-Fi Download",
      leftValue: leftSpot.logistics.wifiSpeedDown,
      rightValue: rightSpot.logistics.wifiSpeedDown,
      suffix: "Mbps",
      higherIsBetter: true,
    },
    {
      label: "Wi-Fi Upload",
      leftValue: leftSpot.logistics.wifiSpeedUp,
      rightValue: rightSpot.logistics.wifiSpeedUp,
      suffix: "Mbps",
      higherIsBetter: true,
    },
    {
      label: "Noise Level",
      leftValue: leftSpot.logistics.noiseLevel,
      rightValue: rightSpot.logistics.noiseLevel,
      suffix: "dB",
      higherIsBetter: false,
    },
    {
      label: "Rating",
      leftValue: leftSpot.seo.rating,
      rightValue: rightSpot.seo.rating,
      higherIsBetter: true,
    },
    {
      label: "Review Count",
      leftValue: leftSpot.seo.reviewCount,
      rightValue: rightSpot.seo.reviewCount,
      higherIsBetter: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200">
        <div className="p-4 text-sm font-semibold text-slate-600">Metric</div>
        <div className="p-4 text-center border-l border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">{leftSpot.name}</h2>
          <p className="text-xs text-slate-500">{NEIGHBORHOODS[leftSpot.neighborhood]}</p>
        </div>
        <div className="p-4 text-center border-l border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">{rightSpot.name}</h2>
          <p className="text-xs text-slate-500">{NEIGHBORHOODS[rightSpot.neighborhood]}</p>
        </div>
      </div>

      {metrics.map((metric) => {
        const leftWins = metric.higherIsBetter === false
          ? metric.leftValue < metric.rightValue
          : metric.leftValue > metric.rightValue;
        const rightWins = metric.higherIsBetter === false
          ? metric.rightValue < metric.leftValue
          : metric.rightValue > metric.leftValue;

        return (
          <div key={metric.label} className="grid grid-cols-3 border-b border-slate-100">
            <div className="p-4 text-sm font-medium text-slate-700">{metric.label}</div>
            <div className={`p-4 text-center border-l border-slate-100 ${metricWinnerClass(leftWins)}`}>
              {metric.leftValue}
              {metric.suffix ? <span className="ml-1 text-xs text-slate-500">{metric.suffix}</span> : null}
            </div>
            <div className={`p-4 text-center border-l border-slate-100 ${metricWinnerClass(rightWins)}`}>
              {metric.rightValue}
              {metric.suffix ? <span className="ml-1 text-xs text-slate-500">{metric.suffix}</span> : null}
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-3 border-b border-slate-100">
        <div className="p-4 text-sm font-medium text-slate-700">Outlet Density</div>
        <div className="p-4 text-center border-l border-slate-100 text-slate-900">
          {OUTLET_DENSITY_LABELS[leftSpot.logistics.outletDensity]}
        </div>
        <div className="p-4 text-center border-l border-slate-100 text-slate-900">
          {OUTLET_DENSITY_LABELS[rightSpot.logistics.outletDensity]}
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-slate-100">
        <div className="p-4 text-sm font-medium text-slate-700">Open Late</div>
        <div className="p-4 text-center border-l border-slate-100 text-slate-900">{yesNo(leftSpot.openLate)}</div>
        <div className="p-4 text-center border-l border-slate-100 text-slate-900">{yesNo(rightSpot.openLate)}</div>
      </div>

      <div className="grid grid-cols-3 border-b border-slate-100">
        <div className="p-4 text-sm font-medium text-slate-700">Weekend Friendly</div>
        <div className="p-4 text-center border-l border-slate-100 text-slate-900">{yesNo(leftSpot.weekendFriendly)}</div>
        <div className="p-4 text-center border-l border-slate-100 text-slate-900">{yesNo(rightSpot.weekendFriendly)}</div>
      </div>

      <div className="grid grid-cols-3">
        <div className="p-4 text-sm font-medium text-slate-700">Seating</div>
        <div className="p-4 border-l border-slate-100 text-xs text-slate-700">
          {leftSpot.logistics.seatingType.map((seat) => SEATING_TYPE_LABELS[seat] ?? seat).join(", ")}
        </div>
        <div className="p-4 border-l border-slate-100 text-xs text-slate-700">
          {rightSpot.logistics.seatingType.map((seat) => SEATING_TYPE_LABELS[seat] ?? seat).join(", ")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 border-t border-slate-200">
        <Link
          href={`/location/${leftSpot.neighborhood}/${leftSpot.slug}`}
          className="text-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white"
        >
          View {leftSpot.name}
        </Link>
        <Link
          href={`/location/${rightSpot.neighborhood}/${rightSpot.slug}`}
          className="text-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white"
        >
          View {rightSpot.name}
        </Link>
      </div>
    </div>
  );
}

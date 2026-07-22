"use client";

import dynamic from "next/dynamic";
import type { AutoCollectiveRoute } from "@/app/dinas/types/auto-collective";
import {
  MapPin,
  AlertTriangle,
  Construction,
  Truck,
  User,
} from "lucide-react";

const AutoCollectiveRouteMap = dynamic(
  () => import("./auto-collective-route-map").then((mod) => mod.AutoCollectiveRouteMap),
  {
    ssr: false,
    loading: () => <div className="h-56 animate-pulse bg-sky-50" />,
  },
);

interface Props {
  route: AutoCollectiveRoute;
  index: number;
  onRemoveStop?: (stopId: string) => void;
  onChangeVehicle?: () => void;
  onChangeOfficer?: () => void;
}

function PriorityBadge({ level }: { level: string | null }) {
  const colors: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-800 border-red-300",
    HIGH: "bg-orange-100 text-orange-800 border-orange-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
    LOW: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${colors[level ?? "LOW"] ?? colors.LOW}`}
    >
      {level ?? "LOW"}
    </span>
  );
}

export function AutoCollectiveRouteCard({
  route,
  index,
  onRemoveStop,
}: Props) {
  const capPercent = route.vehicleCapacity > 0
    ? Math.round((route.totalEstimatedLoad / route.vehicleCapacity) * 100)
    : 0;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 bg-emerald-50/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
            {index + 1}
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-neutral-800">
              Rute #{index + 1}
            </h3>
            <p className="text-[11px] text-neutral-500">
              {route.stops.length} titik &middot;{" "}
              {route.estimatedDistanceKm != null
                ? `${route.estimatedDistanceKm} km`
                : "—"}{" "}
              &middot;{" "}
              {route.estimatedDurationMinutes != null
                ? `${route.estimatedDurationMinutes} mnt`
                : "—"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-500">
          {route.routingSource}
        </span>
      </div>

      <AutoCollectiveRouteMap route={route} color="#059669" />

      <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <Truck className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-neutral-700">
            {route.kendaraanJenis ?? "Kendaraan"}
          </p>
          <p className="text-[10px] text-neutral-500">
            Kap: {route.vehicleCapacity} kg &middot; Sisa: {route.remainingCapacity} kg
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <User className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-neutral-700">
            {route.petugasNama ?? "Petugas"}
          </p>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="mb-2 flex items-center justify-between text-[10px]">
          <span className="text-neutral-500">
            Kapasitas Terpakai: {capPercent}%
          </span>
          <span className="font-semibold text-neutral-600">
            {route.totalEstimatedLoad} / {route.vehicleCapacity} kg
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
          <div
            className={`h-full rounded-full transition-all ${
              capPercent > 90
                ? "bg-red-500"
                : capPercent > 60
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(capPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="border-t border-neutral-100 px-4 py-2">
        <p className="mb-2 text-[11px] font-bold text-neutral-500">
          URUTAN PICKUP
        </p>
        <div className="space-y-1.5">
          {route.stops.map((stop, stopIdx) => (
            <div
              key={stop.reportId}
              className="group flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 px-2.5 py-2"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-[10px] font-bold text-neutral-600">
                {stopIdx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3 shrink-0 text-neutral-400" />
                  <p className="truncate text-xs font-medium text-neutral-700">
                    {stop.address ?? `${stop.lat.toFixed(4)}, ${stop.lng.toFixed(4)}`}
                  </p>
                  <PriorityBadge level={stop.priorityLevel} />
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-400">
                  <span>{stop.estimatedLoadKg} kg</span>
                  <span>&middot;</span>
                  <span className="capitalize">{stop.sizeCategory}</span>
                  {stop.drainageRisk && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-blue-100 px-1 py-0.5 text-blue-700">
                      <AlertTriangle className="size-2.5" /> Drainase
                    </span>
                  )}
                  {stop.accessObstructionRisk && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1 py-0.5 text-amber-700">
                      <Construction className="size-2.5" /> Akses
                    </span>
                  )}
                </div>
                {stop.wasteTypes.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {stop.wasteTypes.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-[9px] text-neutral-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {onRemoveStop && (
                <button
                  onClick={() => onRemoveStop(stop.reportId)}
                  className="shrink-0 rounded p-0.5 text-neutral-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title="Hapus titik"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

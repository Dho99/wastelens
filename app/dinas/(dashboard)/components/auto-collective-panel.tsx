"use client";

import { useState, useCallback, useEffect } from "react";
import {
  X,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Truck,
  MapPin,
  Layers,
} from "lucide-react";
import { AutoCollectiveRouteCard } from "./auto-collective-route-card";
import type {
  AutoCollectivePreview,
} from "../../types/auto-collective";

interface Props {
  onClose: () => void;
  selectedPickupIds?: string[];
}

export function AutoCollectivePanel({ onClose, selectedPickupIds = [] }: Props) {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<AutoCollectivePreview | null>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fetchPreviewCore = useCallback(async () => {
    const res = await fetch("/api/dinas/auto-collective/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportIds: selectedPickupIds.length > 0 ? selectedPickupIds : undefined }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Gagal memuat preview");
    return data.data as AutoCollectivePreview;
  }, [selectedPickupIds]);

  useEffect(() => {
    let cancelled = false;
    fetchPreviewCore()
      .then((result) => { if (!cancelled) setPreview(result); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetchPreviewCore]);

  const loadPreview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPreviewCore();
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat");
    } finally {
      setLoading(false);
    }
  }, [fetchPreviewCore]);

  const handleRemoveStop = useCallback(
    (temporaryRouteId: string, stopId: string) => {
      if (!preview) return;
      const updatedRoutes = preview.routes
        .map((route) => {
          if (route.temporaryRouteId !== temporaryRouteId) return route;
          const removedStop = route.stops.find((s) => s.reportId === stopId);
          if (!removedStop) return route;
          return {
            ...route,
            stops: route.stops.filter((s) => s.reportId !== stopId),
            totalEstimatedLoad: route.totalEstimatedLoad - removedStop.estimatedLoadKg,
            remainingCapacity: route.remainingCapacity + removedStop.estimatedLoadKg,
            routeGeometry: [],
            estimatedDistanceKm: null,
            estimatedDurationMinutes: null,
            routingSource: "HAVERSINE" as const,
          };
        })
        .filter((route) => route.stops.length > 0);
      setPreview({ ...preview, routes: updatedRoutes });
    },
    [preview],
  );

  const handleRegenerate = useCallback(async () => {
    if (!preview || preview.routes.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dinas/auto-collective/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routes: preview.routes,
          modifications: {
            routeModifications: preview.routes.map((r) => ({
              temporaryRouteId: r.temporaryRouteId,
              removeStopIds: [],
            })),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal regenerate");
      setPreview(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal regenerate");
    } finally {
      setLoading(false);
    }
  }, [preview]);

  const handleConfirm = useCallback(async () => {
    if (!preview || preview.routes.length === 0) return;
    setConfirming(true);
    setError("");
    try {
      const idempotencyKey = `auto-collective-${Date.now()}`;
      const routes = preview.routes.map((route) => ({
        temporaryRouteId: route.temporaryRouteId,
        petugasId: route.petugasId!,
        kendaraanId: route.kendaraanId!,
        stopIds: route.stops.map((s) => s.reportId),
        routeOrder: route.stops.map((_, idx) => idx + 1),
      }));

      const res = await fetch("/api/dinas/auto-collective/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotencyKey, routes }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Konfirmasi gagal");
        return;
      }

      setConfirmResult({
        success: true,
        message: `${data.data.assignedRoutes.length} rute berhasil di-assign`,
      });

      setTimeout(() => {
        setConfirmResult(null);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Konfirmasi gagal");
    } finally {
      setConfirming(false);
    }
  }, [preview, onClose]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <header className="flex h-14 shrink-0 items-center border-b border-neutral-200 px-4 rounded-t-[28px]">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Layers className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-800">
                Rute Otomatis Pickup
              </h2>
              <p className="text-[11px] text-neutral-500">
                Algoritma: Greedy Capacity-Aware Nearest-Neighbor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-2 hover:bg-neutral-100"
          >
            <X className="size-5" />
          </button>
        </header>

        {confirmResult && (
          <div
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              confirmResult.success
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <CheckCircle2 className="size-4" />
            {confirmResult.message}
          </div>
        )}

        {!confirmResult && (
          <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5 shrink-0">
            <button
              onClick={handleRegenerate}
              disabled={loading || !preview}
              className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Regenerate
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming || !preview || preview.routes.length === 0}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {confirming ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              {confirming ? "Mengonfirmasi..." : "Konfirmasi Semua"}
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-sm text-neutral-500">
                Membangun rute optimal...
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Memproses pickup point & menghitung jarak OSRM
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertTriangle className="mx-auto size-8 text-red-400" />
              <p className="mt-2 text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={loadPreview}
                className="mt-3 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {preview && !loading && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <Truck className="size-3.5" />
                <span>
                  {preview.routes.length} rute terbentuk &middot;{" "}
                  {preview.unassignedReports.length} titik tidak terjangkau
                </span>
              </div>

              {preview.routes.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-neutral-200 p-10 text-center">
                  <MapPin className="mx-auto size-8 text-neutral-300" />
                  <p className="mt-3 text-sm font-medium text-neutral-500">
                    Tidak ada rute yang dapat dibentuk
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Semua pickup point sudah di-assign atau tidak ada kendaraan tersedia
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {preview.routes.map((route, idx) => (
                  <AutoCollectiveRouteCard
                    key={route.temporaryRouteId}
                    route={route}
                    index={idx}
                    onRemoveStop={(stopId) =>
                      handleRemoveStop(route.temporaryRouteId, stopId)
                    }
                  />
                ))}
              </div>

              {preview.unassignedReports.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <AlertTriangle className="size-3.5" />
                    Tidak Terjangkau ({preview.unassignedReports.length})
                  </h4>
                  <p className="mt-1 text-[11px] text-amber-600">
                    Titik berikut tidak dapat dimasukkan ke rute karena kapasitas
                    kendaraan tidak mencukupi atau tidak ada kendaraan/petugas
                    tersedia. Assign manual diperlukan.
                  </p>
                  <div className="mt-2 space-y-1">
                    {preview.unassignedReports.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-2 rounded bg-white/70 px-2.5 py-1.5 text-[11px]"
                      >
                        <MapPin className="size-3 text-amber-500" />
                        <span className="truncate">
                          {r.address_text ?? `${r.lokasi_lat}, ${r.lokasi_lng}`}
                        </span>
                        <span className="ml-auto shrink-0 text-amber-600">
                          {r.estimatedLoadKg} kg
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}

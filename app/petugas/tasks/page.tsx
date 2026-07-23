"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getAssignedTasksWithRoute, type TaskItem } from "@/lib/services/petugas-task";
import { getOptimizedRoute } from "@/lib/services/route-optimization";
import { MapPin, Truck, Route } from "lucide-react";
import { routeColorAt } from "@/app/dinas/(dashboard)/lib/route-colors";

const TaskRouteMap = dynamic(
  () => import("./task-route-map").then((m) => m.TaskRouteMap),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-neutral-100" /> },
);

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [routeMeta, setRouteMeta] = useState<{
    id: string;
    status: string;
    routeGeometry: [number, number][] | null;
    estimatedDistanceKm: number | null;
    estimatedDurationMinutes: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gpsError, setGpsError] = useState("");
  const [sorted, setSorted] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { tasks: taskList, route } = await getAssignedTasksWithRoute();
      setRouteMeta(route);

      if (taskList.length === 0) {
        setTasks([]);
        setLoading(false);
        return;
      }

      if (taskList.some((task) => task.route_order != null)) {
        setTasks(taskList);
        setSorted(true);
        setLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setTasks(taskList);
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const optimized = await getOptimizedRoute(currentPos, taskList);
          setTasks(optimized as TaskItem[]);
          setSorted(true);
          setLoading(false);
        },
        () => {
          setGpsError("Gunakan GPS untuk urutan optimal. Menampilkan semua tugas.");
          setTasks(taskList);
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 10000 },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat tugas");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadTasks(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadTasks]);

  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm font-medium text-red-800">{error}</p>
          <button
            onClick={loadTasks}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const routeColor = routeColorAt(0);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Daftar Tugas</h2>
        {sorted && tasks.length > 1 && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Urut rute
          </span>
        )}
      </div>

      {routeMeta && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <Route className="size-3.5" />
            Detail rute OSRM
          </div>
          <p className="mt-1">
            {routeMeta.estimatedDistanceKm != null
              ? `${routeMeta.estimatedDistanceKm.toFixed(1)} km`
              : "—"}{" "}
            ·{" "}
            {routeMeta.estimatedDurationMinutes != null
              ? `${Math.round(routeMeta.estimatedDurationMinutes)} mnt`
              : "—"}{" "}
            · status {routeMeta.status}
          </p>
        </div>
      )}

      {tasks.length > 0 && (
        <TaskRouteMap
          tasks={tasks}
          color={routeColor}
          routeGeometry={routeMeta?.routeGeometry ?? null}
        />
      )}

      {gpsError && (
        <div className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
          {gpsError}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center">
          <p className="text-sm font-medium text-neutral-500">Tidak ada tugas saat ini</p>
          <p className="mt-1 text-xs text-neutral-400">
            Tugas baru akan muncul setelah ditugaskan oleh Dinas
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <button
              key={task.id}
              onClick={() => router.push(`/petugas/tasks/${task.id}`)}
              className="w-full rounded-lg border bg-white p-4 text-left hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                {sorted && (
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: routeColor }}
                  >
                    {task.route_order ?? index + 1}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">
                      {task.user?.nama ?? "Pelapor"}
                    </p>
                    <span className="shrink-0 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      {task.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {task.lokasi_lat.toFixed(4)}, {task.lokasi_lng.toFixed(4)}
                    </span>
                    <span className="capitalize">{task.kategori_ukuran}</span>
                    {task.rekomendasi_kendaraan && (
                      <span className="flex items-center gap-1">
                        <Truck className="size-3" />
                        {task.rekomendasi_kendaraan}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface LatLng {
  lat: number;
  lng: number;
}

export interface Task {
  id: string;
  lokasi_lat: number;
  lokasi_lng: number;
  kategori_ukuran: string;
  rekomendasi_kendaraan: string | null;
  status: string;
  [key: string]: unknown;
}

interface OSRMTableResponse {
  code: string;
  distances: number[][];
  durations: number[][];
}

export async function getOptimizedRoute(
  currentPosition: LatLng,
  tasks: Task[]
): Promise<Task[]> {
  if (tasks.length <= 1) return tasks;

  const coords = [
    [currentPosition.lng, currentPosition.lat],
    ...tasks.map((t) => [t.lokasi_lng, t.lokasi_lat]),
  ];

  const coordStr = coords.map((c) => c.join(",")).join(";");

  try {
    const url = `https://router.project-osrm.org/table/v1/driving/${coordStr}?sources=0&annotations=duration`;

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!res.ok) {
      console.warn("OSRM table API returned error, falling back to unsorted");
      return tasks;
    }

    const data: OSRMTableResponse = await res.json();

    if (data.code !== "Ok" || !data.durations?.[0]) {
      console.warn("OSRM table response invalid, falling back to unsorted");
      return tasks;
    }

    const durations = data.durations[0].slice(1);
    const indexed = tasks.map((task, i) => ({ task, duration: durations[i] ?? Infinity }));

    indexed.sort((a, b) => a.duration - b.duration);

    return indexed.map((item) => item.task);
  } catch (err) {
    console.warn("OSRM table request failed, falling back to unsorted:", err);
    return tasks;
  }
}

export async function fetchRouteGeometry(
  from: LatLng,
  to: LatLng
): Promise<{
  coordinates: [number, number][];
  distance: number;
  duration: number;
}> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full&steps=false`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.[0]) {
      throw new Error("No route found");
    }

    const route = data.routes[0] as {
      distance: number;
      duration: number;
      geometry: { coordinates: [number, number][] };
    };

    return {
      coordinates: route.geometry.coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  } catch (err) {
    console.warn("OSRM route fetch failed, using straight line:", err);
    const distance = haversineDistance(from.lat, from.lng, to.lat, to.lng);
    return {
      coordinates: [
        [from.lng, from.lat],
        [to.lng, to.lat],
      ],
      distance,
      duration: distance / 8.3,
    };
  }
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface EligibleReport {
  id: string;
  lokasi_lat: number;
  lokasi_lng: number;
  kategori_ukuran: string;
  corrected_kategori_ukuran: string | null;
  priority_score: number | null;
  priority_level: string | null;
  estimated_load_unit: number | null;
  estimatedLoadKg: number;
  address_text: string | null;
  district: string | null;
  drainage_risk: boolean | null;
  access_obstruction_risk: boolean | null;
  waste_types: string[];
  createdAt: string;
  needs_manual_review: boolean | null;
}

export interface AutoCollectiveStop {
  reportId: string;
  lat: number;
  lng: number;
  address: string | null;
  priorityLevel: string | null;
  priorityScore: number | null;
  estimatedLoadKg: number;
  sizeCategory: string;
  drainageRisk: boolean | null;
  accessObstructionRisk: boolean | null;
  wasteTypes: string[];
}

export interface AutoCollectiveRoute {
  temporaryRouteId: string;
  petugasId: string | null;
  petugasNama: string | null;
  kendaraanId: string | null;
  kendaraanJenis: string | null;
  kendaraanPlat: string | null;
  vehicleCapacity: number;
  availableCapacity: number;
  totalEstimatedLoad: number;
  remainingCapacity: number;
  estimatedDistanceKm: number | null;
  estimatedDurationMinutes: number | null;
  routingSource: "OSRM" | "HAVERSINE";
  stops: AutoCollectiveStop[];
}

export interface AutoCollectivePreview {
  routes: AutoCollectiveRoute[];
  unassignedReports: EligibleReport[];
}

export interface ConfirmRoute {
  temporaryRouteId: string;
  petugasId: string;
  kendaraanId: string;
  stopIds: string[];
  routeOrder: number[];
}

export interface ConfirmRequest {
  idempotencyKey: string;
  routes: ConfirmRoute[];
}

export interface ConfirmResponse {
  success: boolean;
  data: {
    assignedRoutes: Array<{
      routeId: string;
      petugasId: string;
      kendaraanId: string;
      stopCount: number;
    }>;
    failedRoutes?: Array<{
      temporaryRouteId: string;
      error: string;
    }>;
  };
}

export interface RegenerateRequest {
  routes: AutoCollectiveRoute[];
  modifications?: {
    routeModifications?: Array<{
      temporaryRouteId: string;
      newPetugasId?: string;
      newKendaraanId?: string;
      removeStopIds?: string[];
    }>;
  };
}

export interface AvailableVehicle {
  id: string;
  jenis: string;
  kapasitas: number;
  current_load: number;
}

export interface AvailableOfficer {
  id: string;
  nama: string;
  activeTaskCount: number;
}

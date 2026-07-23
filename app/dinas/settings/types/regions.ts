export interface RegionOption {
  code: string;
  name: string;
}

export interface RegionResponse {
  data?: RegionOption[];
}

export type RegionLevel = "provinces" | "regencies" | "districts";

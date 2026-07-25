import type {
  RegionLevel,
  RegionOption,
  RegionResponse,
} from "../types/regions";

export async function getRegions(
  level: RegionLevel,
  parentCode?: string,
): Promise<RegionOption[]> {
  const params = new URLSearchParams({ level });
  if (parentCode) params.set("parent", parentCode);

  const response = await fetch(`/api/regions?${params}`);
  if (!response.ok) throw new Error("REGIONS_FETCH_FAILED");

  const payload = (await response.json()) as RegionResponse;
  return payload.data ?? [];
}

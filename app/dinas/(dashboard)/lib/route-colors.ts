export const ROUTE_COLORS = [
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#2563eb",
  "#d97706",
  "#db2777",
  "#0891b2",
  "#65a30d",
] as const;

export function routeColorAt(index: number): string {
  return ROUTE_COLORS[index % ROUTE_COLORS.length];
}

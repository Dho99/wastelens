import { NextRequest, NextResponse } from "next/server";

const REGION_API = "https://wilayah.id/api";
const CODE_PATTERN = /^\d{2}(?:\.\d{2})?$/;

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get("level");
  const parentCode = request.nextUrl.searchParams.get("parent");

  let sourceUrl: string;
  if (level === "provinces") {
    sourceUrl = `${REGION_API}/provinces.json`;
  } else if (
    (level === "regencies" || level === "districts") &&
    parentCode &&
    CODE_PATTERN.test(parentCode)
  ) {
    sourceUrl = `${REGION_API}/${level}/${parentCode}.json`;
  } else {
    return NextResponse.json(
      { error: "Parameter wilayah tidak valid" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(sourceUrl, {
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Region API returned ${response.status}`);

    const payload = await response.json();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Data wilayah Indonesia tidak dapat dimuat" },
      { status: 502 },
    );
  }
}

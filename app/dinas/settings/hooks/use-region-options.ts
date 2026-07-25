"use client";

import { useEffect, useState } from "react";
import { getRegions } from "../services/regions";
import type { RegionOption } from "../types/regions";

export function useRegionOptions(
  provinceCode: string,
  regionCode: string,
) {
  const [provinces, setProvinces] = useState<RegionOption[]>([]);
  const [regencies, setRegencies] = useState<RegionOption[]>([]);
  const [districts, setDistricts] = useState<RegionOption[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getRegions("provinces")
      .then(setProvinces)
      .catch(() =>
        setError("Daftar wilayah gagal dimuat. Silakan muat ulang halaman."),
      );
  }, []);

  useEffect(() => {
    if (!provinceCode) return;
    getRegions("regencies", provinceCode)
      .then(setRegencies)
      .catch(() => setError("Daftar kota dan kabupaten gagal dimuat."));
  }, [provinceCode]);

  useEffect(() => {
    if (!regionCode) return;
    getRegions("districts", regionCode)
      .then(setDistricts)
      .catch(() => setError("Daftar kecamatan gagal dimuat."));
  }, [regionCode]);

  return { provinces, regencies, districtOptions: districts, error };
}

"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Save,
} from "lucide-react";
import { DlhShell } from "../../components/dlh-shell";
import { useSettings, useUpdateSettings } from "../../hooks/useSettings";
import { useRegionOptions } from "../hooks/use-region-options";
import { DistrictSelector } from "./district-selector";
import { FormField } from "./form-field";
import { RegionSelects } from "./region-selects";
import {
  SettingsError,
  SettingsHeader,
  SettingsLoading,
} from "./settings-page-state";

export function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editedDistricts, setEditedDistricts] = useState<string[] | null>(null);
  const [editedProvinceCode, setEditedProvinceCode] = useState<string | null>(null);
  const [editedRegionCode, setEditedRegionCode] = useState<string | null>(null);
  const [districtDraft, setDistrictDraft] = useState("");

  const districts = editedDistricts ?? settings?.districts ?? [];
  const provinceCode = editedProvinceCode ?? settings?.provinceCode ?? "";
  const regionCode = editedRegionCode ?? settings?.regionCode ?? "";
  const { provinces, regencies, districtOptions, error: regionsError } =
    useRegionOptions(provinceCode, regionCode);

  const normalizedDraft = districtDraft.trim().toLocaleLowerCase("id-ID");
  const suggestions = normalizedDraft
    ? districtOptions.filter(
        (district) =>
          district.name.toLocaleLowerCase("id-ID").includes(normalizedDraft) &&
          !districts.some(
            (selected) =>
              selected.replace(/^Kecamatan\s+/i, "").toLocaleLowerCase("id-ID") ===
              district.name.toLocaleLowerCase("id-ID"),
          ),
      )
    : [];

  const addDistrict = (suggestedDistrict?: string) => {
    const district = (suggestedDistrict ?? districtDraft).trim();
    if (!district) return;

    setEditedDistricts((current) => {
      const source = current ?? settings?.districts ?? [];
      return source.some(
        (item) => item.toLocaleLowerCase("id-ID") === district.toLocaleLowerCase("id-ID"),
      )
        ? source
        : [...source, district];
    });
    setDistrictDraft("");
  };

  const resetDistricts = () => {
    setEditedDistricts([]);
    setDistrictDraft("");
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pendingDistrict = districtDraft.trim();
    const savedDistricts =
      pendingDistrict &&
      !districts.some(
        (district) =>
          district.toLocaleLowerCase("id-ID") === pendingDistrict.toLocaleLowerCase("id-ID"),
      )
        ? [...districts, pendingDistrict]
        : districts;
    setError("");

    try {
      await updateSettings.mutateAsync({
        agency: String(data.get("agency")),
        province: provinces.find((item) => item.code === provinceCode)?.name ?? "",
        provinceCode,
        region: regencies.find((item) => item.code === regionCode)?.name ?? "",
        regionCode,
        districts: savedDistricts,
        email: String(data.get("email")),
        phone: String(data.get("phone")),
        autoDispatch: settings?.autoDispatch ?? false,
        emailAlert: settings?.emailAlert ?? false,
        soundAlert: settings?.soundAlert ?? false,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Pengaturan gagal disimpan. Silakan coba kembali.");
    }
  };

  if (isLoading) return <SettingsLoading />;
  if (isError || !settings) {
    return <SettingsError onRetry={() => refetch()} />;
  }

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4fbff]">
        <form
          onSubmit={save}
          className="mx-auto w-full max-w-[1180px] p-4 sm:p-6 lg:p-8"
        >
          <SettingsHeader />

          {saved && (
            <div
              role="status"
              className="mb-5 flex items-center gap-3 rounded-2xl border border-[#bfe2cc] bg-[#e7f7ed] px-4 py-3 text-sm font-semibold text-[#176a35]"
            >
              <CheckCircle2 className="size-5 shrink-0" />
              Pengaturan berhasil disimpan.
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              <AlertTriangle className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <section className="overflow-hidden rounded-[26px] border border-[#d5e1da] bg-white shadow-[0_8px_30px_rgba(33,72,49,0.06)]">
            <div className="border-b border-[#e2ebe5] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e6f5ec] text-[#087529]">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <h2 className="font-extrabold text-[#17231d]">Profil Instansi</h2>
                  <p className="mt-0.5 text-xs text-[#758078]">
                    Informasi resmi yang digunakan pada portal DLH.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
              <FormField
                icon={<Building2 />}
                label="Nama Instansi"
                name="agency"
                defaultValue={settings.agency ?? ""}
                placeholder="Contoh: DLH Kota Tasikmalaya"
              />
              <RegionSelects
                provinceCode={provinceCode}
                regionCode={regionCode}
                provinces={provinces}
                regencies={regencies}
                onProvinceChange={(value) => {
                  setEditedProvinceCode(value);
                  setEditedRegionCode("");
                  resetDistricts();
                }}
                onRegionChange={(value) => {
                  setEditedRegionCode(value);
                  resetDistricts();
                }}
              />
              <FormField
                icon={<Mail />}
                label="Email Operasional"
                name="email"
                type="email"
                defaultValue={settings.email ?? ""}
                placeholder="operasional@dlh.go.id"
              />
              <FormField
                icon={<Phone />}
                label="Nomor Hotline"
                name="phone"
                type="tel"
                defaultValue={settings.phone ?? ""}
                placeholder="+62 812 3456 7890"
              />
              <DistrictSelector
                districts={districts}
                suggestions={suggestions}
                draft={districtDraft}
                disabled={!regionCode}
                error={regionsError}
                onDraftChange={setDistrictDraft}
                onAdd={addDistrict}
                onRemove={(district) =>
                  setEditedDistricts((current) =>
                    (current ?? settings.districts ?? []).filter(
                      (item) => item !== district,
                    ),
                  )
                }
              />
            </div>
          </section>

          <div className="sticky bottom-0 z-10 mt-6 flex flex-col gap-3 rounded-2xl border border-[#d5e1da] bg-white/95 p-3 shadow-[0_-8px_30px_rgba(33,72,49,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="px-1 text-xs leading-5 text-[#758078]">
              Perubahan akan langsung diterapkan pada portal dinas.
            </p>
            <button
              disabled={updateSettings.isPending}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087529] px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#066221] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateSettings.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {updateSettings.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </main>
    </DlhShell>
  );
}

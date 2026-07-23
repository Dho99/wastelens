"use client";

import { FormEvent, KeyboardEvent, ReactNode, useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Plus,
  Save,
  Settings2,
  X,
} from "lucide-react";
import { DlhShell } from "../../components/dlh-shell";
import { useSettings, useUpdateSettings } from "../../hooks/useSettings";

interface RegionOption {
  code: string;
  name: string;
}

interface RegionResponse {
  data?: RegionOption[];
}

export function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editedDistricts, setEditedDistricts] = useState<string[] | null>(null);
  const [editedProvinceCode, setEditedProvinceCode] = useState<string | null>(null);
  const [editedRegionCode, setEditedRegionCode] = useState<string | null>(null);
  const [districtDraft, setDistrictDraft] = useState("");
  const [provinces, setProvinces] = useState<RegionOption[]>([]);
  const [regencies, setRegencies] = useState<RegionOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<RegionOption[]>([]);
  const [regionsError, setRegionsError] = useState("");
  const districts = editedDistricts ?? settings?.districts ?? [];
  const selectedProvinceCode = editedProvinceCode ?? settings?.provinceCode ?? "";
  const selectedRegionCode = editedRegionCode ?? settings?.regionCode ?? "";
  const normalizedDraft = districtDraft.trim().toLocaleLowerCase("id-ID");
  const districtSuggestions = normalizedDraft
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

  useEffect(() => {
    fetch("/api/regions?level=provinces")
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<RegionResponse>;
      })
      .then((payload) => setProvinces(payload.data ?? []))
      .catch(() => setRegionsError("Daftar wilayah gagal dimuat. Silakan muat ulang halaman."));
  }, []);

  useEffect(() => {
    if (!selectedProvinceCode) return;
    fetch(`/api/regions?level=regencies&parent=${encodeURIComponent(selectedProvinceCode)}`)
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<RegionResponse>;
      })
      .then((payload) => setRegencies(payload.data ?? []))
      .catch(() => setRegionsError("Daftar kota dan kabupaten gagal dimuat."));
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (!selectedRegionCode) return;
    fetch(`/api/regions?level=districts&parent=${encodeURIComponent(selectedRegionCode)}`)
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<RegionResponse>;
      })
      .then((payload) => setDistrictOptions(payload.data ?? []))
      .catch(() => setRegionsError("Daftar kecamatan gagal dimuat."));
  }, [selectedRegionCode]);

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

  const handleDistrictKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addDistrict();
    }
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
        province: provinces.find((province) => province.code === selectedProvinceCode)?.name ?? "",
        provinceCode: selectedProvinceCode,
        region: regencies.find((region) => region.code === selectedRegionCode)?.name ?? "",
        regionCode: selectedRegionCode,
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

  if (isLoading) {
    return (
      <DlhShell>
        <div className="flex flex-1 items-center justify-center bg-[#f4fbff] text-[#087529]">
          <div className="text-center">
            <Loader2 className="mx-auto size-8 animate-spin" />
            <p className="mt-3 text-sm font-semibold">Memuat pengaturan...</p>
          </div>
        </div>
      </DlhShell>
    );
  }

  if (isError || !settings) {
    return (
      <DlhShell>
        <div className="flex flex-1 items-center justify-center bg-[#f4fbff] p-6">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertTriangle className="mx-auto size-10 text-red-500" />
            <h2 className="mt-4 text-lg font-extrabold text-slate-900">
              Pengaturan gagal dimuat
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Terjadi kendala saat mengambil konfigurasi portal.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-full bg-[#087529] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#066221]"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </DlhShell>
    );
  }

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4fbff]">
        <form onSubmit={save} className="mx-auto w-full max-w-[1180px] p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#39815a]">
                <Settings2 className="size-4" />
                Konfigurasi Portal
              </div>
              <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#17231d]">
                Pengaturan
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#68756e]">
                Kelola identitas instansi dan preferensi operasional dari satu tempat.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-[#cfe0d6] bg-white px-3 py-2 text-xs font-bold text-[#287346] shadow-sm sm:self-auto">
              <span className="size-2 rounded-full bg-[#22a653]" />
              Sistem aktif
            </div>
          </header>

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

          <div>
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
                <Field
                  icon={<Building2 />}
                  label="Nama Instansi"
                  name="agency"
                  defaultValue={settings.agency ?? ""}
                  placeholder="Contoh: DLH Kota Tasikmalaya"
                />
                <label className="block">
                  <span className="text-sm font-bold text-[#27342d]">Provinsi</span>
                  <span className="relative mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
                    <MapPin className="size-[18px] shrink-0" />
                    <select
                      value={selectedProvinceCode}
                      onChange={(event) => {
                        setEditedProvinceCode(event.target.value);
                        setEditedRegionCode("");
                        setEditedDistricts([]);
                        setDistrictDraft("");
                      }}
                      required
                      className="min-w-0 flex-1 appearance-none bg-transparent pr-7 text-sm font-medium text-[#17231d] outline-none"
                    >
                      <option value="" disabled>
                        Pilih provinsi
                      </option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 size-4" />
                  </span>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-[#27342d]">Kota / Kabupaten</span>
                  <span className="relative mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
                    <MapPin className="size-[18px] shrink-0" />
                    <select
                      name="region"
                      value={selectedRegionCode}
                      onChange={(event) => {
                        setEditedRegionCode(event.target.value);
                        setEditedDistricts([]);
                        setDistrictDraft("");
                      }}
                      disabled={!selectedProvinceCode}
                      required
                      className="min-w-0 flex-1 appearance-none bg-transparent pr-7 text-sm font-medium text-[#17231d] outline-none"
                    >
                      <option value="" disabled>
                        Pilih kota atau kabupaten
                      </option>
                      {regencies.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 size-4" />
                  </span>
                </label>
                <Field
                  icon={<Mail />}
                  label="Email Operasional"
                  name="email"
                  type="email"
                  defaultValue={settings.email ?? ""}
                  placeholder="operasional@dlh.go.id"
                />
                <Field
                  icon={<Phone />}
                  label="Nomor Hotline"
                  name="phone"
                  type="tel"
                  defaultValue={settings.phone ?? ""}
                  placeholder="+62 812 3456 7890"
                />
                <div className="sm:col-span-2">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <label htmlFor="district" className="text-sm font-bold text-[#27342d]">
                        Daftar Kecamatan
                      </label>
                      <p className="mt-1 text-xs text-[#78847d]">
                        Tambahkan seluruh kecamatan yang masuk dalam cakupan DLH.
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[#56806a]">
                      {districts.length} kecamatan
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
                      <MapPinned className="size-[18px] shrink-0" />
                      <input
                        id="district"
                        value={districtDraft}
                        onChange={(event) => setDistrictDraft(event.target.value)}
                        onKeyDown={handleDistrictKeyDown}
                        disabled={!selectedRegionCode}
                        placeholder={
                          selectedRegionCode
                            ? "Ketik nama kecamatan"
                            : "Pilih kota atau kabupaten terlebih dahulu"
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#17231d] outline-none placeholder:text-[#a3ada7]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => addDistrict()}
                      disabled={!districtDraft.trim()}
                      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#16833a] px-5 text-sm font-bold text-[#087529] transition hover:bg-[#edf8f1] disabled:cursor-not-allowed disabled:border-[#ccd8d0] disabled:text-[#9ba69f]"
                    >
                      <Plus className="size-4" />
                      Tambah
                    </button>
                  </div>

                  {districtSuggestions.length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-[#d5e1da] bg-white p-1.5 shadow-[0_10px_24px_rgba(33,72,49,0.12)]">
                      <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829088]">
                        Rekomendasi Kecamatan
                      </p>
                      {districtSuggestions.map((district) => (
                        <button
                          key={district.code}
                          type="button"
                          onClick={() => addDistrict(district.name)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#314239] transition hover:bg-[#edf8f1] hover:text-[#087529]"
                        >
                          <MapPin className="size-4 text-[#54836a]" />
                          {district.name}
                          <Plus className="ml-auto size-4" />
                        </button>
                      ))}
                    </div>
                  )}

                  {regionsError && (
                    <p className="mt-2 text-xs font-semibold text-red-600">{regionsError}</p>
                  )}

                  {districts.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-[#e0e8e3] bg-[#f7faf8] p-3">
                      {districts.map((district) => (
                        <span
                          key={district}
                          className="inline-flex items-center gap-2 rounded-full border border-[#cce1d4] bg-white py-2 pl-3.5 pr-2 text-xs font-bold text-[#315c43] shadow-sm"
                        >
                          {district}
                          <button
                            type="button"
                            onClick={() =>
                              setEditedDistricts((current) =>
                                (current ?? settings.districts ?? []).filter(
                                  (item) => item !== district,
                                ),
                              )
                            }
                            aria-label={`Hapus ${district}`}
                            className="grid size-5 place-items-center rounded-full text-[#759080] transition hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="size-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-[#cbd9d0] bg-[#fafcfb] px-4 py-5 text-center text-xs text-[#7c8981]">
                      Belum ada kecamatan yang ditambahkan.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 z-10 mt-6 flex flex-col gap-3 rounded-2xl border border-[#d5e1da] bg-white/95 p-3 shadow-[0_-8px_30px_rgba(33,72,49,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="px-1 text-xs leading-5 text-[#758078]">
              Perubahan akan langsung diterapkan pada portal dinas.
            </p>
            <button
              disabled={updateSettings.isPending}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087529] px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#066221] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087529] disabled:cursor-not-allowed disabled:opacity-60"
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

function Field({
  icon,
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  icon: ReactNode;
  label: string;
  name: string;
  defaultValue: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#27342d]">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#d9e2dc] bg-[#fbfdfb] px-3 text-[#7a8780] transition focus-within:border-[#17833a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#17833a]/10">
        <span className="[&>svg]:size-[18px]">{icon}</span>
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#17231d] outline-none placeholder:text-[#a3ada7]"
        />
      </span>
    </label>
  );
}

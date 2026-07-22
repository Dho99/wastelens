"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useAdmin, useUpdateAdmin } from "../hooks/useAdmin";

const fieldClass =
  "mt-2 h-12 w-full rounded-full border-2 border-[#bdcbbd] bg-white px-5 text-sm font-normal outline-none transition focus:border-[#087529]";

export function EditAdminProfile() {
  const router = useRouter();
  const { data: admin, isLoading } = useAdmin();
  const updateAdmin = useUpdateAdmin();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Gunakan foto berformat JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2 MB.");
      return;
    }
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const source = new window.Image();
      source.onload = () => {
        const size = Math.min(512, Math.max(source.width, source.height));
        const scale = Math.min(1, size / Math.max(source.width, source.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(source.width * scale);
        canvas.height = Math.round(source.height * scale);
        canvas
          .getContext("2d")
          ?.drawImage(source, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/webp", 0.78));
        setError("");
      };
      source.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const data = new FormData(event.currentTarget);
    try {
      let persistedPhoto = photo;
      if (photoFile) {
        const upload = new FormData();
        upload.append("photo", photoFile);
        if (admin?.image) upload.append("previousUrl", admin.image);
        const response = await fetch("/api/dinas/media", { method: "POST", body: upload });
        const result = await response.json() as { data?: { url?: string }; error?: string };
        if (!response.ok || !result.data?.url) throw new Error(result.error ?? "Foto gagal diunggah.");
        persistedPhoto = result.data.url;
      }

      await updateAdmin.mutateAsync({
        name: String(data.get("name")).trim(),
        phoneNumber: String(data.get("phone")).trim(),
      });
      router.push("/dinas/accounts");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Profil gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !admin) return null;

  return (
      <>
      <div className="flex min-w-0 flex-1 flex-col bg-[#f4fbff]">
        <header className="flex h-14 shrink-0 items-center border-b border-[#c7d6cc] px-5 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="rounded-full p-2 hover:bg-white"
          >
            <ArrowLeft className="size-5" />
          </button>
          <Link
            href="/dinas/notifications"
            aria-label="Notifikasi"
            className="ml-auto rounded-full p-2 hover:bg-white"
          >
            <Bell className="size-5" />
          </Link>
          <span className="relative ml-4 size-9 overflow-hidden rounded-full border-2 border-[#087529] bg-[#dceef5]">
            <Image
              src={photo || admin.image || "/images/dlh-field-officer.png"}
              alt={admin.name}
              fill
              className="object-cover object-top"
              sizes="36px"
              unoptimized={photo.startsWith("data:") || photo.startsWith("/api/dinas/media/")}
            />
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-[1160px]">
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#536159]">
              <span>Administrator</span>
              <span>›</span>
              <span className="font-bold text-[#087529]">Edit Profil</span>
            </nav>
            <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              Pengaturan Profil
            </h1>
            <p className="mt-1 text-sm text-[#667169]">
              Perbarui informasi pribadi dan detail pekerjaan Anda di bawah ini.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-center rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="ml-auto"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
              <aside className="rounded-[24px] border border-[#bdcbbd] bg-white p-6 text-center shadow-sm">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group relative mx-auto block size-36"
                  aria-label="Ganti foto profil"
                >
                  <span className="relative block size-full overflow-hidden rounded-full border-4 border-[#bcebd1] bg-[#dceef5]">
                    <Image
                      src={photo || admin.image || "/images/dlh-field-officer.png"}
                      alt={admin.name}
                      fill
                      priority
                      className="object-cover object-top"
                      sizes="144px"
                      unoptimized={photo.startsWith("data:") || photo.startsWith("/api/dinas/media/")}
                    />
                  </span>
                  <span className="absolute bottom-1 right-0 grid size-10 place-items-center rounded-full border-2 border-white bg-[#087529] text-white shadow-md group-hover:bg-[#066421]">
                    <Pencil className="size-4" />
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectPhoto}
                  className="sr-only"
                />
                <h2 className="mt-5 text-lg font-extrabold">{admin.name}</h2>
                <p className="mt-1 text-xs text-[#536159]">
                  Admin Utama • DLH Kota
                </p>
                <div className="mt-6 border-t border-[#c8d5ca] pt-5 text-left">
                  <p className="text-center text-xs font-semibold text-[#536159]">
                    Ketentuan Foto
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-xs text-[#667169]">
                    <CheckCircle2 className="size-4 text-[#087529]" />
                    Format JPG, PNG atau WEBP
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-[#667169]">
                    <CheckCircle2 className="size-4 text-[#087529]" />
                    Maksimal ukuran file 2 MB
                  </p>
                </div>
              </aside>

              <div className="space-y-5">
                <form
                  onSubmit={save}
                  className="rounded-[24px] border border-[#bdcbbd] bg-white p-6 shadow-sm sm:p-8"
                >
                  <SectionTitle>Informasi Dasar</SectionTitle>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-[#465148]">
                      Nama Lengkap
                      <input
                        name="name"
                        required
                        defaultValue={admin.name}
                        className={fieldClass}
                      />
                    </label>
                    <label className="text-sm font-bold text-[#465148]">
                      Alamat Email Kerja
                      <span className="relative block">
                        <Mail className="pointer-events-none absolute left-5 top-[22px] z-10 size-5 text-[#536159]" />
                        <input
                          name="email"
                          type="email"
                          required
                          defaultValue={admin.email}
                          className={`${fieldClass} pl-14`}
                        />
                      </span>
                    </label>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Detail Penugasan</SectionTitle>
                  </div>
                  <label className="mt-7 block text-sm font-bold text-[#465148]">
                    Departemen / Divisi
                    <span className="relative block">
                      <select
                        name="department"
                        defaultValue={"Operasional Pengolahan Limbah"}
                        className={`${fieldClass} appearance-none pr-12`}
                      >
                        <option>Operasional Pengolahan Limbah</option>
                        <option>Pengawasan Lingkungan</option>
                        <option>Pengelolaan Armada</option>
                        <option>Administrasi DLH</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-5 top-[22px] size-4 text-[#667169]" />
                    </span>
                  </label>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-bold text-[#465148]">
                      Jabatan
                      <input
                        value={"Kepala Bidang Operasional"}
                        readOnly
                        className={`${fieldClass} bg-[#e2eff6] text-[#536159]`}
                      />
                      <span className="mt-2 block text-[10px] font-normal text-[#667169]">
                        Hubungi IT untuk mengubah jabatan
                      </span>
                    </label>
                    <label className="text-sm font-bold text-[#465148]">
                      Nomor Telepon
                      <input
                        name="phone"
                        type="tel"
                        required
                        defaultValue={admin.phoneNumber ?? "+62 812-3456-7890"}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                  <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#c8d5ca] pt-6 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => router.push("/dinas/accounts")}
                      className="flex h-11 items-center justify-center gap-2 rounded-full border-2 border-red-600 px-8 text-sm font-bold text-red-600"
                    >
                      <X className="size-4" />
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#087529] px-8 text-sm font-bold text-white shadow-md hover:bg-[#066421] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                      {saving ? "Mengunggah..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>

                <section className="flex flex-col gap-4 rounded-[24px] border border-red-200 bg-white p-6 sm:flex-row sm:items-center">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
                    <LockKeyhole className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-extrabold">Keamanan Akun</h2>
                    <p className="mt-1 text-sm text-[#667169]">
                      Ganti kata sandi secara berkala untuk menjaga keamanan
                      akses sistem WasteLens.
                    </p>
                    <Link
                      href="/dinas/accounts/password"
                      className="mt-3 inline-block text-sm font-bold text-red-600"
                    >
                      Ubah Kata Sandi Sekarang →
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
      </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
      <>
    <h2 className="relative inline-block pb-3 text-lg font-extrabold after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:rounded-full after:bg-[#087529]">
      {children}
    </h2>
      </>
  );
}

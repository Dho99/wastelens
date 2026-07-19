"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Icon from "@mdi/react";
import {
  mdiCameraOutline,
  mdiClockOutline,
  mdiCheckCircle,
  mdiRecycle,
  mdiInformationOutline,
  mdiSendOutline,
  mdiRefresh
} from "@mdi/js";

const data = {
  id: "#WL-99281",
  address: "Jl. Kebon Jeruk No. 42, RT 05/RW 03",
  time: "14:22 WIB",
  foto_sebelum: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
  foto_sesudah_dummy: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=300&fit=crop"
};

export default function VerifyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fotoSesudah, setFotoSesudah] = useState<string | null>(data.foto_sesudah_dummy);
  const [fotoSesudahBase64, setFotoSesudahBase64] = useState<string>("dummy_base64_data");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("foto_sesudah");
    if (stored) {
      setFotoSesudah(stored);
      setFotoSesudahBase64(stored.split(",")[1] ?? "");
      sessionStorage.removeItem("foto_sesudah");
    }
  }, []);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setFotoSesudah(dataUrl);
      const base64 = dataUrl.split(",")[1] ?? "";
      setFotoSesudahBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!fotoSesudahBase64) return;
    setSubmitting(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="font-sans py-8 text-center">
        <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary/20 mx-auto">
          <Icon path={mdiCheckCircle} className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-primary">Verifikasi Berhasil!</h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
          Laporan telah diverifikasi dan koin pelapor akan segera ditambahkan.
        </p>
        <button
          onClick={() => router.push("/petugas/tasks")}
          className="mt-8 w-full rounded-2xl bg-primary px-4 py-3.5 text-[15px] font-semibold text-white hover:bg-primary/90 transition-colors shadow-md"
        >
          Kembali ke Daftar Tugas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8 font-sans">
      <div className="py-4 space-y-6">

        {/* Header Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/20 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full">
              Verifikasi Selesai
            </span>
            <span className="text-xs text-neutral-500 font-medium tracking-wide">ID: {data.id}</span>
          </div>
          <h2 className="text-[19px] font-bold text-neutral-800 leading-snug mb-2">
            {data.address}
          </h2>
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Icon path={mdiClockOutline} className="w-4 h-4" />
            <span className="text-sm font-medium">{data.time}</span>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Foto Sebelum */}
          <div className="relative rounded-[20px] overflow-hidden shadow-sm aspect-[4/5] flex flex-col bg-neutral-200">
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
              LAPORAN WARGA
            </div>
            <div className="flex-1 relative">
              <Image src={data.foto_sebelum} alt="Sebelum" fill className="object-cover" sizes="50vw" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-[2px] py-2.5 text-center">
              <span className="text-white text-[13px] font-semibold">Foto Sebelum</span>
            </div>
          </div>

          {/* Foto Sesudah */}
          <div className="relative rounded-[20px] overflow-hidden shadow-sm aspect-[4/5] flex flex-col border-[1.5px] border-primary bg-neutral-200">
            <div className="absolute top-2 left-2 z-10 bg-primary text-white text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
              PETUGAS
            </div>
            <div className="absolute top-2 right-2 z-10 bg-white text-primary rounded-full p-[2px] shadow-sm flex items-center justify-center">
              <Icon path={mdiCheckCircle} className="w-[14px] h-[14px]" />
            </div>
            <div className="flex-1 relative">
              {fotoSesudah ? (
                <Image src={fotoSesudah} alt="Sesudah" fill className="object-cover" sizes="50vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Icon path={mdiCameraOutline} className="w-8 h-8 text-neutral-400" />
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-primary py-2.5 text-center">
              <span className="text-white text-[13px] font-semibold">Foto Sesudah</span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white border border-neutral-200 rounded-[28px] p-5 shadow-sm relative overflow-hidden">
          {/* Top Row */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[11px] text-neutral-500 mb-0.5 font-medium">Jenis Limbah</p>
              <p className="text-[15px] font-bold text-neutral-800">Anorganik (Plastik)</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Icon path={mdiRecycle} className="w-[22px] h-[22px] text-primary" />
            </div>
          </div>

          <div className="h-[1px] w-full bg-neutral-200 mb-4" />

          {/* Middle Row */}
          <div className="flex justify-between mb-5 gap-4">
            <div>
              <p className="text-[11px] text-neutral-500 mb-0.5 font-medium">Estimasi Berat</p>
              <p className="text-[15px] font-bold text-neutral-800">12.5 Kg</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-500 mb-0.5 font-medium">Metode Verifikasi</p>
              <p className="text-[15px] font-bold text-neutral-800">Foto AI-Validated</p>
            </div>
          </div>

          {/* Bottom Row */}
          <div>
            <p className="text-[11px] text-neutral-500 mb-2 font-medium">Catatan Lapangan</p>
            <div className="border border-dashed border-neutral-300 bg-neutral-50 p-3.5 rounded-xl">
              <p className="text-[13px] text-neutral-700 italic leading-relaxed">
                &ldquo;Area telah dibersihkan sepenuhnya. Tutup kontainer diperbaiki sedikit karena longgar.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="bg-accent/10 border border-accent/20 rounded-3xl p-4 flex gap-3">
          <div className="mt-0.5 shrink-0">
            <Icon path={mdiInformationOutline} className="w-5 h-5 text-accent" />
          </div>
          <p className="text-[11px] text-neutral-700 leading-relaxed font-medium pr-1">
            Pastikan foto sesudah terlihat jelas dan tidak buram sebelum menekan tombol kirim. Data ini akan sinkronisasi otomatis ke dashboard pusat.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-4">
          <button
            onClick={handleSubmit}
            disabled={!fotoSesudahBase64 || submitting}
            className="w-full bg-primary text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 text-[15px] shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Memproses..." : "Verifikasi Selesai"}
            {!submitting && <Icon path={mdiSendOutline} className="w-5 h-5" />}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 text-[14px] font-bold text-primary py-2 hover:bg-primary/5 rounded-full transition-colors"
          >
            Ambil Ulang Foto <Icon path={mdiRefresh} className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCapture}
        />

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

      </div>
    </div>
  );
}

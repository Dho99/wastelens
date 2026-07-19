"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Building2,
  Camera,
  Check,
  ChevronDown,
  Info,
  UploadCloud,
  UserPlus,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

const inputClass = "mt-1.5 h-11 w-full rounded-full border-2 border-[#768176] bg-white px-4 text-sm font-normal outline-none placeholder:text-[#89939c] focus:border-[#087529]";

export function AddOfficerForm() {
  const router = useRouter();
  const store = useDlhStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);

  const processFile = (file?: File) => {
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setFileError("Gunakan file JPG atau PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran file maksimal 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const scale = Math.min(1, 512 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.75));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    setFileName(file.name);
    setFileError("");
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => processFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    processFile(event.dataTransfer.files[0]);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photo) {
      setFileError("Foto identitas wajib diunggah.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const id = String(data.get("id")).toUpperCase();
    if (store.officers.some((officer) => officer.id === id)) {
      setFileError(`ID ${id} sudah digunakan.`);
      return;
    }
    const name = String(data.get("name"));
    updateDlhStore((draft) => {
      draft.officers.push({
        id,
        name,
        initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        zone: String(data.get("zone")),
        phone: String(data.get("phone")),
        email: `${name.toLowerCase().replaceAll(" ", ".")}@dlh-jakarta.go.id`,
        color: "bg-[#bcebd1]",
        role: String(data.get("role")),
        shift: "Pagi",
        mobileAccess: true,
        tracking: true,
        photo,
        tasks: 0,
        location: draft.settings.region,
        recentTasks: [],
      });
    });
    setSaved(true);
  };

  return (
    <DlhShell hideHeader>
      <div className="flex min-w-0 flex-1 flex-col bg-[#f4fbff]">
        <header className="flex h-14 shrink-0 items-center border-b border-[#c7d6cc] px-5 sm:px-6">
          <button type="button" onClick={() => router.push("/dinas/logistics")} className="grid size-9 place-items-center rounded-full hover:bg-white" aria-label="Kembali"><ArrowLeft className="size-5" /></button>
          <Link href="/dinas/notifications" className="ml-auto rounded-full p-2 hover:bg-white" aria-label="Notifikasi"><Bell className="size-5" /></Link>
          <span className="ml-4 grid size-9 place-items-center rounded-full border border-[#b8c9bd] bg-[#dff1e8] text-xs font-extrabold text-[#087529]">AD</span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <form onSubmit={submit} className="mx-auto max-w-[1160px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div><div className="flex items-center gap-2 text-xs font-semibold text-[#526158]"><span>Petugas</span><span>›</span><span className="font-bold text-[#087529]">Tambah Petugas Baru</span></div><h1 className="mt-2 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">Tambah Petugas Baru</h1><p className="mt-1 text-sm text-[#667169]">Daftarkan personil lapangan baru ke dalam sistem operasional WasteLens.</p></div>
              <span className="w-fit rounded-full bg-[#9cf29b] px-4 py-1.5 text-xs font-extrabold sm:ml-auto">Status: Penambahan Baru</span>
            </div>

            <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
              <div className="space-y-4">
                <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                  <h2 className="flex items-center gap-3 text-lg font-extrabold"><span className="grid size-10 place-items-center rounded-xl bg-[#2e8737] text-white"><UserPlus className="size-5" /></span>Informasi Personal</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold sm:col-span-2">Nama Lengkap<input name="name" required placeholder="Contoh: Budi Hermawan" className={inputClass} /></label><label className="text-sm font-semibold">ID Personil<input name="id" required pattern="FLD-[0-9]{4}" title="Gunakan format FLD-XXXX" placeholder="FLD-XXXX" className={inputClass} /></label><label className="text-sm font-semibold">Nomor Telepon<input name="phone" type="tel" required placeholder="+62 812..." className={inputClass} /></label></div>
                </section>

                <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                  <h2 className="flex items-center gap-3 text-lg font-extrabold"><span className="grid size-10 place-items-center rounded-xl bg-[#b87800] text-white"><Building2 className="size-5" /></span>Penugasan Operasional</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectField label="Zona Penugasan" name="zone" defaultValue=""><option value="" disabled>Pilih Zona</option><option>Zone A - Menteng</option><option>Zone B - Gambir</option><option>Zone C - Tebet</option><option>Zone D - Senen</option></SelectField><SelectField label="Peran Akun" name="role" defaultValue="Field Operator"><option>Field Operator</option><option>Supervisor Lapangan</option><option>Koordinator Wilayah</option></SelectField></div>
                </section>
              </div>

              <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                <h2 className="flex items-center gap-3 text-lg font-extrabold"><span className="grid size-10 place-items-center rounded-xl bg-[#bcebd1] text-[#47705b]"><UploadCloud className="size-5" /></span>Verifikasi Identitas</h2>
                <p className="mt-5 text-xs text-[#526158]">Unggah foto KTP atau profil resmi petugas (JPG/PNG, Maks. 5MB).</p>
                <input ref={fileInput} type="file" accept="image/jpeg,image/png" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileInput.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} className={`mt-4 flex h-[230px] w-full flex-col items-center justify-center overflow-hidden rounded-[22px] border-2 border-dashed transition ${dragging ? "border-[#087529] bg-[#eef9f2]" : "border-[#bdcbbd] bg-white"}`}>
                  {photo ? <span className="relative block size-full"><span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} /><span className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-xs font-semibold text-white">{fileName}</span></span> : <><span className="grid size-16 place-items-center rounded-full bg-[#e2eff6] text-[#087529]"><Camera className="size-7" /></span><span className="mt-4 text-base font-extrabold">Tarik foto ke sini</span><span className="mt-1 text-xs text-[#667169]">atau klik untuk memilih file dari komputer</span></>}
                </button>
                {fileError && <p role="alert" className="mt-2 text-xs font-semibold text-red-600">{fileError}</p>}
                <div className="mt-4 flex gap-3 rounded-[20px] border border-[#bdcbbd] bg-[#f1f8fc] p-4"><Info className="size-5 shrink-0 text-[#956100]" /><p className="text-xs leading-5 text-[#667169]">Pastikan wajah terlihat jelas dan ID Card tidak terpotong. Verifikasi manual akan dilakukan oleh departemen HRD setelah data dikirim.</p></div>
                <button type="submit" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#087529] text-sm font-extrabold text-white hover:bg-[#066421]"><UserPlus className="size-4" />Simpan Data Petugas</button>
                <button type="button" onClick={() => router.push("/dinas/logistics")} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-red-600 text-sm font-extrabold text-red-600 hover:bg-red-50"><X className="size-4" />Batalkan Pengisian</button>
              </section>
            </div>
          </form>
        </main>
      </div>

      {saved && <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" className="w-full max-w-[380px] rounded-[24px] bg-white p-7 text-center shadow-2xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#d8f3e4] text-[#087529]"><Check className="size-8" strokeWidth={3} /></span><h2 className="mt-5 text-lg font-extrabold">Petugas berhasil ditambahkan</h2><p className="mt-2 text-sm text-[#667169]">Data petugas baru telah tersimpan dan menunggu verifikasi HRD.</p><button type="button" onClick={() => router.push("/dinas/logistics")} className="mt-6 h-11 w-full rounded-xl bg-[#087529] text-sm font-bold text-white">Kembali ke Kelola Logistik</button></section></div>}
    </DlhShell>
  );
}

function SelectField({ label, name, defaultValue, children }: { label: string; name: string; defaultValue: string; children: React.ReactNode }) {
  return <label className="text-sm font-semibold">{label}<span className="relative block"><select name={name} required defaultValue={defaultValue} className={`${inputClass} appearance-none pr-11`} >{children}</select><ChevronDown className="pointer-events-none absolute right-4 top-[18px] size-4 text-[#667169]" /></span></label>;
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  Eye,
  Pencil,
  Phone,
  PlusCircle,
  Trash2,
  Truck,
  UserCog,
  UserPlus,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import {
  type DlhOfficer as Officer,
  type DlhVehicle as Vehicle,
  updateDlhStore,
  useDlhStore,
} from "@/lib/dlh-store";

type Editor =
  | { kind: "vehicle"; item?: Vehicle; draftId?: string }
  | { kind: "officer"; item?: Officer; draftId?: string };
type DeleteTarget = { kind: "vehicle" | "officer"; id: string; label: string };

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-[#c3d1c7] bg-[#f7fbfd] px-4 font-normal outline-none focus:border-[#087529]";

export function LogisticsManagement() {
  const router = useRouter();
  const store = useDlhStore();
  const vehicles = store.vehicles;
  const officers = store.officers;
  const [vehiclePage, setVehiclePage] = useState(0);
  const [officerPage, setOfficerPage] = useState(0);
  const [vehiclePageSize, setVehiclePageSize] = useState(5);
  const [officerPageSize, setOfficerPageSize] = useState(5);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [notice, setNotice] = useState("");
  const visibleVehicles = vehicles.slice(
    vehiclePage * vehiclePageSize,
    vehiclePage * vehiclePageSize + vehiclePageSize,
  );
  const visibleOfficers = officers.slice(
    officerPage * officerPageSize,
    officerPage * officerPageSize + officerPageSize,
  );
  const setVehicles = (update: (current: Vehicle[]) => Vehicle[]) =>
    updateDlhStore((draft) => {
      draft.vehicles = update(draft.vehicles);
    });
  const setOfficers = (update: (current: Officer[]) => Officer[]) =>
    updateDlhStore((draft) => {
      draft.officers = update(draft.officers);
    });

  const saveItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    const data = new FormData(event.currentTarget);

    if (editor.kind === "vehicle") {
      const item: Vehicle = {
        id: String(data.get("id")),
        plate: String(data.get("plate")),
        capacity: `${Number(data.get("capacity")).toFixed(1)} Ton`,
        status: String(data.get("status")) as Vehicle["status"],
        type: editor.item?.type ?? "Compactor Truck",
        year: editor.item?.year ?? new Date().getFullYear(),
        area: editor.item?.area ?? "Jakarta Pusat",
        load: editor.item?.load ?? 0,
        maintenance: editor.item?.maintenance ?? [],
      };
      setVehicles((current) =>
        editor.item
          ? current.map((vehicle) =>
              vehicle.id === editor.item?.id ? item : vehicle,
            )
          : [...current, item],
      );
      setNotice(
        editor.item
          ? "Data armada berhasil diperbarui."
          : "Armada baru berhasil ditambahkan.",
      );
    } else {
      const name = String(data.get("name"));
      const item: Officer = {
        id: String(data.get("id")),
        name,
        initials: name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        zone: String(data.get("zone")),
        phone: String(data.get("phone")),
        color: editor.item?.color ?? "bg-[#bcebd1]",
        email:
          editor.item?.email ??
          `${name.toLowerCase().replaceAll(" ", ".")}@dlh-jakarta.go.id`,
        role: editor.item?.role ?? "Field Operator",
        shift: editor.item?.shift ?? "Pagi",
        mobileAccess: editor.item?.mobileAccess ?? true,
        tracking: editor.item?.tracking ?? true,
        photo: editor.item?.photo,
        tasks: editor.item?.tasks ?? 0,
        location: editor.item?.location ?? "Jakarta Pusat",
        recentTasks: editor.item?.recentTasks ?? [],
      };
      setOfficers((current) =>
        editor.item
          ? current.map((officer) =>
              officer.id === editor.item?.id ? item : officer,
            )
          : [...current, item],
      );
      setNotice(
        editor.item
          ? "Data petugas berhasil diperbarui."
          : "Petugas baru berhasil ditambahkan.",
      );
    }
    setEditor(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "vehicle")
      setVehicles((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
    else
      setOfficers((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
    setNotice(`${deleteTarget.label} berhasil dihapus.`);
    setDeleteTarget(null);
  };

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-5">
        <div className="mx-auto max-w-[1400px]">
          {notice && (
            <div
              role="status"
              className="mb-4 flex items-center rounded-2xl bg-[#dff5e9] px-4 py-3 text-sm font-bold text-[#176a35]"
            >
              {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                className="ml-auto rounded-full p-1 hover:bg-white/60"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <SectionHeading
            title="Kelola Armada"
            subtitle="Monitoring and management of waste collection fleet"
            button="Tambah Armada"
            icon="vehicle"
            onClick={() => router.push("/dinas/logistics/vehicles/new")}
          />
          <section className="mt-4 overflow-hidden rounded-[20px] border border-[#b8cabc] bg-white/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#e2f2fa] text-[11px] font-extrabold uppercase tracking-wide text-[#4a5a51]">
                  <tr>
                    <th className="px-7 py-4">ID Kendaraan</th>
                    <th className="px-5 py-4">Plat Nomor</th>
                    <th className="px-5 py-4">Kapasitas</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-t border-[#bdcdbf] text-sm"
                    >
                      <td className="px-7 py-4 font-extrabold">{vehicle.id}</td>
                      <td className="px-5 py-4 font-medium">{vehicle.plate}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#bcebd1] px-3 py-1 text-[11px] font-bold text-[#547466]">
                          {vehicle.capacity}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-4 font-medium ${vehicle.status === "Beroperasi" ? "text-[#177735]" : "text-[#956100]"}`}
                      >
                        <span
                          className={`mr-2 inline-block size-2 rounded-full ${vehicle.status === "Beroperasi" ? "bg-[#087529]" : "bg-[#956100]"}`}
                        />
                        {vehicle.status}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <ActionButton
                            label={`Lihat ${vehicle.id}`}
                            onClick={() =>
                              router.push(
                                `/dinas/logistics/vehicles/${vehicle.id}`,
                              )
                            }
                          >
                            <Eye />
                          </ActionButton>
                          <ActionButton
                            label={`Edit ${vehicle.id}`}
                            onClick={() =>
                              setEditor({ kind: "vehicle", item: vehicle })
                            }
                          >
                            <Pencil />
                          </ActionButton>
                          <ActionButton
                            danger
                            label={`Hapus ${vehicle.id}`}
                            onClick={() =>
                              setDeleteTarget({
                                kind: "vehicle",
                                id: vehicle.id,
                                label: `Armada ${vehicle.id}`,
                              })
                            }
                          >
                            <Trash2 />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TableFooter
              shown={visibleVehicles.length}
              total={vehicles.length}
              noun="armada"
              page={vehiclePage}
              pageSize={vehiclePageSize}
              canNext={(vehiclePage + 1) * vehiclePageSize < vehicles.length}
              onPageSizeChange={(size) => {
                setVehiclePageSize(size);
                setVehiclePage(0);
              }}
              onPrevious={() => setVehiclePage((page) => Math.max(0, page - 1))}
              onNext={() => setVehiclePage((page) => page + 1)}
            />
          </section>

          <div className="mt-5">
            <SectionHeading
              title="Kelola Petugas"
              subtitle="Personnel assignment and contact directory"
              button="Tambah Petugas"
              icon="officer"
              onClick={() => router.push("/dinas/logistics/officers/new")}
            />
          </div>
          <section className="mt-4 overflow-hidden rounded-[20px] border border-[#b8cabc] bg-white/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left">
                <thead className="bg-[#e2f2fa] text-[11px] font-extrabold uppercase tracking-wide text-[#4a5a51]">
                  <tr>
                    <th className="px-7 py-4">Nama Petugas</th>
                    <th className="px-5 py-4">ID Petugas</th>
                    <th className="px-5 py-4">Wilayah Tugas</th>
                    <th className="px-5 py-4">No. HP</th>
                    <th className="px-5 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOfficers.map((officer) => (
                    <tr
                      key={officer.id}
                      className="border-t border-[#bdcdbf] text-sm"
                    >
                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid size-9 place-items-center rounded-full text-xs font-extrabold ${officer.color}`}
                          >
                            {officer.initials}
                          </span>
                          <span className="font-extrabold">{officer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium">{officer.id}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-[#b7c9ba] bg-[#e8f2f4] px-3 py-1 text-[11px] font-semibold text-[#51645a]">
                          {officer.zone}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium">{officer.phone}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <ActionButton
                            label={`Lihat ${officer.name}`}
                            onClick={() =>
                              router.push(
                                `/dinas/logistics/officers/${officer.id}`,
                              )
                            }
                          >
                            <Eye />
                          </ActionButton>
                          <a
                            href={`tel:${officer.phone.replace(/\s|-/g, "")}`}
                            aria-label={`Telepon ${officer.name}`}
                            className="grid size-9 place-items-center rounded-lg border border-[#b9cabc] transition hover:bg-white"
                          >
                            <Phone className="size-4" />
                          </a>
                          <ActionButton
                            label={`Edit ${officer.name}`}
                            onClick={() =>
                              router.push(
                                `/dinas/logistics/officers/${officer.id}/edit`,
                              )
                            }
                          >
                            <Pencil />
                          </ActionButton>
                          <ActionButton
                            danger
                            label={`Hapus ${officer.name}`}
                            onClick={() =>
                              setDeleteTarget({
                                kind: "officer",
                                id: officer.id,
                                label: `Petugas ${officer.name}`,
                              })
                            }
                          >
                            <Trash2 />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TableFooter
              shown={visibleOfficers.length}
              total={officers.length}
              noun="petugas"
              page={officerPage}
              pageSize={officerPageSize}
              canNext={(officerPage + 1) * officerPageSize < officers.length}
              onPageSizeChange={(size) => {
                setOfficerPageSize(size);
                setOfficerPage(0);
              }}
              onPrevious={() => setOfficerPage((page) => Math.max(0, page - 1))}
              onNext={() => setOfficerPage((page) => page + 1)}
            />
          </section>

          <div className="mx-auto mt-5 grid max-w-[1080px] gap-3 sm:grid-cols-3">
            <SummaryCard
              icon={<Truck />}
              color="bg-[#258237] text-[#075d20]"
              label="Total Armada"
              value={`${vehicles.length} Unit`}
            />
            <SummaryCard
              icon={<UserCog />}
              color="bg-[#bcebd1] text-[#47705b]"
              label="Petugas Aktif"
              value={`${officers.length} Orang`}
            />
            <SummaryCard
              icon={<History />}
              color="bg-[#ffd9ae] text-[#956100]"
              label="Update Terakhir"
              value="10:45 WIB"
            />
          </div>
        </div>
      </main>

      {editor && (
        <EditorModal
          editor={editor}
          onClose={() => setEditor(null)}
          onSubmit={saveItem}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </DlhShell>
  );
}

function SectionHeading({
  title,
  subtitle,
  button,
  icon,
  onClick,
}: {
  title: string;
  subtitle: string;
  button: string;
  icon: "vehicle" | "officer";
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-[#667169] sm:text-sm">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#087529] px-6 text-sm font-extrabold text-white transition hover:bg-[#066421] sm:ml-auto"
      >
        {icon === "vehicle" ? (
          <PlusCircle className="size-4" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {button}
      </button>
    </div>
  );
}

function ActionButton({
  children,
  label,
  danger = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-9 place-items-center rounded-lg border border-[#b9cabc] transition hover:bg-white [&_svg]:size-4 ${danger ? "text-red-600" : "text-[#465148]"}`}
    >
      {children}
    </button>
  );
}

function TableFooter({
  shown,
  total,
  noun,
  page,
  pageSize,
  canNext,
  onPageSizeChange,
  onPrevious,
  onNext,
}: {
  shown: number;
  total: number;
  noun: string;
  page: number;
  pageSize: number;
  canNext: boolean;
  onPageSizeChange: (size: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const start = shown ? page * pageSize + 1 : 0;
  const end = page * pageSize + shown;
  return (
    <footer className="flex flex-col gap-2 border-t border-[#bdcdbf] px-5 py-3 text-[11px] text-[#536159] sm:flex-row sm:items-center">
      <p>
        Menampilkan {start}–{end} dari {total} {noun}
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        <label className="flex items-center gap-2">
          Baris:
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-full border border-[#bdcdbf] bg-white px-2 py-1 font-bold outline-none"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
        <button
          type="button"
          disabled={page === 0}
          onClick={onPrevious}
          className="rounded-full border border-[#bdcdbf] px-4 py-1.5 font-bold disabled:opacity-35"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="rounded-full border border-[#aebfae] px-4 py-1.5 font-bold disabled:opacity-35"
        >
          Selanjutnya
        </button>
      </div>
    </footer>
  );
}

function SummaryCard({
  icon,
  color,
  label,
  value,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
      <span
        className={`grid size-10 place-items-center rounded-full [&_svg]:size-4 ${color}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-[11px] text-[#667169]">{label}</p>
        <p className="text-lg font-extrabold">{value}</p>
      </div>
    </div>
  );
}

function EditorModal({
  editor,
  onClose,
  onSubmit,
}: {
  editor: Editor;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isVehicle = editor.kind === "vehicle";
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center">
          <h3 className="text-xl font-extrabold">
            {editor.item ? "Edit" : "Tambah"} {isVehicle ? "Armada" : "Petugas"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-full p-2 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>
        {isVehicle ? (
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-bold">
              ID Kendaraan
              <input
                name="id"
                required
                defaultValue={editor.item?.id ?? editor.draftId}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-bold">
              Plat Nomor
              <input
                name="plate"
                required
                defaultValue={editor.item?.plate}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-bold">
              Kapasitas (ton)
              <input
                name="capacity"
                type="number"
                step="0.5"
                min="1"
                required
                defaultValue={
                  editor.item ? Number(editor.item.capacity.split(" ")[0]) : 5
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-bold">
              Status
              <select
                name="status"
                defaultValue={editor.item?.status ?? "Beroperasi"}
                className={inputClass}
              >
                <option>Beroperasi</option>
                <option>Maintenance</option>
              </select>
            </label>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-bold">
              Nama Petugas
              <input
                name="name"
                required
                defaultValue={editor.item?.name}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-bold">
              ID Petugas
              <input
                name="id"
                required
                defaultValue={editor.item?.id ?? editor.draftId}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-bold">
              Wilayah Tugas
              <input
                name="zone"
                required
                defaultValue={editor.item?.zone}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-bold">
              No. HP
              <input
                name="phone"
                type="tel"
                required
                defaultValue={editor.item?.phone}
                className={inputClass}
              />
            </label>
          </div>
        )}
        <button
          type="submit"
          className="mt-6 h-12 w-full rounded-2xl bg-[#087529] text-sm font-extrabold text-white hover:bg-[#066421]"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}

function DeleteModal({
  target,
  onCancel,
  onConfirm,
}: {
  target: DeleteTarget;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <section
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-[380px] rounded-[24px] bg-white p-7 text-center shadow-2xl"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-red-600">
          <Trash2 className="size-8" />
        </span>
        <h3 className="mt-5 text-lg font-extrabold">Hapus data?</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#667169]">
          {target.label} akan dihapus dan tidak dapat dikembalikan.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="h-11 rounded-xl border border-[#bdcdbf] text-sm font-bold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </section>
    </div>
  );
}

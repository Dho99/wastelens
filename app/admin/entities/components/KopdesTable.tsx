"use client";

import { Edit, Trash2 } from "lucide-react";
import type { EntityKopdes } from "../../types/entities";

interface Props {
  kopdes: EntityKopdes[];
  onEdit: (kopdes: EntityKopdes) => void;
  onDelete: (kopdes: EntityKopdes) => void;
}

export default function KopdesTable({ kopdes, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
            <th className="pb-3 pt-1">Koperasi ID</th>
            <th className="pb-3 pt-1">Nama Koperasi</th>
            <th className="pb-3 pt-1">Alamat</th>
            <th className="pb-3 pt-1">Status</th>
            <th className="pb-3 pt-1 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kopdes.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-400 font-bold">Tidak ada data koperasi cocok</td>
            </tr>
          ) : (
            kopdes.map((k) => (
              <tr key={k.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                <td className="py-3.5 font-mono text-gray-500 font-bold">#KOP-{k.id.slice(0, 5).toUpperCase()}</td>
                <td className="py-3.5 font-bold text-gray-800">
                  <div>{k.nama}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{k.email}</div>
                </td>
                <td className="py-3.5 font-bold text-gray-600 truncate max-w-[200px]">{k.alamat}</td>
                <td className="py-3.5">
                  {k.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-[#287A38] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#287A38]" /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Nonaktif
                    </span>
                  )}
                </td>
                <td className="py-3.5 text-right flex justify-end items-center gap-2">
                  <button
                    onClick={() => onEdit(k)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(k)}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

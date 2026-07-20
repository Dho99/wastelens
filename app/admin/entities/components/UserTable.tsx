"use client";

import { Edit } from "lucide-react";
import type { EntityUser } from "../../types/entities";

interface Props {
  users: EntityUser[];
  onEdit: (user: EntityUser) => void;
  onBlock: (user: EntityUser) => void;
  onActivate: (user: EntityUser) => void;
}

export default function UserTable({ users, onEdit, onBlock, onActivate }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
            <th className="pb-3 pt-1">User ID</th>
            <th className="pb-3 pt-1">Nama Pengguna</th>
            <th className="pb-3 pt-1">Role</th>
            <th className="pb-3 pt-1">Status</th>
            <th className="pb-3 pt-1 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-400 font-bold">Tidak ada data user cocok</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                <td className="py-3.5 font-mono text-gray-500 font-bold">#USR-{u.id.slice(0, 5).toUpperCase()}</td>
                <td className="py-3.5 font-bold text-gray-800">
                  <div>{u.nama}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{u.email}</div>
                </td>
                <td className="py-3.5">
                  <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[9px]">{u.role}</span>
                </td>
                <td className="py-3.5">
                  {u.status === "active" ? (
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
                    onClick={() => onEdit(u)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500" title="Edit User"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {u.status === "active" ? (
                    <button
                      onClick={() => onBlock(u)}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500" title="Block User"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 18,16.5L6.5,5A8,8 0 0,1 12,4M12,20A8,8 0 0,1 6,7.5L17.5,19A8,8 0 0,1 12,20Z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(u)}
                      className="px-2.5 py-1 text-[10px] bg-emerald-50 text-[#287A38] border border-emerald-100 rounded-md font-bold hover:bg-emerald-100 transition"
                    >
                      Aktifkan
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

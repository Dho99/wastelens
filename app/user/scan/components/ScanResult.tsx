"use client";

import {
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Weight,
  Trash2,
  Droplets,
  Brain,
} from "lucide-react";
import type { ScanSubmitResponse } from "../types/scan.types";

type Props = {
  result: ScanSubmitResponse;
  onGoHome: () => void;
  onViewHistory: () => void;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ANALYZED: { label: "Terverifikasi", color: "text-green-600" },
  WAITING: { label: "Menunggu Review", color: "text-amber-600" },
};

const SIZE_LABELS: Record<string, string> = {
  SMALL: "Kecil",
  MEDIUM: "Sedang",
  LARGE: "Besar",
  UNCERTAIN: "Tidak Pasti",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Rendah",
  MEDIUM: "Sedang",
  HIGH: "Tinggi",
  CRITICAL: "Kritis",
};

export function ScanResult({ result, onGoHome, onViewHistory }: Props) {
  const statusInfo = STATUS_LABELS[result.status] ?? { label: result.status, color: "text-gray-600" };
  const isSuccess = result.status === "ANALYZED";

  return (
    <div className="space-y-5">
      <div className="text-center space-y-3">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isSuccess ? "bg-green-100" : "bg-amber-100"}`}>
          {isSuccess
            ? <CheckCircle className="w-8 h-8 text-green-600" />
            : <Clock className="w-8 h-8 text-amber-600" />
          }
        </div>
        <h2 className="text-lg font-black text-gray-900">
          {isSuccess ? "Laporan Terkirim" : "Menunggu Pemeriksaan"}
        </h2>
        <p className={`text-sm font-semibold ${statusInfo.color}`}>
          {statusInfo.label}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {result.analysis && (
          <>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Ukuran</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {SIZE_LABELS[result.analysis.sizeCategory] ?? result.analysis.sizeCategory}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Jenis Sampah</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {result.analysis.wasteTypes.join(", ")}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Risiko Drainase</span>
              </div>
              <span className={`text-sm font-bold ${result.analysis.drainageRisk ? "text-red-500" : "text-green-500"}`}>
                {result.analysis.drainageRisk ? "Ya" : "Tidak"}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Confidence</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(result.analysis.confidence * 100)}%
              </span>
            </div>
          </>
        )}

        {result.priority && (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Prioritas</span>
            </div>
            <span className={`text-sm font-bold ${
              result.priority.level === "CRITICAL" ? "text-red-600" :
              result.priority.level === "HIGH" ? "text-orange-600" :
              result.priority.level === "MEDIUM" ? "text-amber-600" :
              "text-green-600"
            }`}>
              {PRIORITY_LABELS[result.priority.level] ?? result.priority.level}
              <span className="text-gray-400 font-normal ml-1">
                ({result.priority.score})
              </span>
            </span>
          </div>
        )}

        {result.locationVerification && (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Akurasi Lokasi</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {result.locationVerification.accuracyMeters.toFixed(1)} m
            </span>
          </div>
        )}

        {result.estimatedLoadUnit != null && (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Estimasi Beban</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {result.estimatedLoadUnit} unit
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={onViewHistory}
          className="w-full bg-[#287A38] hover:bg-[#20632d] text-white font-bold text-sm py-3.5 rounded-full transition-all"
        >
          Lihat Status Laporan
        </button>
        <button
          onClick={onGoHome}
          className="w-full bg-[#EBF1EC] hover:bg-[#dce6dd] text-[#1E7D38] font-bold text-sm py-3.5 rounded-full transition-all"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

interface ProdukItem {
  id: string;
  nama_barang: string;
  harga_koin: number;
  stok: number;
}

interface UserProfile {
  saldo_koin: number;
}

function ProdukContent({ params }: { params: Promise<{ kopdes_id: string }> }) {
  const { kopdes_id } = use(params);
  const router = useRouter();
  const [produkList, setProdukList] = useState<ProdukItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirming, setConfirming] = useState<ProdukItem | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [redemptionResult, setRedemptionResult] = useState<{
    sisa_koin: number;
    nama_barang: string;
  } | null>(null);
  const [redeemError, setRedeemError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [produkRes, profileRes] = await Promise.all([
          fetch(`/api/kopdes/${kopdes_id}/produk`),
          fetch("/api/user/profile"),
        ]);

        if (!produkRes.ok) {
          setError("Kopdes tidak ditemukan");
          setLoading(false);
          return;
        }

        const produkData = await produkRes.json();
        setProdukList(produkData);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }
      } catch {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [kopdes_id]);

  const handleRedeem = async () => {
    if (!confirming) return;
    setRedeeming(true);
    setRedeemError("");

    try {
      const res = await fetch("/api/penukaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produk_id: confirming.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRedeemError(data.error ?? "Gagal menukar koin");
        setRedeeming(false);
        return;
      }

      setQrDataUrl(data.qr_data_url);
      setRedemptionResult({ sisa_koin: data.sisa_koin, nama_barang: data.nama_barang });
      setRedeeming(false);
    } catch {
      setRedeemError("Gagal terhubung ke server");
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          onClick={() => router.push("/user/exchange")}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (qrDataUrl && redemptionResult) {
    return (
      <div className="space-y-4 p-4 text-center">
        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">Penukaran Sukses!</p>
          <p className="mt-1 text-xs text-green-700">
            {redemptionResult.nama_barang} — Sisa koin: {redemptionResult.sisa_koin}
          </p>
        </div>

        <div className="flex justify-center">
          <img src={qrDataUrl} alt="QR Code" className="size-64" />
        </div>

        <p className="text-xs text-neutral-500">
          Tunjukkan QR code ini ke petugas kopdes untuk menukarkan produk.
        </p>

        <button
          onClick={() => router.push("/user")}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Daftar Produk</h2>
        {profile && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {profile.saldo_koin} koin
          </span>
        )}
      </div>

      {produkList.length === 0 ? (
        <p className="text-center text-sm text-neutral-500">
          Tidak ada produk tersedia saat ini
        </p>
      ) : (
        <div className="space-y-3">
          {produkList.map((produk) => (
            <div
              key={produk.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4"
            >
              <div>
                <p className="font-medium">{produk.nama_barang}</p>
                <p className="text-xs text-neutral-400">
                  Stok: {produk.stok}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">
                  {produk.harga_koin} koin
                </p>
                <button
                  onClick={() => setConfirming(produk)}
                  disabled={profile !== null && profile.saldo_koin < produk.harga_koin}
                  className="mt-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:bg-neutral-300 disabled:text-neutral-500 transition-colors"
                >
                  {profile !== null && profile.saldo_koin < produk.harga_koin
                    ? "Koin Kurang"
                    : "Tukar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-bold">Konfirmasi Penukaran</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Tukar <strong>{confirming.nama_barang}</strong> seharga{" "}
              <strong>{confirming.harga_koin}</strong> koin?
            </p>
            {profile && (
              <p className="mt-1 text-xs text-neutral-400">
                Saldo Anda: {profile.saldo_koin} koin
              </p>
            )}

            {redeemError && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {redeemError}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setConfirming(null);
                  setRedeemError("");
                }}
                className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {redeeming ? "Memproses..." : "Ya, Tukar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProdukPage({
  params,
}: {
  params: Promise<{ kopdes_id: string }>;
}) {
  return (
    <ErrorBoundary>
      <ProdukContent params={params} />
    </ErrorBoundary>
  );
}

"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import QRCode from "qrcode";

interface ProdukItem {
  id: string;
  nama_barang: string;
  harga_koin: number;
  stok: number;
  is_active: boolean;
}

interface KopdesData {
  id: string;
  nama: string;
  produk: ProdukItem[];
}

interface UserProfile {
  saldo_koin: number;
}

interface CreateRedemptionResponse {
  success: boolean;
  message?: string;
  data?: {
    redemptionId: string;
    status: string;
    product: { name: string; quantity: number };
    unitCoinPrice: number;
    totalCoins: number;
    expiresAt: string;
    qrPayload: string;
  };
  errorCode?: string;
}

interface RedemptionDetail {
  success: boolean;
  data?: {
    id: string;
    status: string;
    product: { name: string; quantity: number };
    koperasi: { name: string };
    totalCoins: number;
    expiresAt: string;
    redeemedAt: string | null;
    cancelledAt: string | null;
    expiredAt: string | null;
  };
  errorCode?: string;
}

type PageStep = "products" | "confirm" | "qr" | "expired" | "redeemed" | "cancelled" | "error";

const MAX_QUANTITY = 10;

function ProdukContent({ params }: { params: Promise<{ kopdes_id: string }> }) {
  const { kopdes_id } = use(params);
  const router = useRouter();

  const [kopdes, setKopdes] = useState<KopdesData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduk, setSelectedProduk] = useState<ProdukItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<PageStep>("products");
  const [redeeming, setRedeeming] = useState(false);
  const [redemptionId, setRedemptionId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [totalCoins, setTotalCoins] = useState(0);
  const [unitCoinPrice, setUnitCoinPrice] = useState(0);
  const [redeemError, setRedeemError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [kopdesRes, profileRes] = await Promise.all([
          fetch(`/api/kopdes/${kopdes_id}`),
          fetch("/api/user/profile"),
        ]);

        if (!kopdesRes.ok) {
          setError("Kopdes tidak ditemukan");
          setLoading(false);
          return;
        }

        const kopdesData: KopdesData = (await kopdesRes.json()).data ?? (await kopdesRes.json());
        setKopdes(kopdesData);

        if (profileRes.ok) {
          const profileData = (await profileRes.json()).data ?? (await profileRes.json());
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

  useEffect(() => {
    if (!expiresAt || step !== "qr") return;

    const updateCountdown = () => {
      const now = Date.now();
      const expires = new Date(expiresAt).getTime();
      const diff = Math.max(0, expires - now);

      if (diff <= 0) {
        setCountdown("Kedaluwarsa");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, step]);

  useEffect(() => {
    if (!redemptionId || step !== "qr") return;

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/redemptions/${redemptionId}`);
        const data: RedemptionDetail = await res.json();

        if (data.success && data.data) {
          const status = data.data.status;
          if (status === "REDEEMED") {
            setStep("redeemed");
            return;
          }
          if (status === "EXPIRED") {
            setStep("expired");
            return;
          }
          if (status === "CANCELLED") {
            setStep("cancelled");
            return;
          }
        }
      } catch {
        // ignore polling errors
      }
    };

    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [redemptionId, step]);

  const handleOpenConfirm = useCallback((produk: ProdukItem) => {
    setSelectedProduk(produk);
    setQuantity(1);
    setStep("confirm");
    setRedeemError("");
  }, []);

  const handleRedeem = useCallback(async () => {
    if (!selectedProduk) return;
    setRedeeming(true);
    setRedeemError("");

    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await fetch("/api/redemptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          productId: selectedProduk.id,
          quantity,
        }),
      });

      const data: CreateRedemptionResponse = await res.json();

      if (!res.ok) {
        setRedeemError(data.errorCode ?? data.message ?? "Gagal menukar koin");
        setRedeeming(false);
        return;
      }

      if (data.data) {
        setRedemptionId(data.data.redemptionId);
        setTotalCoins(data.data.totalCoins);
        setUnitCoinPrice(data.data.unitCoinPrice);
        setExpiresAt(data.data.expiresAt);

        const qrImage = await QRCode.toDataURL(data.data.qrPayload, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 300,
        });
        setQrDataUrl(qrImage);
        setStep("qr");

        if (profile) {
          setProfile({ ...profile, saldo_koin: profile.saldo_koin - data.data.totalCoins });
        }
      }
    } catch {
      setRedeemError("Gagal terhubung ke server");
    } finally {
      setRedeeming(false);
    }
  }, [selectedProduk, quantity, profile]);

  const handleCancel = useCallback(async () => {
    if (!redemptionId) return;
    setCancelling(true);

    try {
      const res = await fetch(`/api/redemptions/${redemptionId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setStep("cancelled");
      } else {
        setRedeemError(data.error ?? "Gagal membatalkan");
      }
    } catch {
      setRedeemError("Gagal membatalkan");
    } finally {
      setCancelling(false);
    }
  }, [redemptionId]);

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

  if (step === "qr" && qrDataUrl) {
    return (
      <div className="space-y-4 p-4">
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-800">Penukaran Berhasil Dibuat</p>
          <p className="mt-1 text-xs text-green-700">
            {selectedProduk?.nama_barang} &times; {quantity}
          </p>
        </div>

        <div className="flex justify-center">
          <img src={qrDataUrl} alt="QR Code" className="size-64" />
        </div>

        <div className="text-center">
          <p className="text-lg font-bold tabular-nums">{countdown}</p>
          <p className="text-xs text-neutral-500">Sisa waktu</p>
        </div>

        <div className="rounded-xl border bg-white p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Produk</span>
            <span className="font-medium">{selectedProduk?.nama_barang}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Jumlah</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Total Koin</span>
            <span className="font-medium text-emerald-600">{totalCoins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Koperasi</span>
            <span className="font-medium">{kopdes?.nama}</span>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-500">
          Tunjukkan QR code ini ke petugas koperasi
        </p>

        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
        >
          {cancelling ? "Membatalkan..." : "Batalkan Penukaran"}
        </button>
      </div>
    );
  }

  if (step === "redeemed") {
    return (
      <div className="space-y-4 p-4 text-center">
        <div className="rounded-xl bg-green-50 p-6">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl">&#10003;</div>
          <h2 className="text-lg font-bold text-green-800">Penukaran Berhasil!</h2>
          <p className="mt-2 text-sm text-green-700">
            {selectedProduk?.nama_barang} &times; {quantity} telah diserahkan oleh koperasi.
          </p>
        </div>
        <button
          onClick={() => router.push("/user")}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  if (step === "expired") {
    return (
      <div className="space-y-4 p-4 text-center">
        <div className="rounded-xl bg-yellow-50 p-6">
          <h2 className="text-lg font-bold text-yellow-800">QR Kedaluwarsa</h2>
          <p className="mt-2 text-sm text-yellow-700">
            Waktu penukaran telah habis. Koin Anda telah dikembalikan.
          </p>
        </div>
        <button
          onClick={() => router.push("/user")}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  if (step === "cancelled") {
    return (
      <div className="space-y-4 p-4 text-center">
        <div className="rounded-xl bg-neutral-50 p-6">
          <h2 className="text-lg font-bold text-neutral-800">Penukaran Dibatalkan</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Koin Anda telah dikembalikan.
          </p>
        </div>
        <button
          onClick={() => router.push("/user")}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const totalPrice = selectedProduk ? selectedProduk.harga_koin * quantity : 0;
  const canRedeem =
    selectedProduk &&
    profile &&
    profile.saldo_koin >= totalPrice &&
    selectedProduk.stok >= quantity;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{kopdes?.nama ?? "Produk"}</h2>
        {profile && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {profile.saldo_koin} koin
          </span>
        )}
      </div>

      {(!kopdes || kopdes.produk.length === 0) ? (
        <p className="text-center text-sm text-neutral-500">
          Tidak ada produk tersedia saat ini
        </p>
      ) : (
        <div className="space-y-3">
          {kopdes.produk
            .filter((p) => p.is_active)
            .map((produk) => {
              const coinNotEnough = profile && profile.saldo_koin < produk.harga_koin;
              const outOfStock = produk.stok <= 0;
              const disabled = coinNotEnough || outOfStock;

              return (
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
                      onClick={() => handleOpenConfirm(produk)}
                      disabled={disabled}
                      className="mt-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:bg-neutral-300 disabled:text-neutral-500 transition-colors"
                    >
                      {outOfStock ? "Stok Habis" : coinNotEnough ? "Koin Kurang" : "Tukar"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {step === "confirm" && selectedProduk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-bold">Konfirmasi Penukaran</h3>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Produk</span>
                <span className="font-medium">{selectedProduk.nama_barang}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Harga per unit</span>
                <span className="font-medium">{selectedProduk.harga_koin} koin</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Jumlah</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="flex size-7 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium hover:bg-neutral-200 disabled:opacity-30"
                  >
                    &minus;
                  </button>
                  <span className="w-6 text-center font-medium tabular-nums">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(MAX_QUANTITY, quantity + 1))
                    }
                    disabled={quantity >= MAX_QUANTITY}
                    className="flex size-7 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium hover:bg-neutral-200 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-emerald-600">{totalPrice} koin</span>
              </div>
              {profile && (
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Sisa saldo</span>
                  <span className={profile.saldo_koin - totalPrice >= 0 ? "" : "text-red-500"}>
                    {profile.saldo_koin - totalPrice} koin
                  </span>
                </div>
              )}
            </div>

            {redeemError && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {redeemError}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setStep("products");
                  setRedeemError("");
                }}
                className="flex-1 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming || !canRedeem}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {redeeming ? "Memproses..." : "Tukar"}
              </button>
            </div>

            {!canRedeem && !redeeming && (
              <p className="mt-2 text-center text-xs text-red-500">
                {!profile
                  ? "Memuat saldo..."
                  : profile.saldo_koin < totalPrice
                    ? "Saldo koin tidak mencukupi"
                    : selectedProduk.stok < quantity
                      ? "Stok tidak mencukupi"
                      : ""}
              </p>
            )}
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

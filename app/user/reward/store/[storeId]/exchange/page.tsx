"use client";

import React, { useEffect, useState, use, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

import { fetchProductDetail } from "./services/exchangeService";

import { ExchangeHeader } from "./components/ExchangeHeader";
import { ProductVisual } from "./components/ProductVisual";
import { AlertBanner } from "./components/AlertBanner";
import { DetailsCard } from "./components/DetailsCard";
import { NoticeBanner } from "./components/NoticeBanner";
import { RedeemBar } from "./components/RedeemBar";
import { InsufficientCoins } from "./components/InsufficientCoins";

interface PageProps {
  params: Promise<{ storeId: string }>;
}

function ExchangeContent({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { setHideTabBar } = useTabBar();

  const storeId = resolvedParams.storeId;
  const productId = searchParams.get("product");

  const [product, setProduct] = useState<Awaited<ReturnType<typeof fetchProductDetail>> | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    if (!productId) {
      setError("Produk tidak dipilih");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchProductDetail(storeId, productId)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [storeId, productId]);

  useEffect(() => {
    if (!isSubmitting) {
      idempotencyKeyRef.current = null;
    }
  }, [productId, quantity, isSubmitting]);

  const handleExchange = useCallback(async () => {
    if (isSubmitting) return;

    if (!productId) {
      setError("Produk tidak valid");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Jumlah produk tidak valid");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const key = idempotencyKeyRef.current ?? crypto.randomUUID();
    idempotencyKeyRef.current = key;

    try {
      const response = await fetch("/api/redemptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const resettableErrors = [
          "INVALID_QUANTITY",
          "PRODUCT_NOT_FOUND",
          "PRODUCT_INACTIVE",
          "OUT_OF_STOCK",
          "INSUFFICIENT_BALANCE",
          "COOPERATIVE_INACTIVE",
        ];

        if (resettableErrors.includes(result.code)) {
          idempotencyKeyRef.current = null;
        }

        throw new Error(result.error ?? "Gagal membuat transaksi penukaran");
      }

      const redemptionId = result.data?.id;

      if (!redemptionId) {
        throw new Error("Redemption ID tidak ditemukan");
      }

      idempotencyKeyRef.current = null;

      router.push(
        `/user/reward/store/${storeId}/exchange/generate-qr?redemptionId=${redemptionId}`,
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }, [productId, quantity, storeId, router, isSubmitting]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse bg-[#FAF9F5] min-h-screen">
        <div className="flex justify-between items-center h-10" />
        <div className="h-56 bg-gray-200 rounded-3xl" />
        <div className="h-16 bg-gray-200 rounded-2xl" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="p-8 text-center text-gray-500 bg-[#FAF9F5] min-h-screen">
        Silakan pilih produk terlebih dahulu.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500 bg-[#FAF9F5] min-h-screen">
        {error || "Gagal memuat detail produk."}
      </div>
    );
  }

  const insufficient = product.userBalance < product.productPrice;

  if (insufficient) {
    const needed = product.productPrice - product.userBalance;
    return (
      <InsufficientCoins
        neededCoins={needed}
        onRetryScan={() => router.push("/user/scan")}
        onBack={() => router.back()}
      />
    );
  }

  const maxQuantity = Math.min(
    product.stock,
    Math.floor(product.userBalance / product.productPrice),
  );

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      <ExchangeHeader onBackClick={() => router.back()} />

      <ProductVisual
        productName={product.productName}
        imageUrl={product.productImageUrl}
        isAvailable={product.isAvailable}
      />

      <AlertBanner />

      {error && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-2xl">
            {error}
          </div>
        </div>
      )}

      <DetailsCard
        quantity={quantity}
        unitPrice={product.productPrice}
        userBalance={product.userBalance}
        merchantName={product.merchantName}
        method={product.method}
      />

      <NoticeBanner />

      <RedeemBar
        quantity={quantity}
        maxQuantity={maxQuantity}
        unitPrice={product.productPrice}
        remainingCoins={product.userBalance}
        onQuantityChange={setQuantity}
        onRedeem={handleExchange}
        loading={isSubmitting}
      />
    </div>
  );
}

export default function ExchangePage({ params }: PageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
        <ExchangeContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

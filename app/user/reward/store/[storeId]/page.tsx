"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { useStoreDetail } from "./hooks/useStoreDetail";

// Slices
import { StoreHeader } from "./components/StoreHeader";
import { StoreCover } from "./components/StoreCover";
import { CategoryFilter, StoreCategoryFilter } from "./components/CategoryFilter";
import { ProductsGrid } from "./components/ProductsGrid";
import { CheckoutBar } from "./components/CheckoutBar";

interface PageProps {
  params: Promise<{ storeId: string }>;
}

export default function StoreDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [activeFilter, setActiveFilter] = useState<StoreCategoryFilter>("ALL");
  const { setHideTabBar } = useTabBar();
  const { data: store, isLoading } = useStoreDetail(resolvedParams.storeId);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const [cart, setCart] = useState<Record<string, number>>({});

  // Adjust cart items
  const handleAddProduct = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      if (currentQty <= 0) return prev;
      return {
        ...prev,
        [productId]: currentQty - 1
      };
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
        <div className="h-10 bg-gray-200 rounded-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-44 bg-gray-200 rounded-3xl" />
          <div className="h-44 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat detail toko.
      </div>
    );
  }

  // Calculate cart stats
  let totalItems = 0;
  let totalCoins = 0;

  store.products.forEach((prod) => {
    const qty = cart[prod.id] || 0;
    if (qty > 0) {
      totalItems += qty;
      totalCoins += qty * prod.coinsPrice;
    }
  });

  // Filter products based on category pill
  const filteredProducts = activeFilter === "ALL"
    ? store.products
    : store.products.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-32">
      {/* 1. Header (IndoFreshMart Title) */}
      <StoreHeader storeName={store.name} onBackClick={() => router.back()} />

      {/* 2. Cover Photo Display details */}
      <StoreCover
        name={store.name}
        rating={store.rating}
        isOpen={store.isOpen}
        address={store.address}
        coverImageUrl={store.coverImageUrl}
      />

      {/* 3. Category scroll filters */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 4. Products grid panels */}
      <ProductsGrid
        products={filteredProducts}
        cart={cart}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
        onViewAll={() => console.log("View all store products...")}
      />

      {/* 5. Floating Checkout Bar */}
      <CheckoutBar
        totalItems={totalItems}
        totalCoins={totalCoins}
        onCheckout={() => router.push(`/user/reward/store/${resolvedParams.storeId}/exchange`)}
      />
    </div>
  );
}

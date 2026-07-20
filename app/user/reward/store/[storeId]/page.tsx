"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";
import { useStoreDetail } from "./hooks/useStoreDetail";

import { StoreHeader } from "./components/StoreHeader";
import { StoreCover } from "./components/StoreCover";
import {
    CategoryFilter,
    StoreCategoryFilter,
} from "./components/CategoryFilter";
import { ProductsGrid } from "./components/ProductsGrid";

interface PageProps {
    params: Promise<{ storeId: string }>;
}

export default function StoreDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [activeFilter, setActiveFilter] =
        useState<StoreCategoryFilter>("ALL");
    const { setHideTabBar } = useTabBar();
    const { data: store, isLoading } = useStoreDetail(resolvedParams.storeId);

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    const handleExchange = (productId: string) => {
        router.push(
            `/user/reward/store/${resolvedParams.storeId}/exchange?product=${productId}`,
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4 p-4 animate-pulse bg-[#FAF9F5] h-dvh">
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
            <div className="p-8 text-center text-gray-500 bg-[#FAF9F5]">
                Gagal memuat detail toko.
            </div>
        );
    }

    const filteredProducts =
        activeFilter === "ALL"
            ? store.products
            : store.products.filter((p) => p.category === activeFilter);

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-32">
            <StoreHeader
                storeName={store.name}
                onBackClick={() => router.back()}
            />

            <StoreCover
                name={store.name}
                rating={store.rating}
                isOpen={store.isOpen}
                address={store.address}
                coverImageUrl={store.coverImageUrl}
            />

            <CategoryFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <ProductsGrid
                products={filteredProducts}
                onExchange={handleExchange}
            />
        </div>
    );
}

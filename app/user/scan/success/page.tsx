"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

import { SuccessBadge } from "./components/SuccessBadge";
import { ReportIdCard } from "./components/ReportIdCard";
import { ImpactCard } from "./components/ImpactCard";
import { ScanPhotoCard } from "./components/ScanPhotoCard";
import { SuccessActions } from "./components/SuccessActions";

export default function SuccessPage() {
    const router = useRouter();
    const [data, setData] = useState<{
        reportId: string;
        status: string;
        rewardStatus: string;
        reportTime: string;
        locationName: string;
        scanImageUrl?: string;
        landscapeImageUrl: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const { setHideTabBar } = useTabBar();

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    useEffect(() => {
        const saved = localStorage.getItem("success_report_data");
        if (saved) {
            setData(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 p-4 animate-pulse">
                <div className="h-28 w-28 bg-gray-200 rounded-full mx-auto" />
                <div className="h-6 w-48 bg-gray-200 rounded-md mx-auto" />
                <div className="h-20 bg-gray-200 rounded-3xl" />
                <div className="h-24 bg-gray-200 rounded-3xl" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-gray-500">
                Gagal memuat status keberhasilan laporan.
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F5] min-h-screen pb-12 flex flex-col justify-between">
            <div>
                <SuccessBadge />

                <ReportIdCard
                    reportId={data.reportId}
                    reportTime={data.reportTime}
                />

                <ImpactCard rewardPoints={0} />

                {data.scanImageUrl && (
                    <ScanPhotoCard
                        imageUrl={data.scanImageUrl}
                        locationName={data.locationName}
                    />
                )}
            </div>

            <SuccessActions
                onCheckStatus={() =>
                    router.push(`/user/history/report/${data.reportId}`)
                }
                onGoHome={() => router.push("/user")}
            />
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import {
    getSuccessDummyData,
    SuccessReportData,
} from "./services/successService";

// Slices
import { SuccessBadge } from "./components/SuccessBadge";
import { ReportIdCard } from "./components/ReportIdCard";
import { ImpactCard } from "./components/ImpactCard";
import { EnvironmentView } from "./components/EnvironmentView";
import { SuccessActions } from "./components/SuccessActions";

export default function SuccessPage() {
    const router = useRouter();
    const [data, setData] = useState<SuccessReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const { setHideTabBar } = useTabBar();

    useEffect(() => {
        setHideTabBar(true);
        return () => setHideTabBar(false);
    }, [setHideTabBar]);

    useEffect(() => {
        // Load success reporting details from localStorage or fallback to dummy data
        const saved = localStorage.getItem("success_report_data");
        if (saved) {
            setData(JSON.parse(saved));
        } else {
            const mockData = getSuccessDummyData();
            setData(mockData);
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
                {/* 1. Large Top Success checkmark & labels */}
                <SuccessBadge />

                {/* 2. Report ID & Timestamp Card */}
                <ReportIdCard
                    reportId={data.reportId}
                    reportTime={data.reportTime}
                />

                {/* 3. Impact Tally coins description Card */}
                <ImpactCard rewardPoints={data.rewardPoints} />

                {/* 4. Beautiful landscape environment visual tag */}
                <EnvironmentView
                    locationName={data.locationName}
                    landscapeImageUrl={data.landscapeImageUrl}
                />
            </div>

            {/* 5. Bottom Navigation Actions Buttons */}
            <SuccessActions
                onCheckStatus={() => router.push("/user/history/report/88210")}
                onGoHome={() => router.push("/user")}
            />
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { RoleTabNavigation, RoleTabType } from "./tabs/RoleTabNavigation";
import { TabContentWarga } from "./tabs/TabContentWarga";
import { TabContentOperator } from "./tabs/TabContentOperator";
import { TabContentPetugas } from "./tabs/TabContentPetugas";

export function RoleTabsSection() {
    const [activeTab, setActiveTab] = useState<RoleTabType>("warga");

    return (
        <section
            id="fitur-peran"
            className="py-10 bg-white select-none relative"
        >
            <div className="container mx-auto lg:px-0 md:px-12 px-6 space-y-12 ">
                {/* Top 3-Role Pill Navigation Bar */}
                <RoleTabNavigation
                    activeTab={activeTab}
                    onTabChange={(tab) => setActiveTab(tab)}
                />

                {/* Dynamic Tab Content with dedicated mockup slot per role */}
                <div className="min-h-[480px]">
                    {activeTab === "warga" && <TabContentWarga />}
                    {activeTab === "operator" && <TabContentOperator />}
                    {activeTab === "petugas" && <TabContentPetugas />}
                </div>
            </div>
        </section>
    );
}

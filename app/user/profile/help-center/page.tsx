"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { useTabBar } from "@/components/nav/tab-bar-context";

// Services
import { getHelpDummyData, HelpDetails } from "./services/helpService";

// Slices
import { HelpHeader } from "./components/HelpHeader";
import { GreetingCard } from "./components/GreetingCard";
import { HelpSearch } from "./components/HelpSearch";
import { PopularTopics } from "./components/PopularTopics";
import { ContactChannels } from "./components/ContactChannels";
import { HelpFooter } from "./components/HelpFooter";

function HelpCenterContent() {
  const router = useRouter();
  const [data, setData] = useState<HelpDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { setHideTabBar } = useTabBar();

  useEffect(() => {
    // Fetch mock help center database from service layer
    const helpData = getHelpDummyData();
    setData(helpData);
    setLoading(false);
  }, []);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 animate-pulse">
        <div className="flex justify-between items-center h-10" />
        <div className="h-20 bg-gray-200 rounded-3xl" />
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="h-44 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Gagal memuat bantuan dan dukungan.
      </div>
    );
  }

  // Filter topics based on search query
  const filteredTopics = data.topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-12">
      {/* 1. Header (Bantuan & Dukungan title & back arrow) */}
      <HelpHeader onBackClick={() => router.back()} />

      {/* 2. Top Greeting Card */}
      <GreetingCard />

      {/* 3. Search Bar Input */}
      <HelpSearch value={searchQuery} onChange={setSearchQuery} />

      {/* 4. Popular Topics list panels */}
      <PopularTopics
        topics={filteredTopics}
        onTopicClick={(id) => console.log(`Topic clicked: ${id}`)}
      />

      {/* 5. Contact kurator channels (Live Chat, WhatsApp, Email) */}
      <ContactChannels
        whatsappHours={data.whatsappHours}
        emailResponseTime={data.emailResponseTime}
        onLiveChatClick={() => console.log("Starting Live Chat session...")}
        onWhatsappClick={() => console.log("Redirecting to WhatsApp chat link...")}
        onEmailClick={() => console.log("Drafting customer support email...")}
      />

      {/* 6. Footer branding quote */}
      <HelpFooter quote={data.footerQuote} />
    </div>
  );
}

export default function HelpCenterPage() {
  return (
    <ErrorBoundary>
      <HelpCenterContent />
    </ErrorBoundary>
  );
}

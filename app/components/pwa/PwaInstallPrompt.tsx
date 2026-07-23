"use client";

import React, { useEffect, useState } from "react";
import { Leaf, Download, X, Share, PlusSquare } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const ALLOWED_ROLES = ["user", "petugas"];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaInstallPrompt() {
  const { data: session, isPending } = useSession();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAllowed = !isPending && session && role && ALLOWED_ROLES.includes(role);

  useEffect(() => {
    if (!isAllowed) return;

    // 0. Register service worker for offline support
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 1. Check if user already dismissed recently
    const dismissed = localStorage.getItem("wastelens_pwa_dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Suppress for 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // 2. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone);

    if (isStandalone) {
      return;
    }

    // 3. Detect iOS WebKit
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    if (isIosDevice) {
      // iOS doesn't support beforeinstallprompt event, show prompt directly if not standalone
      setTimeout(() => {
        setIsIos(true);
        setShowPrompt(true);
      }, 0);
      return;
    }

    // 4. Handle standard Chromium/Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isAllowed]);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide((prev) => !prev);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("wastelens_pwa_dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (isPending || !isAllowed || !showPrompt) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md select-none animate-in slide-in-from-bottom duration-300">
      
      {/* Main Banner Card */}
      <div className="bg-white/95 backdrop-blur-lg border border-emerald-200/90 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3.5">
        
        {/* Left Icon Badge */}
        <div className="w-11 h-11 rounded-xl bg-[#15803d] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Leaf className="w-6 h-6 fill-white stroke-none" />
        </div>

        {/* Center Text Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-black text-[#0f291e] tracking-tight truncate">
              Install Aplikasi WasteLens
            </h4>
            <span className="bg-emerald-100 text-[#15803d] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shrink-0">
              App
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
            {isIos
              ? "Akses instan dari Layar Utama ponsel Anda."
              : "Laporan offline, akses instan & notifikasi."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="bg-[#15803d] hover:bg-[#0f602e] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Tutup PWA Prompt"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* iOS Installation Instruction Guide Drawer */}
      {isIos && showIosGuide && (
        <div className="mt-2 bg-slate-900 text-white rounded-2xl p-4 shadow-xl text-xs space-y-2.5 border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-extrabold text-emerald-400 border-b border-slate-800 pb-2">
            <span>Cara Install di iOS Safari:</span>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-2 text-slate-300 font-medium leading-relaxed text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <span>
                Ketuk tombol <strong>Bagikan</strong> (<Share className="w-3 h-3 inline mx-0.5" />) di bagian bawah browser Safari.
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <span>
                Gulir ke bawah lalu pilih <strong>Tambahkan ke Layar Utama</strong> (<PlusSquare className="w-3 h-3 inline mx-0.5" />).
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

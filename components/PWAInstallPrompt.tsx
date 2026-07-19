"use client";

import React, { useEffect, useState, useRef } from "react";

const LS_KEY = "pwa_dismissed_at";
const DISMISS_DAYS = 3;

function getDismissedAt(): number | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(LS_KEY);
  return val ? Number(val) : null;
}

function setDismissed() {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, String(Date.now()));
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error - Safari iOS proprietary property
    window.navigator.standalone === true
  );
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isDismissExpired(): boolean {
  const dismissedAt = getDismissedAt();
  if (!dismissedAt) return true;
  return Date.now() - dismissedAt > DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PWAInstallPrompt() {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const isIOSMode = !isStandalone() && isDismissExpired() && isIOS();
  const [visible, setVisible] = useState(isIOSMode);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW registration failed silently */
      });
    }

    if (isStandalone() || !isDismissExpired()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === "accepted") {
      setVisible(false);
    }

    deferredPromptRef.current = null;
  };

  const handleLater = () => {
    setDismissed();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 sm:items-center sm:pb-0">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="mb-1 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E7D38] text-lg font-black text-white shadow-sm">
            W
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Install WasteLens
            </h2>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Install aplikasi WasteLens untuk akses lebih cepat, notifikasi
          laporan, dan pengalaman offline yang lebih baik.
        </p>

        {isIOSMode ? (
          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
            <p className="font-bold">Instalasi Manual untuk iOS Safari:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>Ketuk ikon{" "}
                <span className="inline-flex size-5 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-600">
                  &#x25C9;
                </span>{" "}
                Share di bilah bawah Safari
              </li>
              <li>Gulir ke bawah dan pilih{" "}
                <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
              </li>
              <li>Ketuk &quot;Add&quot; di pojok kanan atas</li>
            </ol>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="mt-5 w-full rounded-full bg-[#1E7D38] py-3.5 text-sm font-extrabold text-white shadow-sm transition-all duration-200 active:scale-95 hover:bg-[#16632d]"
          >
            Install Sekarang
          </button>
        )}

        <button
          onClick={handleLater}
          className="mt-3 w-full rounded-full py-3 text-xs font-bold text-gray-500 transition-all duration-200 active:scale-95 hover:text-gray-700"
        >
          Nanti
        </button>
      </div>
    </div>
  );
}

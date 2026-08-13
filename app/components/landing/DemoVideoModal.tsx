"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

const DRIVE_FILE_ID = "YOUR_GOOGLE_DRIVE_FILE_ID";

export function DemoVideoModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <h3 className="text-sm font-extrabold text-[#0f291e] tracking-tight">
                        Video Demo WasteLens
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        aria-label="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-200">
                        <video
                            src={`https://drive.google.com/uc?export=download&id=1dUCd8aiLBiZVVvwoCXikiNTLGDqVEDI8`}
                            className="absolute inset-0 w-full h-full"
                            // allow="autoplay; encrypted-media; fullscreen"
                            // allowFullScreen
                            title="Video Demo WasteLens"
                        />
                    </div>
                    {/* <p className="mt-3 text-xs font-medium text-slate-400 text-center">
                        Ganti{" "}
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                            DRIVE_FILE_ID
                        </code>{" "}
                        dengan ID file Google Drive yang sesuai
                    </p> */}
                </div>
            </div>
        </div>
    );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const AutoCollectivePanel = dynamic(
    () =>
        import("./auto-collective-panel").then((mod) => ({
            default: mod.AutoCollectivePanel,
        })),
    { ssr: false },
);

interface Props {
    selectedPickupIds: string[];
    onClose: () => void;
}

export function AutoCollectiveModal({ selectedPickupIds, onClose }: Props) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/45 p-3 sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label="Rute Otomatis Pickup"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="h-[min(90dvh,800px)] w-[min(94vw,1200px)] overflow-hidden rounded-[24px] bg-white shadow-2xl [&>*]:!relative [&>*]:!inset-auto [&>*]:!h-full [&>*]:!w-full">
                <AutoCollectivePanel
                    onClose={onClose}
                    selectedPickupIds={selectedPickupIds}
                />
            </div>
        </div>,
        document.body,
    );
}

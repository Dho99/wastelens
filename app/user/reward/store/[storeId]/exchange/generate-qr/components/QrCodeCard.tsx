import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrCodeCardProps {
    merchantName: string;
    qrisData: string | null;
    initialSeconds: number;
    status: string;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({
    merchantName,
    qrisData,
    initialSeconds,
    status,
}) => {
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const initialRef = useRef(initialSeconds);
    const [seconds, setSeconds] = useState(initialSeconds);

    const isTerminal =
        status === "COMPLETED" ||
        status === "CANCELLED" ||
        status === "EXPIRED";

    useEffect(() => {
        initialRef.current = initialSeconds;
    }, [initialSeconds]);

    useEffect(() => {
        if (qrisData) {
            QRCode.toDataURL(qrisData, {
                width: 400,
                margin: 2,
                color: { dark: "#287A38", light: "#FFFFFF" },
            })
                .then(setQrDataUrl)
                .catch(() => {
                    QRCode.toDataURL(qrisData, { width: 400, margin: 2 })
                        .then(setQrDataUrl)
                        .catch(() => {});
                });
        }
    }, [qrisData]);

    useEffect(() => {
        if (isTerminal) return;

        const timer = setInterval(() => {
            setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [isTerminal]);

    useEffect(() => {
        if (!isTerminal) return;

        setSeconds(0);
    }, [isTerminal]);

    const formatTime = (totalSecs: number) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPercent =
        initialSeconds > 0 ? (seconds / initialSeconds) * 100 : 0;

    const renderQrContent = () => {
        if (status === "COMPLETED") {
            return (
                <div className="w-64 h-64 rounded-3xl overflow-hidden bg-[#E8F5E9] border border-[#287A38]/30 p-5 flex flex-col items-center justify-center gap-3">
                    <svg
                        className="w-20 h-20 text-[#287A38]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 1,1 20,12A8,8 0 0,1 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z" />
                    </svg>
                    <span className="text-xs font-black text-[#287A38] text-center">
                        Penukaran Berhasil
                    </span>
                </div>
            );
        }

        if (status === "CANCELLED" || status === "EXPIRED") {
            return (
                <div className="w-64 h-64 rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 p-5 flex flex-col items-center justify-center gap-3">
                    <svg
                        className="w-20 h-20 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 1,1 20,12A8,8 0 0,1 12,20M13,17H11V15H13M13,13H11V7H13" />
                    </svg>
                    <span className="text-xs font-black text-gray-400 text-center">
                        {status === "CANCELLED"
                            ? "Penukaran Dibatalkan"
                            : "Waktu Habis"}
                    </span>
                </div>
            );
        }

        if (qrDataUrl) {
            return (
                <div className="w-64 h-64 rounded-3xl overflow-hidden bg-white border border-gray-100 p-5 flex flex-col items-center justify-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
                </div>
            );
        }

        return (
            <div className="w-64 h-64 rounded-3xl overflow-hidden bg-white border border-gray-100 p-5 flex flex-col items-center justify-center gap-3">
                <canvas ref={canvasRef} className="w-48 h-48" />
                {!qrisData && (
                    <span className="text-[7.5px] font-black text-gray-400 tracking-wider uppercase">
                        Memuat QR...
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="px-4 mb-5 flex flex-col items-center select-none">
            <h2 className="text-[15px] font-black text-gray-900 text-center tracking-tight leading-snug max-w-[280px]">
                Tunjukkan kode ini ke kasir {merchantName}
            </h2>
            <p className="text-xs text-gray-400 font-semibold text-center mt-1 mb-6">
                Berlaku untuk penukaran barang pilihan Anda
            </p>

            <div className="bg-white border border-gray-100 rounded-[36px] p-6 shadow-sm flex flex-col items-center justify-center w-full max-w-[340px] relative">
                {renderQrContent()}

                {!isTerminal && (
                    <>
                        <div className="flex items-center gap-1.5 mb-2.5 mt-4">
                            <svg
                                className="w-5 h-5 text-[#287A38] fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                            </svg>
                            <span className="text-xl font-extrabold text-[#287A38] tracking-tight">
                                {formatTime(seconds)}
                            </span>
                        </div>

                        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-[#287A38] transition-all duration-1000 ease-linear rounded-full"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <span className="text-[8.5px] font-black tracking-widest text-gray-400 leading-none mb-1">
                            KODE DIPERBARUI OTOMATIS
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

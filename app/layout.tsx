import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { ClientLayout } from "@/components/client-layout";
import { PwaInstallPrompt } from "@/app/components/pwa/PwaInstallPrompt";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: "swap",
});

export const metadata: Metadata = {
    title: "WasteLens",
    description: "Laporkan sampah, dapatkan koin, tukar reward.",
    manifest: "/manifest.json",
    icons: {
        icon: [
            {
                url: "/icons/icon-192.svg",
                sizes: "192x192",
                type: "image/svg+xml",
            },
            {
                url: "/icons/icon-512.svg",
                sizes: "512x512",
                type: "image/svg+xml",
            },
        ],
        apple: "/icons/apple-touch-icon.svg",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "WasteLens",
    },
};

export const viewport: Viewport = {
    themeColor: "#1E7D38",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${manrope.className} ${manrope.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <ClientLayout>{children}</ClientLayout>
                <PwaInstallPrompt />
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}

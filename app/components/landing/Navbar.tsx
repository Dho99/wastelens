"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";

export function Navbar() {
    const [activeTab, setActiveTab] = useState("Home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "Cara Kerja", href: "#cara-kerja" },
        { name: "Solusi", href: "#solusi" },
        { name: "Reward", href: "#reward" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 transition-all select-none">
            <div className="container w-full mx-auto py-3.5 flex items-center justify-between px-6 md:px-12">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-full bg-[#15803d] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                        <Leaf className="w-5 h-5 fill-white stroke-none" />
                    </div>
                    <span className="font-extrabold text-xl text-[#0f291e] tracking-tight">
                        WasteLens
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = activeTab === link.name;
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setActiveTab(link.name)}
                                className={`relative py-1.5 text-xs font-bold transition-colors ${
                                    isActive
                                        ? "text-[#15803d]"
                                        : "text-slate-600 hover:text-[#15803d]"
                                }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#15803d] rounded-full" />
                                )}
                            </a>
                        );
                    })}
                </nav>

                {/* Action Buttons Right */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="bg-[#edf7f2] hover:bg-[#e1f2e8] text-[#15803d] border border-emerald-200/60 rounded-xl px-5 py-2 text-xs font-extrabold transition-all shadow-2xs"
                    >
                        Masuk
                    </Link>
                    <Link
                        href="/login"
                        className="bg-[#15803d] hover:bg-[#0f602e] text-white rounded-xl px-5 py-2 text-xs font-extrabold transition-all shadow-sm hover:shadow-md"
                    >
                        Coba Sekarang
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="lg:hidden p-2 text-slate-700 hover:text-[#15803d]"
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 p-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200 ">
                    <nav className="flex flex-col space-y-3 container mx-auto md:px-12">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => {
                                    setActiveTab(link.name);
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-sm font-bold py-1.5 transition-colors ${
                                    activeTab === link.name
                                        ? "text-[#15803d]"
                                        : "text-slate-600 hover:text-[#15803d]"
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 container mx-auto md:px-12 ">
                        <Link
                            href="/login"
                            className="w-full text-center bg-[#edf7f2] text-[#15803d] rounded-xl py-2.5 text-xs font-extrabold"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/login"
                            className="w-full text-center bg-[#15803d] text-white rounded-xl py-2.5 text-xs font-extrabold shadow-sm"
                        >
                            Coba Sekarang
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

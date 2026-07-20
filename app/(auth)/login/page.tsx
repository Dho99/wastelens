"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") ?? "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: err } = await signIn.email({
            email,
            password,
            callbackURL: from !== "/" ? from : undefined,
        });

        if (err) {
            setError(err.message ?? "Gagal login.");
            setLoading(false);
            return;
        }

        router.push(from !== "/" ? from : "/");
        router.refresh();
    }

    return (
        <div
            id="home"
            className="relative flex flex-col md:block bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(images/bg.jpg)" }}
        >
            <div className="flex min-h-screen items-center justify-center px-4 bg-white/80 backdrop-blur py-8">
                <div className="w-full max-w-lg space-y-6">
                    <div className="text-center">
                        <h1 className="mt-4 text-xl font-bold text-primary mb-2">
                            WasteLens
                        </h1>
                        <div className="w-14 h-1 bg-primary rounded-full m-auto mb-8" />
                        <p className="text-xl text-neutral-950 mb-2">
                            Lingkungan bersih dimulai dari lingkunganmu
                        </p>
                        <p className="text-neutral-700">
                            Laporkan sampah, pantau penanganannya, dan dapatkan
                            reward atas kontribusimu.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 bg-white p-8 rounded-xl shadow"
                    >
                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-neutral-700 ms-4"
                            >
                                Email
                            </label>
                            <div className="border border-neutral-300 rounded-full group flex items-center px-4 focus-within:border-primary focus-within:ring-1">
                                <Mail size={18} className="text-neutral-500" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full px-2 py-2.5 outline-none"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-neutral-700 ms-4"
                            >
                                Kata Sandi
                            </label>
                            <div className="border border-neutral-300 rounded-full group flex items-center px-4 focus-within:border-primary focus-within:ring-1">
                                <Lock size={18} className="text-neutral-500" />
                                <input
                                    id="password"
                                    type={seePassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-2.5 outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSeePassword(!seePassword)}
                                    className="cursor-pointer"
                                >
                                    {seePassword ? (
                                        <EyeClosed className="text-neutral-500" />
                                    ) : (
                                        <Eye className="text-neutral-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
                            <div className="h-px flex-1 bg-neutral-300" />
                            <span>Atau masuk dengan</span>
                            <div className="h-px flex-1 bg-neutral-300" />
                        </div>

                        <button
                            type="button"
                            disabled={loading}
                            className="w-full rounded-full px-4 py-2.5 text-sm font-semibold cursor-pointer border border-neutral-300 flex items-center justify-center gap-2"
                        >
                            <Image
                                src={"/icon/gugel.svg"}
                                alt="google"
                                width={20}
                                height={20}
                            />
                            {loading ? "Memproses..." : "Google"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-neutral-500">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:text-primary/90"
                        >
                            Daftar
                        </Link>
                    </p>
                    <p className="text-center text-sm text-neutral-500">
                        Pengelola Dinas Lingkungan Hidup?{" "}
                        <Link
                            href="/login/dinas"
                            className="font-semibold text-primary hover:text-primary/90"
                        >
                            Masuk ke Portal DLH
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

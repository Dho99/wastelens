"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { ErrorBoundary } from "@/components/error-boundary";

interface LeaderboardEntry {
  nama: string;
  total_laporan: number;
  total_koin: number;
}

interface UserProfile {
  nama: string;
  email: string;
  saldo_koin: number;
  role: string;
}

function DashboardContent() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, leaderboardRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/leaderboard"),
        ]);

        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile(p);
        }

        if (leaderboardRes.ok) {
          const l = await leaderboardRes.json();
          setLeaderboard(l);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-xl font-bold">
          Halo, {profile?.nama ?? (session?.user as { nama?: string })?.nama ?? "Pengguna"}
        </h1>
        <p className="text-sm text-neutral-500">Selamat datang di WasteLens</p>
      </div>

      {profile && (
        <div className="rounded-xl bg-emerald-600 p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider opacity-80">
            Saldo Koin
          </p>
          <p className="mt-1 text-3xl font-bold">{profile.saldo_koin}</p>
          <p className="mt-0.5 text-xs opacity-80">
            {profile.email}
          </p>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">
          Leaderboard Pelapor Teraktif
        </h2>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-neutral-400">Belum ada data pelapor.</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.nama}
                className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                      i === 0
                        ? "bg-yellow-500"
                        : i === 1
                          ? "bg-neutral-400"
                          : i === 2
                            ? "bg-amber-700"
                            : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{entry.nama}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{entry.total_laporan}</p>
                  <p className="text-xs text-neutral-400">laporan</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

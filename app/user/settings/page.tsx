"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface UserProfile {
  nama: string;
  email: string;
  saldo_koin: number;
  role: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4"><div className="h-32 animate-pulse rounded-xl bg-neutral-100" /></div>;
  }

  const user = profile ?? session?.user;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-bold">Informasi Profil</h2>

      <div className="space-y-3 rounded-xl border bg-white p-4">
        <div>
          <p className="text-xs text-neutral-500">Nama</p>
          <p className="font-medium">{(user as { nama?: string })?.nama ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Email</p>
          <p className="font-medium">{user?.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Role</p>
          <p className="font-medium capitalize">{(user as { role?: string })?.role ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Total Koin</p>
          <p className="text-2xl font-bold text-emerald-600">
            {profile?.saldo_koin ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="text-sm font-semibold text-neutral-700">Tentang WasteLens</h3>
        <p className="mt-1 text-xs text-neutral-500">
          WasteLens membantu Anda melaporkan tumpukan sampah dan menukarkan koin reward
          di kopdes terdekat.
        </p>
      </div>
    </div>
  );
}

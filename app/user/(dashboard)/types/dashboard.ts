export interface UserProfile {
    name: string;
    greeting: string;
    coins: number;
    avatarUrl: string;
}

export interface ContributionStats {
    sent: number;
    completed: number;
    processed: number;
    needsReview: number;
}

export interface RecentActivity {
    id: string;
    location: string;
    time: string;
    status: "SELESAI" | "DIPROSES" | "PERLU_DIPERIKSA";
    points?: number;
    imageUrl: string;
}

export interface EnvironmentHero {
    rank: number;
    name: string;
    avatarUrl: string;
    isTop?: boolean;
    totalCoins?: number;
}

export interface NearestPartner {
    id: string;
    name: string;
    distance: string;
    description: string;
    imageUrl: string;
}

export interface DashboardData {
    user: UserProfile;
    stats: ContributionStats;
    activities: RecentActivity[];
    heroes: EnvironmentHero[];
    partners: NearestPartner[];
}

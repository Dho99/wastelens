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
  status: 'SELESAI' | 'DIPROSES' | 'PERLU_DIPERIKSA';
  points?: number;
  imageUrl: string;
}

export interface EnvironmentHero {
  rank: number;
  name: string;
  avatarUrl: string;
  isTop?: boolean;
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

export const getDashboardDummyData = (): DashboardData => {
  return {
    user: {
      name: "Raka",
      greeting: "Selamat pagi,",
      coins: 1250,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" // Placeholder Raka
    },
    stats: {
      sent: 12,
      completed: 8,
      processed: 3,
      needsReview: 1
    },
    activities: [
      {
        id: "act-1",
        location: "Kawasan Sudirman",
        time: "2 jam yang lalu",
        status: "SELESAI",
        points: 50,
        imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=300&auto=format&fit=crop&q=80" // trash photo
      },
      {
        id: "act-2",
        location: "Taman Cibeunying",
        time: "1 hari yang lalu",
        status: "DIPROSES",
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&auto=format&fit=crop&q=80" // trash bins
      }
    ],
    heroes: [
      {
        rank: 1,
        name: "Andi",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        isTop: true
      },
      {
        rank: 2,
        name: "Sari",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
      },
      {
        rank: 3,
        name: "Dewi",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
      }
    ],
    partners: [
      {
        id: "part-1",
        name: "IndoFresh Mart - Tebet",
        distance: "450m dari Anda",
        description: "Terima botol plastik & kertas",
        imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80" // Convenience store
      }
    ]
  };
};

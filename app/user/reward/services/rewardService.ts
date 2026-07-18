export interface RewardPartner {
  id: string;
  name: string;
  distance: string;
  rewardCount: number;
  isOpen: boolean;
  type: 'STORE' | 'COFFEE';
}

export interface RedemptionRecord {
  id: string;
  title: string;
  dateText: string;
  status: 'BERHASIL' | 'PROSES' | 'GAGAL';
  coinsSpent: number;
  imageUrl: string;
}

export interface RewardData {
  coins: number;
  growthThisWeek: number;
  partners: RewardPartner[];
  history: RedemptionRecord[];
}

export const getRewardDummyData = (): RewardData => {
  return {
    coins: 1250,
    growthThisWeek: 250,
    partners: [
      {
        id: "part-1",
        name: "IndoFresh Mart",
        distance: "450m",
        rewardCount: 12,
        isOpen: true,
        type: "STORE"
      },
      {
        id: "part-2",
        name: "Kopi Kita",
        distance: "500m",
        rewardCount: 8,
        isOpen: true,
        type: "COFFEE"
      }
    ],
    history: [
      {
        id: "red-1",
        title: "Minyak Goreng 1L",
        dateText: "12 Mei, 14:30",
        status: "BERHASIL",
        coinsSpent: 2500,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=80" // bottle oil thumbnail
      },
      {
        id: "red-2",
        title: "Voucher Rp10.000",
        dateText: "10 Mei, 09:15",
        status: "BERHASIL",
        coinsSpent: 1000,
        imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80" // grab/voucher logo mock
      }
    ]
  };
};

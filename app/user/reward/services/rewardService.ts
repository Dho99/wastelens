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



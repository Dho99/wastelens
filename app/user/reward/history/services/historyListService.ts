export interface HistoryRedeemItem {
  id: string;
  title: string;
  status: 'BERHASIL' | 'KADALUARSA' | 'PROSES';
  merchantName: string;
  merchantType: 'STORE' | 'COFFEE' | 'PUBLIC' | 'PARTNER';
  timestampText: string;
  coinsSpent: number;
  imageUrl?: string;
}

export interface HistoryGroup {
  monthYear: string;
  items: HistoryRedeemItem[];
}

export const getHistoryListDummyData = (): HistoryGroup[] => {
  return [
    {
      monthYear: "Mei 2024",
      items: [
        {
          id: "hist-1",
          title: "Minyak Goreng 1L",
          status: "BERHASIL",
          merchantName: "IndoFresh Mart",
          merchantType: "STORE",
          timestampText: "12 Mei 2024 • 14:20",
          coinsSpent: 800,
          imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=80"
        },
        {
          id: "hist-2",
          title: "Voucher Rp10.000",
          status: "BERHASIL",
          merchantName: "WasteLens Partner",
          merchantType: "PARTNER",
          timestampText: "05 Mei 2024 • 09:15",
          coinsSpent: 1200
        }
      ]
    },
    {
      monthYear: "April 2024",
      items: [
        {
          id: "hist-3",
          title: "Telur Ayam",
          status: "KADALUARSA",
          merchantName: "IndoFresh Mart",
          merchantType: "STORE",
          timestampText: "28 April 2024 • 18:45",
          coinsSpent: 1500,
          imageUrl: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=150&auto=format&fit=crop&q=80" // eggs pack
        },
        {
          id: "hist-4",
          title: "Diskon PLN Rp50.000",
          status: "BERHASIL",
          merchantName: "Layanan Publik",
          merchantType: "PUBLIC",
          timestampText: "15 April 2024 • 11:30",
          coinsSpent: 2000,
          imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=150&auto=format&fit=crop&q=80" // electrical/lightbulb
        }
      ]
    }
  ];
};

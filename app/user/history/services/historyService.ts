export interface HistoryReport {
  id: string;
  location: string;
  date: string;
  time: string;
  status: 'SELESAI' | 'PROSES' | 'PERLU_DIPERIKSA';
  points?: number;
  message?: string;
}

export interface HistoryStats {
  totalReports: number;
  totalCoins: number;
}

export const getHistoryDummyData = (): { stats: HistoryStats; reports: HistoryReport[] } => {
  return {
    stats: {
      totalReports: 23,
      totalCoins: 1250,
    },
    reports: [
      {
        id: "rep-1",
        location: "Kawasan Sudirman",
        date: "12 Okt 2023",
        time: "14:20",
        status: "SELESAI",
        points: 50,
      },
      {
        id: "rep-2",
        location: "Pasar Senen",
        date: "11 Okt 2023",
        time: "09:15",
        status: "PROSES",
        message: "Menunggu Verifikasi",
      },
      {
        id: "rep-3",
        location: "Taman Menteng",
        date: "10 Okt 2023",
        time: "16:45",
        status: "PERLU_DIPERIKSA",
        message: "Butuh Detail Foto",
      },
      {
        id: "rep-4",
        location: "Kuningan City",
        date: "08 Okt 2023",
        time: "11:30",
        status: "SELESAI",
        points: 100,
      },
    ],
  };
};

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  iconType: 'ALERT' | 'INFO' | 'GIFT';
}

export interface HelpDetails {
  topics: HelpTopic[];
  whatsappHours: string;
  emailResponseTime: string;
  footerQuote: string;
}

export const getHelpDummyData = (): HelpDetails => {
  return {
    topics: [
      {
        id: "top-1",
        title: "Laporan Masalah",
        description: "Kendala teknis atau sampah yang belum terangkut",
        iconType: "ALERT"
      },
      {
        id: "top-2",
        title: "Cara Kerja WasteLens",
        description: "Panduan lengkap fitur dan penggunaan aplikasi",
        iconType: "INFO"
      },
      {
        id: "top-3",
        title: "Poin & Hadiah",
        description: "Cara menukarkan koin keberlanjutan Anda",
        iconType: "GIFT"
      }
    ],
    whatsappHours: "24 Jam",
    emailResponseTime: "Balas < 4 Jam",
    footerQuote: "Kami di sini untuk membantu Anda menciptakan dunia yang lebih bersih, satu sampah dalam satu waktu."
  };
};

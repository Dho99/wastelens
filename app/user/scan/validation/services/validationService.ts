export interface ValidationStep {
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'PROSES' | 'DONE';
  statusLabel?: string;
}

export const getInitialValidationSteps = (): ValidationStep[] => {
  return [
    {
      id: 1,
      title: "Memeriksa kualitas foto",
      description: "Foto terdeteksi jernih dan memenuhi syarat.",
      status: "DONE"
    },
    {
      id: 2,
      title: "Mendeteksi objek sampah",
      description: "Mengidentifikasi jenis dan volume limbah...",
      status: "PROSES",
      statusLabel: "Proses"
    },
    {
      id: 3,
      title: "Memeriksa informasi lokasi",
      description: "Menunggu verifikasi koordinat GPS.",
      status: "PENDING"
    }
  ];
};

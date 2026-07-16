export interface TipItem {
  id: number;
  title: string;
  description: string;
  iconType: 'SUN' | 'FOCUS';
}

export const getFallbackTipsDummyData = (): TipItem[] => {
  return [
    {
      id: 1,
      title: "Cahaya Cukup",
      description: "Hindari memotret di tempat gelap atau membelakangi cahaya.",
      iconType: "SUN"
    },
    {
      id: 2,
      title: "Fokus Objek",
      description: "Pastikan objek sampah berada di tengah bingkai kamera.",
      iconType: "FOCUS"
    }
  ];
};

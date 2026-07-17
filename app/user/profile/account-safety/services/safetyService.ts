export interface SafetyDetails {
  lastPasswordChangeText: string;
  twoFactorEnabled: boolean;
  activeDevicesCount: number;
}

export const getSafetyDummyData = (): SafetyDetails => {
  return {
    lastPasswordChangeText: "Terakhir diubah 3 bulan lalu",
    twoFactorEnabled: true,
    activeDevicesCount: 2
  };
};

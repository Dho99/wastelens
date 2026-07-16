export interface UserProfileData {
  name: string;
  ecoRole: string;
  totalPointsXP: number;
  rankIndex: number;
  rankCity: string;
  profileImageUrl: string;
  appVersion: string;
}

export const getUserProfileDummyData = (): UserProfileData => {
  return {
    name: "Ahmad Hidayat",
    ecoRole: "PAHLAWAN LINGKUNGAN",
    totalPointsXP: 1250,
    rankIndex: 12,
    rankCity: "Jakarta",
    profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", // user portrait
    appVersion: "Versi Aplikasi 2.4.0 (Build 108)"
  };
};

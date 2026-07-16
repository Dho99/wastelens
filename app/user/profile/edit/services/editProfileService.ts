export interface EditProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profileImageUrl: string;
  membershipLevel: string;
}

export const getEditProfileDummyData = (): EditProfileFormData => {
  return {
    fullName: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Hijau Lestari No. 12, Kebayoran Baru, Jakarta Selatan, 12150",
    profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", // budi portrait
    membershipLevel: "Pahlawan Lingkungan Lv. 3"
  };
};

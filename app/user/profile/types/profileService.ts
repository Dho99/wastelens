export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    nama: string;
    saldo_koin: number;
    status: string;
    role: string;
    isBanned: boolean;
    phoneNumber?: string;
    address?: string;
}

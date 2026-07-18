export interface Foto {
    url: string;
}

export interface LaporanItem {
    id: string;
    foto_url: string;
    lokasi_lat: number;
    lokasi_lng: number;
    kategori_ukuran: string;
    rekomendasi_kendaraan: string | null;
    status: string;
    createdAt: string;
    foto: Foto[];
}

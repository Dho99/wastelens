export interface Foto {
    url: string;
}

export interface LaporanItem {
    id: string;
    user_id: string;
    dinas_id?: string;
    petugas_id?: string;
    kendaraan_id?: string;
    foto_url: string;
    lokasi_lat: number;
    lokasi_lng: number;
    kategori_ukuran: string;
    rekomendasi_kendaraan: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    lokasi_accuracy?: number;
    lokasi_confirmed_lat?: number;
    lokasi_confirmed_lng?: number;
    lokasi_device_lat?: number;
    lokasi_device_lng?: number;
    lokasi_captured_at?: string;
    lokasi_exif_lat?: number;
    lokasi_exif_lng?: number;
    risk_flags: string[];
    address_text?: string;
    road_name?: string;
    district?: string;
    city?: string;
    province?: string;
    country?: string;
    photo_hash?: string;
    photo_mime_type?: string;
    photo_size_bytes?: number;
    waste_types: string[];
    drainage_risk?: boolean;
    access_obstruction_risk?: boolean;
    visual_indicators: string[];
    confidence?: number;
    needs_manual_review?: boolean;
    analysis_provider?: string;
    analysed_at?: string;
    priority_score?: number;
    priority_level?: string;
    priority_weight_version?: string;
    client_request_id?: string;
    estimated_load_unit?: number;
    foto: Foto[];
    transaksi_koin?: { jumlah: number }[];
}

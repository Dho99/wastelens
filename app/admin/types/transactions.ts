import type { Pagination, ListResult } from "./users";

export type Redemption = {
  id: string;
  user: { id: string; nama: string; email?: string };
  produk: { id: string; nama_barang: string; kopdes: { nama: string } };
  jumlah_koin: number;
  status: string;
  redeemed_at: string | null;
  createdAt: string;
};

export type CoinTx = {
  id: string;
  user: { id: string; nama: string; email?: string };
  laporan: { id: string };
  jumlah: number;
  jenis: string;
};

export type RedemptionList = ListResult<Redemption>;
export type CoinTxList = ListResult<CoinTx>;
export type { Pagination };

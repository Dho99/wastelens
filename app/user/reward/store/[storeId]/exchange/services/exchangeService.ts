export interface ExchangeTransaction {
  productId: string;
  productName: string;
  productImageUrl: string;
  isAvailable: boolean;
  stock: number;
  userBalance: number;
  productPrice: number;
  merchantName: string;
  method: string;
}

export async function fetchProductDetail(
  storeId: string,
  productId: string,
): Promise<ExchangeTransaction> {
  const res = await fetch(`/api/kopdes/${storeId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal memuat detail produk");
  }

  const json = await res.json();
  const store = json.data;
  const product = store.products.find((p: { id: string }) => p.id === productId);

  if (!product) {
    throw new Error("Produk tidak ditemukan");
  }

  const userRes = await fetch(`/api/user/profile`, {
    headers: { "Content-Type": "application/json" },
  });

  let userBalance = 0;
  if (userRes.ok) {
    const userJson = await userRes.json();
    userBalance = userJson.data?.saldo_koin ?? 0;
  }

  return {
    productId: product.id,
    productName: product.name,
    productImageUrl: product.imageUrl,
    isAvailable: product.stock > 0 && product.isActive,
    stock: product.stock,
    userBalance,
    productPrice: product.coinsPrice,
    merchantName: store.name,
    method: "Ambil di Tempat",
  };
}

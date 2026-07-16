export interface ProductItem {
  id: string;
  name: string;
  category: 'SEMBAKO' | 'KEBERSIHAN' | 'LAINNYA';
  coinsPrice: number;
  imageUrl: string;
}

export interface StoreDetail {
  id: string;
  name: string;
  rating: number;
  isOpen: boolean;
  address: string;
  coverImageUrl: string;
  products: ProductItem[];
}

export const getStoreDetailDummyData = (storeId: string): StoreDetail => {
  return {
    id: storeId || "part-1",
    name: "IndoFresh Mart",
    rating: 4.8,
    isOpen: true,
    address: "Jl. Merdeka No. 12",
    coverImageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80", // grocery interior
    products: [
      {
        id: "prod-1",
        name: "Minyak Goreng 1L",
        category: "SEMBAKO",
        coinsPrice: 800,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80" // olive oil bottle
      },
      {
        id: "prod-2",
        name: "Gula Pasir 1kg",
        category: "SEMBAKO",
        coinsPrice: 500,
        imageUrl: "https://images.unsplash.com/photo-1581600140682-d4e68c8c5088?w=300&auto=format&fit=crop&q=80" // brown/white sugar bag
      },
      {
        id: "prod-3",
        name: "Sabun Cuci Piring",
        category: "KEBERSIHAN",
        coinsPrice: 300,
        imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80" // dish soap pump bottle
      }
    ]
  };
};

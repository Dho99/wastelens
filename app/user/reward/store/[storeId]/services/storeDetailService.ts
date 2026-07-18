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



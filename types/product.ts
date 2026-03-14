export type MetalType = 'Gold' | 'Silver' | 'Diamond' | 'Platinum';
export type KaratType = '22K' | '18K' | '14K' | '925' | 'N/A';
export type JewelryCategory =
  | 'Rings'
  | 'Necklaces'
  | 'Earrings'
  | 'Bracelets'
  | 'Bangles'
  | 'Pendants'
  | 'Chains';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: JewelryCategory;
  metalType: MetalType;
  karat: KaratType;
  weightGrams: number;
  price: number;
  makingCharges: number;
  gst: number;
  totalPrice: number;
  images: string[];
  has360View: boolean;
  hasARModel: boolean;
  glbModelUrl?: string;
  usdzModelUrl?: string;
  hallmark: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  similarProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: JewelryCategory;
  metalType?: MetalType;
  karat?: KaratType;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  inStock?: boolean;
}

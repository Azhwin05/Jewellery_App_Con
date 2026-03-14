import { api } from './api';
import type { Product, ProductFilters } from '../types/product';

// Mock products for development
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Gold Bangles Set',
    description: 'Elegant 22K gold bangles, perfect for everyday wear.',
    category: 'Bangles',
    metalType: 'Gold',
    karat: '22K',
    weightGrams: 12.4,
    price: 77480,
    makingCharges: 7748,
    gst: 2557,
    totalPrice: 87785,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
      'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400',
    ],
    has360View: false,
    hasARModel: false,
    hallmark: 'BIS 916',
    inStock: true,
    isNew: true,
    isFeatured: true,
    tags: ['bangles', 'gold', '22k'],
    similarProductIds: ['2', '3'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Diamond Solitaire Ring',
    description: 'Brilliant-cut diamond in 18K white gold setting.',
    category: 'Rings',
    metalType: 'Diamond',
    karat: '18K',
    weightGrams: 3.2,
    price: 45000,
    makingCharges: 4500,
    gst: 1485,
    totalPrice: 50985,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    ],
    has360View: true,
    hasARModel: true,
    glbModelUrl: 'https://example.com/ring.glb',
    usdzModelUrl: 'https://example.com/ring.usdz',
    hallmark: 'BIS 750',
    inStock: true,
    isNew: false,
    isFeatured: true,
    tags: ['ring', 'diamond', '18k'],
    similarProductIds: ['1', '3'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Silver Oxidised Necklace',
    description: 'Handcrafted oxidised silver necklace with floral motifs.',
    category: 'Necklaces',
    metalType: 'Silver',
    karat: '925',
    weightGrams: 18.6,
    price: 4250,
    makingCharges: 850,
    gst: 153,
    totalPrice: 5253,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    ],
    has360View: false,
    hasARModel: true,
    glbModelUrl: 'https://example.com/necklace.glb',
    usdzModelUrl: 'https://example.com/necklace.usdz',
    hallmark: '925',
    inStock: true,
    isNew: true,
    isFeatured: false,
    tags: ['necklace', 'silver', 'oxidised'],
    similarProductIds: ['1', '2'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Gold Jhumka Earrings',
    description: 'Traditional 22K gold jhumka with intricate filigree work.',
    category: 'Earrings',
    metalType: 'Gold',
    karat: '22K',
    weightGrams: 6.8,
    price: 42500,
    makingCharges: 4250,
    gst: 1402,
    totalPrice: 48152,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    ],
    has360View: false,
    hasARModel: true,
    glbModelUrl: 'https://example.com/earring.glb',
    usdzModelUrl: 'https://example.com/earring.usdz',
    hallmark: 'BIS 916',
    inStock: true,
    isNew: false,
    isFeatured: true,
    tags: ['earrings', 'jhumka', '22k'],
    similarProductIds: ['2', '3'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Platinum Wedding Band',
    description: 'Classic 950 platinum comfort-fit wedding band.',
    category: 'Rings',
    metalType: 'Platinum',
    karat: 'N/A',
    weightGrams: 8.0,
    price: 38000,
    makingCharges: 3800,
    gst: 1254,
    totalPrice: 43054,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
    ],
    has360View: false,
    hasARModel: false,
    hallmark: 'PT 950',
    inStock: true,
    isNew: false,
    isFeatured: false,
    tags: ['ring', 'platinum', 'wedding'],
    similarProductIds: ['2'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Gold Chain Bracelet',
    description: 'Delicate 18K gold link chain bracelet.',
    category: 'Bracelets',
    metalType: 'Gold',
    karat: '18K',
    weightGrams: 4.5,
    price: 23000,
    makingCharges: 2300,
    gst: 759,
    totalPrice: 26059,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400',
    ],
    has360View: false,
    hasARModel: false,
    hallmark: 'BIS 750',
    inStock: true,
    isNew: false,
    isFeatured: false,
    tags: ['bracelet', 'gold', '18k'],
    similarProductIds: ['1', '3'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 600));
      return MOCK_PRODUCTS;
    }
    const { data } = await api.get('/products', { params: filters });
    return data;
  },

  async getProductById(id: string): Promise<Product> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 300));
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  async getFeatured(): Promise<Product[]> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_PRODUCTS.filter((p) => p.isFeatured);
    }
    const { data } = await api.get('/products/featured');
    return data;
  },

  async getSimilar(productId: string): Promise<Product[]> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 300));
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) return [];
      return MOCK_PRODUCTS.filter((p) =>
        product.similarProductIds.includes(p.id),
      );
    }
    const { data } = await api.get(`/products/${productId}/similar`);
    return data;
  },
};

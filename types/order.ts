export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'net_banking'
  | 'emi'
  | 'cod';

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  karat: string;
  weightGrams: number;
  quantity: number;
  priceAtOrder: number;
  makingCharges: number;
  gst: number;
  totalPrice: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  message: string;
  location?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  subtotal: number;
  makingCharges: number;
  gst: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  estimatedDelivery: string;
  deliverySlot?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

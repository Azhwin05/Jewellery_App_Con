import { api } from './api';
import type { Order } from '../types/order';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 600));
      return [];
    }
    const { data } = await api.get('/orders');
    return data;
  },

  async getOrderById(id: string): Promise<Order> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 400));
      throw new Error('Order not found');
    }
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  async createOrder(payload: Partial<Order>): Promise<Order> {
    if (__DEV__) {
      await new Promise((r) => setTimeout(r, 1000));
      const mockOrder: Order = {
        id: `ORD-${Date.now()}`,
        userId: 'mock-user-1',
        items: payload.items ?? [],
        shippingAddress: payload.shippingAddress!,
        paymentMethod: payload.paymentMethod ?? 'upi',
        subtotal: payload.subtotal ?? 0,
        makingCharges: payload.makingCharges ?? 0,
        gst: payload.gst ?? 0,
        discount: payload.discount ?? 0,
        total: payload.total ?? 0,
        status: 'confirmed',
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            message: 'Your order has been confirmed.',
          },
        ],
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockOrder;
    }
    const { data } = await api.post('/orders', payload);
    return data;
  },
};

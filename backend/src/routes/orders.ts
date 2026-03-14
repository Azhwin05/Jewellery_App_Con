import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All order routes require authentication
router.use(requireAuth);

// GET /orders
router.get('/', async (req: AuthRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: {
      items: true,
      statusEvents: { orderBy: { timestamp: 'asc' } },
      shippingAddress: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

// GET /orders/:id
router.get('/:id', async (req: AuthRequest, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: {
      items: true,
      statusEvents: { orderBy: { timestamp: 'asc' } },
      shippingAddress: true,
    },
  });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

// POST /orders
router.post('/', async (req: AuthRequest, res) => {
  const itemSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    productImage: z.string(),
    karat: z.string(),
    weightGrams: z.number(),
    quantity: z.number().int().min(1),
    priceAtOrder: z.number(),
    makingCharges: z.number(),
    gst: z.number(),
    totalPrice: z.number(),
  });

  const schema = z.object({
    items: z.array(itemSchema).min(1),
    shippingAddressId: z.string(),
    paymentMethod: z.enum(['upi', 'card', 'net_banking', 'emi', 'cod']),
    paymentId: z.string().optional(),
    subtotal: z.number(),
    makingCharges: z.number(),
    gst: z.number(),
    discount: z.number().default(0),
    total: z.number(),
    couponCode: z.string().optional(),
    deliverySlot: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid order data', details: parsed.error });
    return;
  }

  const { items, ...rest } = parsed.data;
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const order = await prisma.order.create({
    data: {
      userId: req.userId!,
      ...rest,
      estimatedDelivery,
      status: 'confirmed',
      items: { create: items },
      statusEvents: {
        create: {
          status: 'confirmed',
          message: 'Your order has been confirmed.',
        },
      },
    },
    include: {
      items: true,
      statusEvents: true,
      shippingAddress: true,
    },
  });

  res.status(201).json(order);
});

export default router;

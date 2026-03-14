import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /products
router.get('/', async (req, res) => {
  const schema = z.object({
    category: z.string().optional(),
    metalType: z.string().optional(),
    karat: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sortBy: z
      .enum(['price_asc', 'price_desc', 'newest', 'popular'])
      .optional(),
    inStock: z.coerce.boolean().optional(),
  });

  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters' });
    return;
  }

  const { category, metalType, karat, minPrice, maxPrice, sortBy, inStock } =
    parsed.data;

  const products = await prisma.product.findMany({
    where: {
      ...(category && { category }),
      ...(metalType && { metalType }),
      ...(karat && { karat }),
      ...(minPrice !== undefined && { totalPrice: { gte: minPrice } }),
      ...(maxPrice !== undefined && { totalPrice: { lte: maxPrice } }),
      ...(inStock !== undefined && { inStock }),
    },
    orderBy:
      sortBy === 'price_asc'
        ? { totalPrice: 'asc' }
        : sortBy === 'price_desc'
        ? { totalPrice: 'desc' }
        : sortBy === 'newest'
        ? { createdAt: 'desc' }
        : { createdAt: 'desc' },
  });

  res.json(products);
});

// GET /products/featured
router.get('/featured', async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, inStock: true },
    take: 10,
  });
  res.json(products);
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// GET /products/:id/similar
router.get('/:id/similar', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const similar = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      category: product.category,
      inStock: true,
    },
    take: 6,
  });
  res.json(similar);
});

export default router;

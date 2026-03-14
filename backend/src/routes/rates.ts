import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /rates/current — returns cached rates from DB (Redis cache in production)
router.get('/current', async (_req, res) => {
  const metals = ['gold_22k', 'gold_18k', 'silver'];
  const rates = await Promise.all(
    metals.map((metal) =>
      prisma.metalRate.findFirst({
        where: { metal },
        orderBy: { fetchedAt: 'desc' },
      }),
    ),
  );

  if (rates.some((r) => !r)) {
    // Return mock rates if DB is empty
    res.json({
      gold22k: {
        metal: 'gold_22k',
        label: 'Gold 22K / 10g',
        pricePerUnit: 62450,
        unit: '10g',
        changePercent: 0.8,
        changeAmount: 500,
        lastUpdated: new Date().toISOString(),
      },
      gold18k: {
        metal: 'gold_18k',
        label: 'Gold 18K / 10g',
        pricePerUnit: 51100,
        unit: '10g',
        changePercent: 0.8,
        changeAmount: 400,
        lastUpdated: new Date().toISOString(),
      },
      silver: {
        metal: 'silver',
        label: 'Silver / kg',
        pricePerUnit: 78500,
        unit: 'kg',
        changePercent: -0.3,
        changeAmount: -235,
        lastUpdated: new Date().toISOString(),
      },
      lastFetched: new Date().toISOString(),
      isLive: false,
    });
    return;
  }

  res.json({
    gold22k: { ...rates[0], label: 'Gold 22K / 10g', unit: '10g', lastUpdated: rates[0]!.fetchedAt },
    gold18k: { ...rates[1], label: 'Gold 18K / 10g', unit: '10g', lastUpdated: rates[1]!.fetchedAt },
    silver: { ...rates[2], label: 'Silver / kg', unit: 'kg', lastUpdated: rates[2]!.fetchedAt },
    lastFetched: new Date().toISOString(),
    isLive: true,
  });
});

export default router;

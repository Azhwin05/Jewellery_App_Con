import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { ratesWS } from './websocket/ratesWS';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import ratesRoutes from './routes/rates';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT ?? 3000;

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: '10kb' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/rates', ratesRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── WebSocket for live rates ──────────────────────────────────────────────────
ratesWS(httpServer);

// ── Start ────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

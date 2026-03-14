import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';
const OTP_EXPIRY_MIN = 10;

// Strict rate limit for OTP endpoints (prevent abuse)
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Too many OTP requests, please wait.' },
});

// POST /auth/send-otp
router.post('/send-otp', otpLimiter, async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const { email } = parsed.data;

  // Generate 6-digit OTP
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);

  // Invalidate old OTPs for this email
  await prisma.otpCode.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  await prisma.otpCode.create({ data: { email, code, expiresAt } });

  // Send via Firebase Auth / Email provider in production
  // For now, log to console (dev mode)
  console.log(`OTP for ${email}: ${code}`);

  res.json({ message: 'OTP sent successfully' });
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const { email, otp } = parsed.data;

  const record = await prisma.otpCode.findFirst({
    where: {
      email,
      code: otp,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    res.status(401).json({ error: 'Invalid or expired OTP' });
    return;
  }

  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: record.id },
    data: { used: true },
  });

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' },
  );

  res.json({ user, token });
});

// PUT /auth/profile
router.put('/profile', async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    fullName: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
    preferences: z.array(z.string()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const { userId, ...data } = parsed.data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { ...data, isProfileComplete: true },
  });

  res.json(user);
});

// POST /auth/logout
router.post('/logout', (_req, res) => {
  // Stateless JWT — client just discards the token.
  // In production, maintain a token denylist in Redis.
  res.json({ message: 'Logged out' });
});

export default router;

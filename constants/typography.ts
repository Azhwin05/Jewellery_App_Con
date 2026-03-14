/**
 * Luxury Typography System — Jewels App
 *
 * Serif  → Playfair Display  — Display, Headline, Title (emotional, premium)
 * System → San Francisco/Roboto — Body, Label, Price, Data (legible, neutral)
 *
 * Usage rule: If it tells a story → Serif.
 *             If it gives information → System.
 */
import { Platform, StyleSheet } from 'react-native';
import { Colors } from './colors';

const serif  = 'PlayfairDisplay_600SemiBold';
const serifB = 'PlayfairDisplay_700Bold';
const sans   = Platform.OS === 'ios' ? 'System' : 'Roboto';

export const Typography = StyleSheet.create({
  // ── Display (hero price, splash) ─────────────────────────────────────────
  displayLarge: {
    fontFamily: serifB,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.3,
    color: Colors.textPrimary,
  },

  // ── Headlines (page titles, product name) ─────────────────────────────────
  headlineLarge: {
    fontFamily: serifB,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.3,
    color: Colors.textPrimary,
  },
  headlineMedium: {
    fontFamily: serif,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
    color: Colors.textPrimary,
  },

  // ── Titles (section headers, card names) ──────────────────────────────────
  titleLarge: {
    fontFamily: serif,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.2,
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontFamily: serif,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.15,
    color: Colors.textPrimary,
  },

  // ── Body (descriptions, content) — System font for readability ───────────
  bodyLarge: {
    fontFamily: sans,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: sans,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.textSecondary,
  },

  // ── Labels (tabs, chips, tags) — System, tight ────────────────────────────
  labelLarge: {
    fontFamily: sans,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  labelMedium: {
    fontFamily: sans,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontFamily: sans,
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: 0.3,
  },
});

/** Serif helpers for inline use (not StyleSheet) */
export const SerifFonts = { serif, serifB, sans };

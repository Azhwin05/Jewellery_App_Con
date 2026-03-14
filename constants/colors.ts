/**
 * Luxury Color System — Jewels App
 * Philosophy: Deep Ink + Warm White + Royal Purple + Heritage Gold
 */
export const Colors = {
  // Brand purple — FAB, active tabs, primary CTAs ONLY
  primary:       '#5C40C9',
  primaryDeep:   '#4A32AA',
  primaryTint:   '#F0EEFF',

  // Heritage gold — gradient tokens
  gold:          '#C9A84C',
  goldLight:     '#D4AF37',
  goldDark:      '#AA771C',

  // Backgrounds
  background:    '#FAFAFC',
  surface:       '#FFFFFF',
  imageBg:       '#F8F8FA',

  // Ink
  textPrimary:   '#1A1A2E',
  textSecondary: '#8E8E93',
  textMuted:     '#AEAEB2',
  textOnPrimary: '#FFFFFF',
  textOnGold:    '#1A1A2E',

  // Borders
  border:        '#E5E5EA',
  borderLight:   '#F2F2F7',

  // Semantic
  success:       '#34C759',
  successBg:     'rgba(52,199,89,0.10)',
  error:         '#FF3B30',
  errorBg:       'rgba(255,59,48,0.10)',
  warning:       '#FF9500',
  warningBg:     'rgba(255,149,0,0.10)',

  // Tags
  tagNew:        '#1A1A2E',
} as const;

export type ColorKey = keyof typeof Colors;

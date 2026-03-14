/**
 * LiveRateWidget — Luxury Premium Financial Ticker
 *
 * Changes:
 *  - Serif "Live Market Rates" header
 *  - Reanimated infinite pulsing green dot
 *  - Clean 2-row rate display with iOS hairline dividers
 *  - Soft pill trend indicators (no harsh borders)
 *  - Ambient shadow (not flat card)
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SkeletonRateWidget } from '../ui/SkeletonLoader';
import { Colors } from '../../constants/colors';
import { SerifFonts } from '../../constants/typography';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { useRatesStore } from '../../store/ratesStore';
import { formatCurrency } from '../../utils/formatCurrency';
import type { MetalRate } from '../../types/rates';

// ── Pulsing live dot ─────────────────────────────────────────────────────────
function PulseDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, // infinite
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, style]} />;
}

// ── Single rate row ───────────────────────────────────────────────────────────
function RateItem({ rate }: { rate: MetalRate }) {
  const isUp = rate.changePercent >= 0;
  const trendBg  = isUp ? Colors.successBg  : Colors.errorBg;
  const trendClr = isUp ? Colors.success    : Colors.error;
  const sign     = isUp ? '+' : '';

  return (
    <View style={styles.rateRow}>
      {/* Metal name */}
      <Text style={styles.rateName}>{rate.label}</Text>

      {/* Price — bold, legible */}
      <Text style={styles.ratePrice}>
        {formatCurrency(rate.pricePerUnit)}
        <Text style={styles.rateUnit}> /g</Text>
      </Text>

      {/* Trend pill — no border, just soft bg */}
      <View style={[styles.trendPill, { backgroundColor: trendBg }]}>
        <Text style={[styles.trendText, { color: trendClr }]}>
          {sign}{rate.changePercent.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export const LiveRateWidget = React.memo(function LiveRateWidget() {
  const rates    = useRatesStore((s) => s.rates);
  const isLoading = useRatesStore((s) => s.isLoading);

  if (isLoading || !rates) {
    return (
      <View style={styles.card}>
        <SkeletonRateWidget />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PulseDot />
          <Text style={styles.headerTitle}>LIVE MARKET RATES</Text>
        </View>
        <Text style={styles.perGram}>Per gram · Inclusive of GST</Text>
      </View>

      {/* Hairline divider */}
      <View style={styles.hairline} />

      {/* Gold 22K */}
      <RateItem rate={rates.gold22k} />

      <View style={styles.hairline} />

      {/* Silver */}
      <RateItem rate={rates.silver} />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: Spacing.base,
    marginTop: 0,
    ...Shadows.card,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.success,
  },
  headerTitle: {
    fontFamily: SerifFonts.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  perGram: {
    fontFamily: SerifFonts.sans,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },

  // Hairline — iOS 0.5pt separator
  hairline: {
    height: 0.5,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },

  // Rate row
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  rateName: {
    fontFamily: SerifFonts.serif,
    fontSize: 14,
    letterSpacing: 0.1,
    color: Colors.textPrimary,
    flex: 1,
  },
  ratePrice: {
    fontFamily: SerifFonts.sans,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rateUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },

  // Trend pill — no border, soft background
  trendPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  trendText: {
    fontFamily: SerifFonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
});

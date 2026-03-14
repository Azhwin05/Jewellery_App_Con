/**
 * Premium Skeleton Loaders
 * - Pulse: opacity 0.4 → 1.0 over 1000ms (no harsh color flicker)
 * - Base color: #F4F4F8 (matches app off-white background family)
 * - SkeletonCard mirrors ProductCard's 4:5 image ratio
 * - ProductDetailSkeleton mirrors the overlap-card layout
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

const PULSE_MIN = 0.4;
const PULSE_MAX = 1.0;
const PULSE_DURATION = 1000;

// ── Shared pulse hook ─────────────────────────────────────────────────────────
function usePulse() {
  const opacity = useRef(new Animated.Value(PULSE_MAX)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MIN,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: PULSE_MAX,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return opacity;
}

// ── Base bone ─────────────────────────────────────────────────────────────────
interface BoneProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  opacity: Animated.Value;
}

function Bone({ width = '100%', height = 16, borderRadius = 8, style, opacity }: BoneProps) {
  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#F4F4F8',
          opacity,
        },
        style,
      ]}
    />
  );
}

// ── Public: generic loader (used by legacy callers) ───────────────────────────
interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader = React.memo(function SkeletonLoader(props: SkeletonLoaderProps) {
  const opacity = usePulse();
  return <Bone {...props} opacity={opacity} />;
});

// ── ProductCard skeleton ──────────────────────────────────────────────────────
export function SkeletonCard() {
  const opacity = usePulse();
  return (
    <View style={styles.card}>
      {/* Image area — 4:5 aspect ratio matching ProductCard */}
      <Bone height={undefined} style={styles.cardImage} opacity={opacity} borderRadius={0} />
      <View style={styles.cardBody}>
        <Bone height={14} width="72%" borderRadius={4} opacity={opacity} />
        <Bone height={11} width="42%" borderRadius={4} opacity={opacity} style={{ marginTop: 6 }} />
        <Bone height={15} width="56%" borderRadius={4} opacity={opacity} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

// ── ProductDetailScreen skeleton ──────────────────────────────────────────────
export function ProductDetailSkeleton() {
  const opacity = usePulse();
  return (
    <View style={styles.detailWrap}>
      {/* Hero image */}
      <Bone height={380} borderRadius={0} opacity={opacity} />

      {/* Overlapping info card */}
      <View style={styles.detailCard}>
        {/* Name + hallmark row */}
        <View style={styles.detailNameRow}>
          <Bone height={22} width="65%" borderRadius={6} opacity={opacity} />
          <Bone height={22} width="16%" borderRadius={6} opacity={opacity} />
        </View>
        {/* Karat · weight */}
        <Bone height={13} width="35%" borderRadius={4} opacity={opacity} style={{ marginTop: 10 }} />
        {/* Price */}
        <Bone height={28} width="50%" borderRadius={6} opacity={opacity} style={{ marginTop: 14 }} />
        {/* Breakdown link */}
        <Bone height={13} width="40%" borderRadius={4} opacity={opacity} style={{ marginTop: 10 }} />
        {/* Description */}
        <Bone height={13} width="100%" borderRadius={4} opacity={opacity} style={{ marginTop: 20 }} />
        <Bone height={13} width="88%" borderRadius={4} opacity={opacity} style={{ marginTop: 8 }} />
        <Bone height={13} width="72%" borderRadius={4} opacity={opacity} style={{ marginTop: 8 }} />
        {/* AR + Cart buttons */}
        <Bone height={52} borderRadius={12} opacity={opacity} style={{ marginTop: 28 }} />
        <Bone height={52} borderRadius={12} opacity={opacity} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}

// ── Rate widget skeleton (used by LiveRateWidget) ─────────────────────────────
export function SkeletonRateWidget() {
  const opacity = usePulse();
  return (
    <View style={styles.rateWidget}>
      <View style={styles.rateHeader}>
        <Bone height={10} width="38%" borderRadius={4} opacity={opacity} />
        <Bone height={10} width="24%" borderRadius={4} opacity={opacity} />
      </View>
      <View style={styles.rateRow}>
        <Bone height={14} width="28%" borderRadius={4} opacity={opacity} />
        <Bone height={18} width="36%" borderRadius={4} opacity={opacity} />
        <Bone height={22} width="18%" borderRadius={20} opacity={opacity} />
      </View>
      <View style={[styles.rateRow, { marginTop: 2 }]}>
        <Bone height={14} width="28%" borderRadius={4} opacity={opacity} />
        <Bone height={18} width="36%" borderRadius={4} opacity={opacity} />
        <Bone height={22} width="18%" borderRadius={20} opacity={opacity} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // SkeletonCard
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    aspectRatio: 4 / 5,
    width: '100%',
  },
  cardBody: {
    padding: 12,
    gap: 0,
  },

  // ProductDetailSkeleton
  detailWrap: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  detailNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  // SkeletonRateWidget
  rateWidget: {
    gap: 4,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});

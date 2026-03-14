// RateRow — kept for backwards compat, delegates to LiveRateWidget internals
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { SerifFonts } from '../../constants/typography';
import { formatCurrency } from '../../utils/formatCurrency';
import type { MetalRate } from '../../types/rates';

interface RateRowProps {
  rate: MetalRate;
}

export const RateRow = React.memo(function RateRow({ rate }: RateRowProps) {
  const isUp     = rate.changePercent >= 0;
  const trendBg  = isUp ? Colors.successBg  : Colors.errorBg;
  const trendClr = isUp ? Colors.success    : Colors.error;
  const sign     = isUp ? '+' : '';

  return (
    <View style={styles.row}>
      <Text style={styles.name}>{rate.label}</Text>
      <Text style={styles.price}>{formatCurrency(rate.pricePerUnit)}</Text>
      <View style={[styles.pill, { backgroundColor: trendBg }]}>
        <Text style={[styles.trend, { color: trendClr }]}>
          {sign}{rate.changePercent.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  name: { fontFamily: SerifFonts.serif, fontSize: 14, letterSpacing: 0.1, color: Colors.textPrimary, flex: 1 },
  price: { fontFamily: SerifFonts.sans, fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, minWidth: 60, alignItems: 'center' },
  trend: { fontFamily: SerifFonts.sans, fontSize: 12, fontWeight: '600' },
});

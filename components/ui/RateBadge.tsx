import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { formatRateChange } from '../../utils/formatRate';

interface RateBadgeProps {
  changePercent: number;
}

export const RateBadge = React.memo(function RateBadge({
  changePercent,
}: RateBadgeProps) {
  const isUp = changePercent >= 0;
  const bg = isUp ? Colors.successBg : Colors.errorBg;
  const color = isUp ? Colors.success : Colors.error;
  const icon = isUp ? 'trending-up' : 'trending-down';

  return (
    <View
      style={[styles.badge, { backgroundColor: bg }]}
      accessibilityLabel={`Rate ${isUp ? 'up' : 'down'} ${formatRateChange(changePercent)}`}
    >
      {/* Icon + text so colour is not the only indicator (accessibility) */}
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[styles.text, { color }]}>
        {formatRateChange(changePercent)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  text: {
    ...Typography.labelMedium,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import type { OrderStatus } from '../../types/order';

const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: '#FEF9C3', text: '#A16207', label: 'Pending' },
  confirmed: { bg: Colors.primaryTint, text: Colors.primary, label: 'Confirmed' },
  processing: { bg: Colors.primaryTint, text: Colors.primary, label: 'Processing' },
  shipped: { bg: '#FEF9C3', text: '#A16207', label: 'Shipped' },
  delivered: { bg: Colors.successBg, text: Colors.success, label: 'Delivered' },
  cancelled: { bg: Colors.errorBg, text: Colors.error, label: 'Cancelled' },
  returned: { bg: '#F3F3F3', text: Colors.textSecondary, label: 'Returned' },
};

interface StatusChipProps {
  status: OrderStatus;
}

export const StatusChip = React.memo(function StatusChip({
  status,
}: StatusChipProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.chip, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.labelMedium,
  },
});

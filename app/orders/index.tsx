import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { StatusChip } from '../../components/ui/StatusChip';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { formatCurrency } from '../../utils/formatCurrency';
import { orderService } from '../../services/orderService';

export default function OrdersScreen() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textOnPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={{ gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <SkeletonLoader height={80} width={80} borderRadius={8} />
                <View style={{ flex: 1, gap: 8 }}>
                  <SkeletonLoader height={14} width="70%" />
                  <SkeletonLoader height={12} width="40%" />
                  <SkeletonLoader height={12} width="50%" />
                </View>
              </View>
            ))}
          </View>
        )}

        {!isLoading && (!orders || orders.length === 0) && (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={80} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your order history will appear here
            </Text>
            <PrimaryButton
              label="Start Shopping"
              onPress={() => router.replace('/(tabs)/shop')}
              style={{ marginTop: 24, paddingHorizontal: 32 }}
            />
          </View>
        )}

        {orders?.map((order) => (
          <Pressable
            key={order.id}
            style={styles.orderCard}
            onPress={() => router.push(`/orders/${order.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Order ${order.id}, status ${order.status}`}
          >
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id}</Text>
              <StatusChip status={order.status} />
            </View>

            {/* Items */}
            {order.items.slice(0, 2).map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <Image
                  source={{ uri: item.productImage }}
                  style={styles.itemThumb}
                  resizeMode="cover"
                  accessibilityLabel={`Image of ${item.productName}`}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.itemSub}>
                    Qty: {item.quantity} · {formatCurrency(item.totalPrice)}
                  </Text>
                </View>
              </View>
            ))}
            {order.items.length > 2 && (
              <Text style={styles.moreItems}>
                +{order.items.length - 2} more items
              </Text>
            )}

            {/* Footer */}
            <View style={styles.orderFooter}>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </Text>
              <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
              <Pressable
                style={styles.trackBtn}
                accessibilityRole="button"
                accessibilityLabel={`Track order ${order.id}`}
              >
                <Text style={styles.trackText}>Track</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { ...Typography.headlineLarge, color: Colors.textOnPrimary },

  content: { padding: Spacing.base, gap: 12, paddingBottom: 40 },

  skeletonCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },

  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: { ...Typography.labelLarge, color: Colors.textSecondary, fontWeight: '600' },

  itemRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  itemThumb: { width: 48, height: 48, borderRadius: 8 },
  itemInfo: { flex: 1 },
  itemName: { ...Typography.titleMedium, color: Colors.textPrimary },
  itemSub: { ...Typography.bodyMedium, color: Colors.textSecondary },
  moreItems: { ...Typography.labelMedium, color: Colors.textSecondary },

  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    gap: 8,
  },
  orderDate: { ...Typography.bodyMedium, color: Colors.textSecondary, flex: 1 },
  orderTotal: { ...Typography.titleMedium, color: Colors.textPrimary, fontWeight: '700' },
  trackBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primaryTint,
    borderRadius: 8,
  },
  trackText: { ...Typography.labelLarge, color: Colors.primary, fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: { ...Typography.headlineMedium, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: {
    ...Typography.bodyMedium, color: Colors.textSecondary, textAlign: 'center',
  },
});

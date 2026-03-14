import { useCallback, useState } from 'react';
import {
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
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';

type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'emi' | 'cod';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'upi', label: 'UPI', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'net_banking', label: 'Net Banking', icon: 'business-outline' },
  { id: 'emi', label: 'EMI', icon: 'calendar-outline' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
];

export default function CheckoutScreen() {
  const { items, subtotal, makingCharges, gst, total, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    setLoading(true);
    try {
      const order = await orderService.createOrder({
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.images[0],
          karat: i.product.karat,
          weightGrams: i.product.weightGrams,
          quantity: i.quantity,
          priceAtOrder: i.product.price,
          makingCharges: i.product.makingCharges,
          gst: i.product.gst,
          totalPrice: i.product.totalPrice,
        })),
        shippingAddress: {
          id: 'addr-1',
          label: 'Home',
          fullName: 'Demo User',
          phone: '9876543210',
          line1: '123 Demo Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
        paymentMethod: selectedPayment,
        subtotal,
        makingCharges,
        gst,
        discount: 0,
        total,
      });
      clearCart();
      router.replace({
        pathname: '/order-confirm',
        params: { orderId: order.id, estimatedDelivery: order.estimatedDelivery },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [items, selectedPayment, subtotal, makingCharges, gst, total, clearCart]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textOnPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.summaryRow}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {item.product.name} ×{item.quantity}
              </Text>
              <Text style={styles.summaryPrice}>
                {formatCurrency(item.product.totalPrice * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Pressable style={styles.addressCard} accessibilityRole="button">
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Home</Text>
              <Text style={styles.addressText}>
                123 Demo Street, Mumbai, Maharashtra 400001
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>

        {/* Payment Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={styles.paymentOption}
              onPress={() => setSelectedPayment(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPayment === option.id }}
              accessibilityLabel={option.label}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={Colors.textPrimary}
              />
              <Text style={styles.paymentLabel}>{option.label}</Text>
              <View
                style={[
                  styles.radio,
                  selectedPayment === option.id && styles.radioActive,
                ]}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Place Order */}
      <SafeAreaView style={styles.stickyBar} edges={['bottom']}>
        <PrimaryButton
          label={`Place Order · ${formatCurrency(total)}`}
          onPress={handlePlaceOrder}
          loading={loading}
          style={styles.placeOrderBtn}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 16,
  },
  headerTitle: { ...Typography.headlineLarge, color: Colors.textOnPrimary },
  content: { padding: Spacing.base, gap: 16, paddingBottom: 120 },

  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: { ...Typography.titleLarge, color: Colors.textPrimary },

  // Order Summary
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryName: { ...Typography.bodyMedium, color: Colors.textPrimary, flex: 1 },
  summaryPrice: { ...Typography.bodyMedium, color: Colors.textPrimary },
  summaryDivider: { height: 1, backgroundColor: Colors.border },
  summaryTotalLabel: { ...Typography.titleMedium, color: Colors.textPrimary, fontWeight: '700' },
  summaryTotalValue: { ...Typography.titleMedium, color: Colors.textPrimary, fontWeight: '700' },

  // Address
  addressCard: {
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  addressContent: { flex: 1 },
  addressLabel: { ...Typography.labelLarge, color: Colors.primary, fontWeight: '600' },
  addressText: { ...Typography.bodyMedium, color: Colors.textSecondary, marginTop: 2 },

  // Payment
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  paymentLabel: { ...Typography.bodyLarge, color: Colors.textPrimary, flex: 1 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.textSecondary,
  },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },

  // Sticky bar
  stickyBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
    padding: Spacing.base,
  },
  placeOrderBtn: {},
});

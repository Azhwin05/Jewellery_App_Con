import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { SerifFonts } from '../constants/typography';
import { Shadows } from '../constants/shadows';
import { Spacing } from '../constants/spacing';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';

export default function CartScreen() {
  const {
    items, subtotal, makingCharges, gst, total,
    couponCode, couponDiscount,
    updateQuantity, removeFromCart, applyCoupon, removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');

  const handleQtyChange = useCallback(
    (productId: string, delta: number, currentQty: number) => {
      const newQty = currentQty + delta;
      if (newQty < 1) {
        Alert.alert(
          'Remove item',
          'Remove this item from your cart?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) },
          ],
        );
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateQuantity(productId, newQty);
    },
    [removeFromCart, updateQuantity],
  );

  const handleApplyCoupon = useCallback(() => {
    if (!couponInput.trim()) return;
    // Mock: any code gives ₹500 off
    applyCoupon(couponInput.toUpperCase(), 500);
    setCouponInput('');
  }, [couponInput, applyCoupon]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.textOnPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          My Cart{items.length > 0 ? ` (${items.length})` : ''}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <EmptyState
            iconName="bag-outline"
            title="Your cart is empty"
            subtitle="Add some beautiful jewelry to get started"
            ctaLabel="Start Shopping"
            onCta={() => router.replace('/(tabs)/shop')}
          />
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Items */}
            {items.map((item) => (
              <View key={item.product.id} style={styles.itemCard}>
                <Image
                  source={{ uri: item.product.images[0] }}
                  style={styles.itemImg}
                  resizeMode="cover"
                  accessibilityLabel={`Image of ${item.product.name}`}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemSub}>
                    {item.product.karat} · {item.product.weightGrams}g
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.product.totalPrice * item.quantity)}
                  </Text>

                  {/* Qty stepper */}
                  <View style={styles.stepper}>
                    <Pressable
                      onPress={() => handleQtyChange(item.product.id, -1, item.quantity)}
                      style={styles.stepBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      <Ionicons name="remove" size={16} color={Colors.primary} />
                    </Pressable>
                    <Text style={styles.stepQty}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => handleQtyChange(item.product.id, 1, item.quantity)}
                      style={styles.stepBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      <Ionicons name="add" size={16} color={Colors.primary} />
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  onPress={() => removeFromCart(item.product.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.product.name}`}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Ionicons name="close-circle-outline" size={22} color={Colors.textSecondary} />
                </Pressable>
              </View>
            ))}

            {/* Coupon */}
            <View style={styles.couponCard}>
              <View style={styles.couponRow}>
                {couponCode ? (
                  <View style={styles.couponApplied}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                    <Text style={styles.couponAppliedText}>
                      {couponCode} — {formatCurrency(couponDiscount)} off
                    </Text>
                    <Pressable onPress={removeCoupon}>
                      <Ionicons name="close" size={18} color={Colors.textSecondary} />
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={styles.couponInput}
                      placeholder="Enter coupon code"
                      placeholderTextColor={Colors.textSecondary}
                      value={couponInput}
                      onChangeText={setCouponInput}
                      autoCapitalize="characters"
                      returnKeyType="done"
                      onSubmitEditing={handleApplyCoupon}
                      accessibilityLabel="Coupon code input"
                    />
                    <Pressable
                      style={styles.applyBtn}
                      onPress={handleApplyCoupon}
                      accessibilityRole="button"
                      accessibilityLabel="Apply coupon"
                    >
                      <Text style={styles.applyText}>Apply</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>

            {/* Price Breakdown — boutique invoice style */}
            <View style={[styles.priceCard, Shadows.card]}>
              <Text style={styles.priceCardTitle}>Price Details</Text>
              {[
                { label: 'Subtotal', value: subtotal },
                { label: 'Making Charges', value: makingCharges },
                { label: 'GST (3%)', value: gst },
                ...(couponDiscount > 0 ? [{ label: `Coupon (${couponCode})`, value: -couponDiscount }] : []),
              ].map((row, idx) => (
                <React.Fragment key={row.label}>
                  {idx > 0 && <View style={styles.priceDivider} />}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>{row.label}</Text>
                    <Text style={[styles.priceValue, row.value < 0 && { color: Colors.success }]}>
                      {row.value < 0 ? '- ' : ''}{formatCurrency(Math.abs(row.value))}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
              <View style={styles.priceDivider} />
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.priceTotalLabel}>Total</Text>
                <Text style={styles.priceTotalValue}>{formatCurrency(total)}</Text>
              </View>
              <Text style={styles.liveNote}>
                Live price · updates every 60s with gold rate
              </Text>
            </View>
          </ScrollView>

          {/* Sticky checkout bar */}
          <SafeAreaView style={styles.stickyBar} edges={['bottom']}>
            <View style={styles.stickyRow}>
              <View>
                <Text style={styles.totalSmall}>Total</Text>
                <Text style={styles.totalBig}>{formatCurrency(total)}</Text>
              </View>
              <PrimaryButton
                label="Proceed to Checkout"
                onPress={() => router.push('/checkout')}
                style={styles.checkoutBtn}
              />
            </View>
            {/* Trust signals */}
            <View style={styles.trustRow}>
              {([
                { icon: 'shield-checkmark-outline', label: 'Secure Checkout' },
                { icon: 'ribbon-outline',            label: 'BIS 916 Hallmark' },
                { icon: 'cube-outline',              label: 'Insured Delivery' },
              ] as const).map((badge) => (
                <View key={badge.label} style={styles.trustBadge}>
                  <Ionicons name={badge.icon} size={18} color={Colors.textSecondary} />
                  <Text style={styles.trustLabel}>{badge.label}</Text>
                </View>
              ))}
            </View>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: 16,
  },
  headerTitle: { ...Typography.headlineLarge, color: Colors.textOnPrimary },
  emptyWrapper: { flex: 1 },
  content: { padding: Spacing.base, gap: 12, paddingBottom: 120 },

  // Item card
  itemCard: {
    backgroundColor: Colors.surface, borderRadius: 16,
    padding: 12, flexDirection: 'row', gap: 12, alignItems: 'flex-start',
  },
  itemImg: { width: 80, height: 80, borderRadius: 10 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { ...Typography.titleMedium, color: Colors.textPrimary },
  itemSub: { ...Typography.bodyMedium, color: Colors.textSecondary },
  itemPrice: { ...Typography.titleLarge, color: Colors.textPrimary, fontWeight: '700' },

  // Stepper
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  stepBtn: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stepQty: {
    ...Typography.titleMedium, color: Colors.textPrimary,
    minWidth: 20, textAlign: 'center',
  },

  // Coupon
  couponCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
  },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  couponInput: {
    flex: 1, height: 44,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#CCCCCC',
    borderRadius: 8, paddingHorizontal: 12,
    ...Typography.bodyMedium, color: Colors.textPrimary,
  },
  applyBtn: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.primaryTint, borderRadius: 8,
  },
  applyText: { ...Typography.labelLarge, color: Colors.primary, fontWeight: '600' },
  couponApplied: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  couponAppliedText: { ...Typography.labelLarge, color: Colors.success, flex: 1 },

  // Price card — boutique invoice
  priceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  priceCardTitle: {
    fontFamily: SerifFonts.serif,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalRow: { paddingTop: 14 },
  priceLabel: {
    fontFamily: SerifFonts.sans,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontFamily: SerifFonts.sans,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  priceDivider: { height: 0.5, backgroundColor: Colors.border },
  priceTotalLabel: {
    fontFamily: SerifFonts.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  priceTotalValue: {
    fontFamily: SerifFonts.sans,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  liveNote: {
    fontFamily: SerifFonts.sans,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 8,
  },

  // Sticky bar
  stickyBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  stickyRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 8,
    gap: 16,
  },
  totalSmall: { ...Typography.labelMedium, color: Colors.textSecondary },
  totalBig: { ...Typography.titleLarge, color: Colors.textPrimary, fontWeight: '700' },
  checkoutBtn: { flex: 1 },

  // Trust badges
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.base,
    paddingTop: 4,
    paddingBottom: 8,
  },
  trustBadge: { alignItems: 'center', gap: 4, flex: 1 },
  trustLabel: {
    fontFamily: SerifFonts.sans,
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

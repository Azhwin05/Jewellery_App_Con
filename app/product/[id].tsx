import { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { SerifFonts } from '../../constants/typography';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ProductDetailSkeleton } from '../../components/ui/SkeletonLoader';
import { ProductCard } from '../../components/product/ProductCard';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { productService } from '../../services/productService';

const { width: SCREEN_W } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showARSheet, setShowARSheet] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(id ?? ''));

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id ?? ''),
    enabled: !!id,
  });

  const { data: similar } = useQuery({
    queryKey: ['similar', id],
    queryFn: () => productService.getSimilar(id ?? ''),
    enabled: !!id,
  });

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product);
    router.push('/cart');
  }, [product, addItem]);

  const handleWishlist = useCallback(() => {
    if (!product) return;
    toggleItem(product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [product, toggleItem]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <SafeAreaView style={[styles.floatingControls, { top: 0 }]} edges={['top']}>
          <Pressable
            style={styles.floatingBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
          </Pressable>
        </SafeAreaView>
        <ScrollView scrollEnabled={false}>
          <ProductDetailSkeleton />
        </ScrollView>
      </View>
    );
  }

  if (!product) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Image Gallery */}
        <View>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
              setActiveImage(idx);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.galleryImg}
                resizeMode="cover"
                accessibilityLabel={`Photo of ${product.name}`}
              />
            )}
          />

          {/* Pagination dots */}
          <View style={styles.imgDots} pointerEvents="none">
            {product.images.map((_, i) => (
              <View
                key={i}
                style={[styles.imgDot, i === activeImage && styles.imgDotActive]}
              />
            ))}
          </View>

          {product.has360View && (
            <View style={styles.badge360}>
              <Text style={styles.badge360Text}>360°</Text>
            </View>
          )}
        </View>

        {/* Product Info Card — overlaps image for depth */}
        <View style={styles.infoCard}>
          {/* Name + hallmark row */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={3}>{product.name}</Text>
            <View style={styles.hallmark}>
              <Text style={styles.hallmarkText}>{product.hallmark}</Text>
            </View>
          </View>

          <Text style={styles.subInfo}>
            {product.karat} · {product.weightGrams}g
          </Text>

          <Text style={styles.price}>{formatCurrency(product.totalPrice)}</Text>

          {/* Price Breakdown toggle */}
          <Pressable
            onPress={() => setShowBreakdown(!showBreakdown)}
            accessibilityRole="button"
            accessibilityLabel={showBreakdown ? 'Hide price breakdown' : 'Show price breakdown'}
          >
            <Text style={styles.breakdownToggle}>
              {showBreakdown ? 'Hide breakdown ↑' : 'See price breakdown ↓'}
            </Text>
          </Pressable>

          {showBreakdown && (
            <View style={styles.breakdown}>
              {[
                { label: 'Gold value', value: product.price },
                { label: 'Making charges', value: product.makingCharges },
                { label: 'GST (3%)', value: product.gst },
              ].map((row) => (
                <View key={row.label} style={styles.breakRow}>
                  <Text style={styles.breakLabel}>{row.label}</Text>
                  <Text style={styles.breakValue}>{formatCurrency(row.value)}</Text>
                </View>
              ))}
              <View style={[styles.breakRow, styles.breakTotal]}>
                <Text style={styles.breakTotalLabel}>Total</Text>
                <Text style={styles.breakTotalValue}>{formatCurrency(product.totalPrice)}</Text>
              </View>
            </View>
          )}

          <Text style={styles.description}>{product.description}</Text>

          {/* CTA area */}
          <View style={styles.ctaArea}>
            {/* AR Try-On — always shown if model exists */}
            {product.hasARModel && (
              <Pressable
                style={({ pressed }) => [styles.arBtn, pressed && styles.arBtnPressed]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowARSheet(true); }}
                accessibilityRole="button"
                accessibilityLabel="Virtual Try-On"
              >
                <Ionicons name="camera-outline" size={20} color={Colors.primary} />
                <Text style={styles.arBtnText}>Virtual Try-On</Text>
              </Pressable>
            )}

            {/* Add to Cart */}
            <PrimaryButton
              label="Add to Cart"
              onPress={handleAddToCart}
              style={styles.cartBtn}
            />
          </View>
        </View>

        {/* Similar products */}
        {similar && similar.length > 0 && (
          <View style={styles.similar}>
            <Text style={styles.similarTitle}>You May Also Like</Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item }) => <ProductCard product={item} cardWidth={180} />}
            />
          </View>
        )}
      </ScrollView>

      {/* Floating back + wishlist — rendered above scroll */}
      <SafeAreaView
        style={styles.floatingControls}
        edges={['top']}
        pointerEvents="box-none"
      >
        <Pressable
          style={styles.floatingBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
        </Pressable>
        <Pressable
          style={styles.floatingBtn}
          onPress={handleWishlist}
          accessibilityRole="button"
          accessibilityLabel={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color={isInWishlist ? Colors.error : Colors.textPrimary}
          />
        </Pressable>
      </SafeAreaView>

      {/* AR Permission Bottom Sheet */}
      <BottomSheet
        visible={showARSheet}
        onClose={() => setShowARSheet(false)}
        heightPercent={58}
      >
        <View style={styles.arSheetBody}>
          <View style={styles.arIconWrap}>
            <Ionicons name="camera-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.arTitle}>Try It On</Text>
          <Text style={styles.arDesc}>
            See how this jewelry looks on you using augmented reality.
            {'\n'}Point your camera at your hand, neck, or ear.
          </Text>
          <PrimaryButton
            label="Allow Camera"
            onPress={() => {
              setShowARSheet(false);
              router.push(`/try-on/${id}`);
            }}
            style={styles.arCta}
          />
          <Pressable
            onPress={() => setShowARSheet(false)}
            accessibilityRole="button"
            accessibilityLabel="Not now"
          >
            <Text style={styles.notNow}>Not Now</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Gallery ──────────────────────────────────────────────────────────────────
  galleryImg: { width: SCREEN_W, height: 380 },

  imgDots: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  imgDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#C6C6C8',
  },
  imgDotActive: {
    width: 16, height: 6, borderRadius: 3,
    backgroundColor: Colors.textPrimary,
  },

  badge360: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  badge360Text: { ...Typography.labelMedium, color: Colors.textOnPrimary },

  // ── Floating controls ─────────────────────────────────────────────────────────
  floatingControls: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  floatingBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(250,250,252,0.93)',
    alignItems: 'center', justifyContent: 'center',
    // ambient shadow so it lifts off the image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },

  // ── Info card — overlaps gallery bottom ───────────────────────────────────────
  infoCard: {
    backgroundColor: Colors.surface,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },

  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  name: {
    fontFamily: SerifFonts.serif,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 0.2,
    color: Colors.textPrimary,
    flex: 1,
  },
  hallmark: {
    backgroundColor: 'rgba(92,64,201,0.08)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  hallmarkText: {
    fontFamily: SerifFonts.sans,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primary,
  },

  subInfo: {
    fontFamily: SerifFonts.sans,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 0,
  },

  // Price — system sans-serif, NOT serif
  price: {
    fontFamily: SerifFonts.sans,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
  },

  breakdownToggle: {
    fontFamily: SerifFonts.sans,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
    marginTop: 6,
  },
  breakdown: {
    backgroundColor: Colors.background,
    borderRadius: 10, padding: 12, gap: 8,
    marginTop: 4,
  },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakLabel: { ...Typography.bodyMedium, color: Colors.textSecondary },
  breakValue: { ...Typography.bodyMedium, color: Colors.textPrimary },
  breakTotal: {
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 8, marginTop: 4,
  },
  breakTotalLabel: { ...Typography.titleMedium, color: Colors.textPrimary, fontWeight: '700' },
  breakTotalValue: { ...Typography.titleMedium, color: Colors.textPrimary, fontWeight: '700' },

  description: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginTop: 4,
  },

  // ── CTA area ──────────────────────────────────────────────────────────────────
  ctaArea: { marginTop: 24, gap: 12 },

  // AR / Try-On — full-width outlined button
  arBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  arBtn: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  arBtnText: {
    fontFamily: SerifFonts.sans,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primary,
  },

  // Add to Cart — height override (PrimaryButton handles bg + shadow)
  cartBtn: { height: 52 },

  // ── Similar ───────────────────────────────────────────────────────────────────
  similar: { paddingBottom: 24, marginTop: 8 },
  similarTitle: {
    ...Typography.titleLarge, color: Colors.textPrimary,
    paddingHorizontal: 16, marginBottom: 12,
  },

  // ── AR Bottom Sheet ───────────────────────────────────────────────────────────
  arSheetBody: { padding: 24, alignItems: 'center', gap: 12 },
  arIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  arTitle: { ...Typography.headlineMedium, color: Colors.textPrimary, textAlign: 'center' },
  arDesc: {
    ...Typography.bodyLarge, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  arCta: { alignSelf: 'stretch', marginTop: 4 },
  notNow: { ...Typography.labelMedium, color: Colors.textSecondary, marginTop: 4 },
});

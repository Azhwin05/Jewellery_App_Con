/**
 * ProductCard — Luxury Edition
 *
 * Changes from standard:
 *  - Soft ambient shadow (not harsh drop shadow)
 *  - Image wrapped in fixed-ratio container with #F8F8FA bg
 *  - Serif font for product name
 *  - Dark navy "NEW" badge (replaces red)
 *  - Wishlist button with opaque white glass circle
 *  - Clean typographic hierarchy: name / karat·weight / price
 */
import React, { useCallback } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { SerifFonts } from '../../constants/typography';
import { Shadows } from '../../constants/shadows';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  cardWidth?: number;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  cardWidth,
}: ProductCardProps) {
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const handlePress = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [product.id]);

  const handleWishlist = useCallback(
    (e: any) => {
      e.stopPropagation?.();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleItem(product);
    },
    [product, toggleItem],
  );

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        cardWidth ? { width: cardWidth } : styles.flex,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.karat}, ${formatCurrency(product.totalPrice)}`}
    >
      {/* ── Image area ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Photo of ${product.name}`}
        />

        {/* NEW badge — dark navy, not red */}
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}

        {/* Wishlist heart — frosted white circle */}
        <Pressable
          onPress={handleWishlist}
          style={styles.wishlistBtn}
          accessibilityRole="button"
          accessibilityLabel={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={16}
            color={isInWishlist ? Colors.error : Colors.textSecondary}
          />
        </Pressable>
      </View>

      {/* ── Content ── */}
      <View style={styles.body}>
        {/* Serif product name */}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Karat + weight — system font, muted */}
        <Text style={styles.spec}>
          {product.karat} · {product.weightGrams}g
        </Text>

        {/* Price — system font, bold, ink */}
        <Text style={styles.price}>
          {formatCurrency(product.totalPrice)}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.card,
  },
  flex: { flex: 1 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },

  // Image — fixed 4:5 ratio for consistent vendor images
  imageContainer: {
    position: 'relative',
    backgroundColor: Colors.imageBg,
    aspectRatio: 4 / 5,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // NEW badge — dark navy pill, luxury feel
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.tagNew,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  newBadgeText: {
    fontFamily: SerifFonts.sans,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  // Wishlist — 30×30 white glass circle
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  body: {
    padding: 12,
    gap: 3,
  },
  name: {
    fontFamily: SerifFonts.serif,
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.15,
    color: Colors.textPrimary,
  },
  spec: {
    fontFamily: SerifFonts.sans,
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  price: {
    fontFamily: SerifFonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
});

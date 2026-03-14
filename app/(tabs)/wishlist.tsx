import { useCallback } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { SecondaryButton } from '../../components/ui/SecondaryButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../types/product';

export default function WishlistScreen() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  const handleMoveToCart = useCallback(
    (product: Product) => {
      addToCart(product);
      removeItem(product.id);
      router.push('/cart');
    },
    [addToCart, removeItem],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.headerTitle}>
          My Wishlist
          {items.length > 0 && (
            <Text style={styles.headerCount}> ({items.length})</Text>
          )}
        </Text>
      </SafeAreaView>

      {items.length === 0 ? (
        <EmptyState
          iconName="heart-outline"
          title="Your wishlist is empty"
          subtitle="Tap the heart on any product to save it here"
          ctaLabel="Start Exploring"
          onCta={() => router.push('/(tabs)/shop')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                style={styles.cardMain}
                onPress={() => router.push(`/product/${item.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`View ${item.name}`}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.productImage}
                  resizeMode="cover"
                  accessibilityLabel={`Photo of ${item.name}`}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productSub}>
                    {item.karat} · {item.weightGrams}g
                  </Text>
                  <Text style={styles.productPrice}>
                    {formatCurrency(item.totalPrice)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => removeItem(item.id)}
                  style={styles.removeBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name} from wishlist`}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </Pressable>
              </Pressable>

              <SecondaryButton
                label="Move to Cart"
                onPress={() => handleMoveToCart(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingBottom: 16,
  },
  headerTitle: { ...Typography.headlineLarge, color: Colors.textOnPrimary },
  headerCount: {
    ...Typography.headlineLarge,
    color: 'rgba(255,255,255,0.65)',
  },
  list: { padding: Spacing.base, gap: 12, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16, padding: 12, gap: 12,
  },
  cardMain: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
  },
  productImage: { width: 80, height: 80, borderRadius: 10 },
  productInfo: { flex: 1, gap: 4 },
  productName: { ...Typography.titleMedium, color: Colors.textPrimary },
  productSub: { ...Typography.bodyMedium, color: Colors.textSecondary },
  productPrice: {
    ...Typography.titleLarge, color: Colors.textPrimary, fontWeight: '700',
  },
  removeBtn: { paddingTop: 2 },
});

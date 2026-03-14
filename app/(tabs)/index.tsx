import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
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
import { LiveRateWidget } from '../../components/rates/LiveRateWidget';
import { CategoryChip } from '../../components/product/CategoryChip';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { useGoldRates } from '../../hooks/useGoldRates';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { productService } from '../../services/productService';
import { getProductGridColumns, getScreenPaddingH } from '../../utils/responsive';
import type { Product } from '../../types/product';

const CATEGORIES = [
  'All', 'Diamond', 'Gold', 'Silver', 'Rings', 'Necklaces', 'Earrings', 'Bracelets',
];

const BANNERS = [
  {
    id: '1',
    uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    label: 'New Arrivals',
    isNew: true,
  },
  {
    id: '2',
    uri: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    label: 'Gold Collection',
    isNew: false,
  },
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    label: 'Diamond Rings',
    isNew: true,
  },
];

const SCREEN_W = Dimensions.get('window').width;
const PADDING = getScreenPaddingH();
const COLS = getProductGridColumns();
const GAP = 12;
const CARD_W = (SCREEN_W - PADDING * 2 - GAP * (COLS - 1)) / COLS;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Chunk flat product array into rows of `COLS` for our grid */
function toRows(products: Product[]): Product[][] {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += COLS) {
    rows.push(products.slice(i, i + COLS));
  }
  return rows;
}

export default function HomeScreen() {
  useGoldRates(); // starts mock WS in dev

  const user = useAuthStore((s) => s.user);
  const totalCartItems = useCartStore((s) => s.totalItems());
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerRef = useRef<FlatList<(typeof BANNERS)[0]>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll banner every 3 s, pause on touch
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveBanner((prev) => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const pauseBanner = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const { data: products, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['products', activeCategory],
    queryFn: () => productService.getProducts(),
  });

  const filtered = (products ?? []).filter(
    (p) =>
      activeCategory === 'All' ||
      p.metalType === activeCategory ||
      p.category === activeCategory,
  );

  const rows = toRows(filtered);

  const handleCategorySelect = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  // ── LIST HEADER: everything above the product grid ─────────────────────────
  const ListHeader = (
    <View>
      {/* 1. Hero Banner — edge-to-edge, visuals first */}
      <View style={styles.carouselWrap}>
        <FlatList
          ref={bannerRef}
          data={BANNERS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(b) => b.id}
          onTouchStart={pauseBanner}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
            setActiveBanner(Math.max(0, Math.min(idx, BANNERS.length - 1)));
          }}
          renderItem={({ item }) => (
            <View style={styles.bannerItem}>
              <Image
                source={{ uri: item.uri }}
                style={styles.bannerImg}
                resizeMode="cover"
                accessibilityLabel={item.label}
              />
              {item.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </View>
          )}
        />
        {/* Dots — absolute overlay inside banner */}
        <View style={styles.dots} pointerEvents="none">
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeBanner && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* 2. Category strip */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catStrip}
        keyExtractor={(c) => c}
        renderItem={({ item }) => (
          <CategoryChip label={item} active={activeCategory === item} onPress={handleCategorySelect} />
        )}
      />

      {/* 3. Live Rate Widget — utility support below navigation */}
      <LiveRateWidget />

      {/* 4. Section header */}
      <Text style={styles.sectionTitle}>
        {activeCategory === 'All' ? 'All Products' : activeCategory}
      </Text>

      {isLoading && (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ width: CARD_W }}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Fixed purple header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {getGreeting()},{' '}
              {user?.fullName?.split(' ')[0] ?? 'there'}!
            </Text>
            <Text style={styles.subGreeting}>Discover fine jewelry</Text>
          </View>
          <Pressable
            onPress={() => router.push('/cart')}
            style={styles.cartBtn}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${totalCartItems} items`}
          >
            <Ionicons name="bag-outline" size={24} color={Colors.textPrimary} />
            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalCartItems > 9 ? '9+' : totalCartItems}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <Pressable
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/shop')}
          accessibilityRole="search"
          accessibilityLabel="Search jewelry"
        >
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search rings, necklaces…</Text>
        </Pressable>
      </SafeAreaView>

      {/* Single FlatList — no nesting issues */}
      <FlatList<Product[]>
        data={rows}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((product) => (
              <ProductCard key={product.id} product={product} cardWidth={CARD_W} />
            ))}
            {row.length < COLS &&
              Array.from({ length: COLS - row.length }).map((_, i) => (
                <View key={`ph-${i}`} style={{ width: CARD_W }} />
              ))}
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Ionicons name="diamond-outline" size={56} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No products found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Header — solid white, shared horizontal rail ────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 24,   // generous gap so banner never crashes in
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',  // vertically centres bag icon with greeting
    marginBottom: 16,      // tighter: greeting → search feel connected
  },
  headerLeft: { flex: 1, gap: 2 },
  greeting: { ...Typography.titleLarge, color: Colors.textPrimary },
  subGreeting: { ...Typography.bodyMedium, color: Colors.textSecondary },
  cartBtn: {
    width: 44, height: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: {
    ...Typography.labelSmall, color: Colors.textOnPrimary, fontWeight: '700',
  },
  // Search bar — sleek rectangle, no border, cool-gray surface
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F4F4F8',
    borderRadius: 12, height: 44, paddingHorizontal: 16,
    // no marginBottom — header.paddingBottom owns the gap to the banner
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },

  // List
  listContent: { paddingBottom: 100 },

  // Banner — edge-to-edge, immersive
  carouselWrap: { position: 'relative' },
  bannerItem: {
    width: SCREEN_W,
    height: 220,
    overflow: 'hidden',
  },
  bannerImg: { width: '100%', height: '100%' },
  newBadge: {
    position: 'absolute', top: 14, left: 16,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4,
  },
  newBadgeText: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
  // Dots — inside banner as absolute overlay
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { width: 16, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },

  // Categories
  catStrip: { paddingHorizontal: PADDING, paddingVertical: 14 },

  sectionTitle: {
    ...Typography.titleLarge, color: Colors.textPrimary,
    paddingHorizontal: PADDING, marginBottom: 8, marginTop: 32,
  },

  // Product rows
  row: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    gap: GAP,
    marginBottom: GAP,
  },

  // Skeleton
  skeletonGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: PADDING, gap: GAP,
  },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { ...Typography.headlineMedium, color: Colors.textSecondary },
});

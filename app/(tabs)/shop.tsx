import { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '../../constants/typography';
import { SerifFonts } from '../../constants/typography';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { productService } from '../../services/productService';
import { getProductGridColumns, getScreenPaddingH } from '../../utils/responsive';
import type { JewelryCategory, Product } from '../../types/product';

const SCREEN_W = Dimensions.get('window').width;
const PADDING = getScreenPaddingH();
const COLS = getProductGridColumns();
const GAP = 12;
const CARD_W = (SCREEN_W - PADDING * 2 - GAP * (COLS - 1)) / COLS;

const FILTER_CHIPS = ['All', '22K', '18K', '14K', 'Price ↑', 'Newest'];

const MAIN_CATEGORIES: {
  id: JewelryCategory;
  image: string;
  count: number;
}[] = [
  { id: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300', count: 48 },
  { id: 'Necklaces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300', count: 62 },
  { id: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300', count: 89 },
  { id: 'Bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300', count: 34 },
  { id: 'Bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=300', count: 27 },
];

function toRows(products: Product[]): Product[][] {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += COLS) {
    rows.push(products.slice(i, i + COLS));
  }
  return rows;
}

export default function ShopScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<JewelryCategory | null>(null);
  const [searchText, setSearchText] = useState('');

  const { data: products, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (selectedCategory) list = list.filter((p) => p.category === selectedCategory);
    if (activeFilter === '22K') list = list.filter((p) => p.karat === '22K');
    else if (activeFilter === '18K') list = list.filter((p) => p.karat === '18K');
    else if (activeFilter === '14K') list = list.filter((p) => p.karat === '14K');
    else if (activeFilter === 'Price ↑') list = [...list].sort((a, b) => a.totalPrice - b.totalPrice);
    else if (activeFilter === 'Newest') list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.metalType.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, selectedCategory, activeFilter, searchText]);

  const rows = toRows(filtered);

  const handleFilterSelect = useCallback((filter: string) => setActiveFilter(filter), []);

  const ListHeader = (
    <View>
      {/* 1. Horizontal "story" strip — shown when no category is active */}
      {!selectedCategory && (
        <FlatList
          data={MAIN_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.storyStrip}
          renderItem={({ item: cat }) => (
            <Pressable
              onPress={() => setSelectedCategory(cat.id)}
              accessibilityRole="button"
              accessibilityLabel={`${cat.id}, ${cat.count} items`}
              style={({ pressed }) => [styles.storyItem, pressed && { opacity: 0.75 }]}
            >
              <View style={styles.storyCircle}>
                <Image source={{ uri: cat.image }} style={styles.storyImage} resizeMode="cover" />
              </View>
              <Text style={styles.storyLabel}>{cat.id}</Text>
            </Pressable>
          )}
        />
      )}

      {/* Hairline — separates navigation from filtering */}
      {!selectedCategory && <View style={styles.stripDivider} />}

      {/* 2. Filter chips */}
      <FlatList
        data={FILTER_CHIPS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterStrip}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleFilterSelect(item)}
            style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === item }}
            accessibilityLabel={`Filter by ${item}`}
          >
            <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </Pressable>
        )}
      />

      {selectedCategory && (
        <Text style={styles.sectionTitle}>{selectedCategory}</Text>
      )}

      {isLoading && (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
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

      {/* White Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          {selectedCategory && (
            <Pressable
              onPress={() => setSelectedCategory(null)}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Back to categories"
            >
              <Ionicons name="chevron-back" size={24} color="#1A1A2E" />
            </Pressable>
          )}
          <Text style={styles.headerTitle}>
            {selectedCategory ?? 'Shop'}
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jewelry…"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            accessibilityLabel="Search jewelry"
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => setSearchText('')}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      {/* Product grid */}
      <FlatList<Product[]>
        data={rows}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        onRefresh={refetch}
        refreshing={isRefetching}
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
            <EmptyState
              iconName="search-outline"
              title={searchText ? 'No results found' : 'No products found'}
              subtitle={searchText ? `Try a different search term` : undefined}
              ctaLabel={searchText ? 'Clear Search' : undefined}
              onCta={searchText ? () => setSearchText('') : undefined}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },

  // ── White header ──────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: PADDING,
    paddingBottom: 16,
    gap: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 2,
  },
  // Serif left-aligned title — matches Home greeting rail
  headerTitle: {
    fontFamily: SerifFonts.serif,
    fontSize: 28,
    color: '#1A1A2E',
    letterSpacing: 0.2,
  },

  // ── Sleek search bar — mirrors Home Screen ────────────────────────────────
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F4F4F8',
    borderRadius: 12, height: 44, paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: SerifFonts.sans,
    fontSize: 14,
    color: '#1A1A2E',
    paddingVertical: 0,
  },

  listContent: { paddingBottom: 100 },

  // ── Horizontal story strip ────────────────────────────────────────────────
  storyStrip: { paddingHorizontal: PADDING, paddingVertical: 16 },
  storyItem: { alignItems: 'center', marginRight: 20 },
  storyCircle: {
    width: 72, height: 72, borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 1, borderColor: '#E5E5EA',
    backgroundColor: '#F8F8FA',
  },
  storyImage: { width: '100%', height: '100%' },
  storyLabel: {
    fontFamily: SerifFonts.serif,
    fontSize: 13,
    color: '#1A1A2E',
    marginTop: 8,
    textAlign: 'center',
  },
  stripDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginHorizontal: PADDING,
  },

  // ── Filter chips — monochrome, no borders ─────────────────────────────────
  filterStrip: {
    paddingHorizontal: PADDING,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    height: 36, borderRadius: 8,
    backgroundColor: '#F4F4F8',
    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#1A1A2E' },
  filterText: { ...Typography.labelLarge, color: '#8E8E93' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '700' },

  sectionTitle: {
    ...Typography.titleLarge, color: '#1A1A2E',
    paddingHorizontal: PADDING, marginBottom: 8,
  },

  row: {
    flexDirection: 'row', paddingHorizontal: PADDING,
    gap: GAP, marginBottom: GAP,
  },

  skeletonGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: PADDING, gap: GAP,
  },
});

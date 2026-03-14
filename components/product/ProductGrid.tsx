import React, { useCallback } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from '../ui/SkeletonLoader';
import { getProductGridColumns, getScreenPaddingH } from '../../utils/responsive';
import type { Product } from '../../types/product';

const PADDING = getScreenPaddingH();
const COLUMNS = getProductGridColumns();
const GAP = 12;
const CARD_WIDTH =
  (Dimensions.get('window').width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
}

export function ProductGrid({
  products,
  isLoading,
  onRefresh,
  isRefreshing,
  ListHeaderComponent,
}: ProductGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.itemWrapper}>
        <ProductCard product={item} cardWidth={CARD_WIDTH} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.itemWrapper, { width: CARD_WIDTH }]}>
            <SkeletonCard />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      numColumns={COLUMNS}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing ?? false}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: PADDING,
    gap: GAP,
  },
  itemWrapper: {
    flex: 1,
    marginBottom: GAP,
    marginRight: GAP,
  },
});

/**
 * iOS Tab Bar — Glassmorphism Edition
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { useWishlistStore } from '../../store/wishlistStore';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const SCREEN_W = Dimensions.get('window').width;
const SLOT_W   = SCREEN_W / 5;

const TAB_SLOTS: Record<string, number> = { index: 0, shop: 1, wishlist: 3, profile: 4 };

const TABS: { name: string; label: string; active: IoniconName; inactive: IoniconName }[] = [
  { name: 'index',    label: 'Home',     active: 'home',     inactive: 'home-outline' },
  { name: 'shop',     label: 'Shop',     active: 'pricetag', inactive: 'pricetag-outline' },
  { name: 'wishlist', label: 'Wishlist', active: 'heart',    inactive: 'heart-outline' },
  { name: 'profile',  label: 'Profile',  active: 'person',   inactive: 'person-outline' },
];

const ACTIONS: { label: string; icon: IoniconName; route: string }[] = [
  { label: 'Browse Rings',  icon: 'diamond-outline',  route: '/(tabs)/shop' },
  { label: 'View Cart',     icon: 'bag-outline',      route: '/cart' },
  { label: 'My Wishlist',   icon: 'heart-outline',    route: '/(tabs)/wishlist' },
  { label: 'Track Order',   icon: 'location-outline', route: '/orders' },
];

function QuickActionSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={46}>
      <View style={sheet.wrap}>
        <View style={sheet.handle} />
        <Text style={sheet.title}>Quick Actions</Text>
        {ACTIONS.map((a, i) => (
          <Pressable
            key={a.label}
            style={[sheet.row, i === ACTIONS.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => { onClose(); router.push(a.route as any); }}
            accessibilityRole="button"
          >
            <View style={sheet.iconBox}>
              <Ionicons name={a.icon} size={20} color="#1A1A2E" />
            </View>
            <Text style={sheet.label}>{a.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

function TabItem({ tab, isActive, badge, slotIdx, onPress }: {
  tab: typeof TABS[0]; isActive: boolean;
  badge?: number; slotIdx: number; onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const ty    = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.parallel([
      Animated.sequence([
        // Tight, physical spring — 1.10 max, not bouncy
        Animated.spring(scale, { toValue: 1.10, useNativeDriver: true, friction: 7, tension: 220 }),
        Animated.spring(scale, { toValue: 1,    useNativeDriver: true, friction: 8 }),
      ]),
      Animated.sequence([
        Animated.spring(ty, { toValue: -3, useNativeDriver: true, friction: 7, tension: 240 }),
        Animated.spring(ty, { toValue: 0,  useNativeDriver: true, friction: 8 }),
      ]),
    ]).start();
  };

  // Dark navy active — matches home screen editorial palette
  const color = isActive ? '#1A1A2E' : '#8E8E93';

  return (
    <Pressable
      style={[styles.tabSlot, { left: slotIdx * SLOT_W }]}
      onPress={() => { animate(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.iconWrap, { transform: [{ scale }, { translateY: ty }] }]}>
        <Ionicons name={isActive ? tab.active : tab.inactive} size={24} color={color} />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </Animated.View>
      <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
    </Pressable>
  );
}

function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets        = useSafeAreaInsets();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [showActions, setShowActions] = useState(false);
  const activeRoute   = state.routes[state.index]?.name ?? 'index';
  const fabSpin       = useRef(new Animated.Value(0)).current;
  const fabScale      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fabSpin,  { toValue: showActions ? 1 : 0, useNativeDriver: true, friction: 5 }),
      Animated.spring(fabScale, { toValue: showActions ? 0.88 : 1, useNativeDriver: true, friction: 5 }),
    ]).start();
  }, [showActions]);

  const fabRotate = fabSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });
  const BAR_H = 56 + (insets.bottom > 0 ? insets.bottom : 16);

  return (
    <>
      <View style={[styles.barOuter, { height: BAR_H }, Shadows.tabBar]}>
        <View style={[StyleSheet.absoluteFill, styles.barBg]} />
        <View style={styles.topBorder} />

        {TABS.map((tab) => (
          <TabItem
            key={tab.name}
            tab={tab}
            isActive={activeRoute === tab.name}
            badge={tab.name === 'wishlist' ? wishlistCount : undefined}
            slotIdx={TAB_SLOTS[tab.name]}
            onPress={() => { if (activeRoute !== tab.name) navigation.navigate(tab.name); }}
          />
        ))}

        <View style={[styles.fabSlot, { left: 2 * SLOT_W, bottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowActions((v) => !v); }}
            accessibilityRole="button"
          >
            <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
              <Animated.View style={{ transform: [{ rotate: fabRotate }] }}>
                {/* Slightly smaller + lighter weight for a refined feel */}
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      </View>
      <QuickActionSheet visible={showActions} onClose={() => setShowActions(false)} />
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <GlassTabBar {...props} />}>
      <Tabs.Screen name="index"    options={{ title: 'Home' }} />
      <Tabs.Screen name="shop"     options={{ title: 'Shop' }} />
      <Tabs.Screen name="centre"   options={{ title: '', href: null }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barOuter: { position: 'relative', overflow: 'hidden' },
  barBg: { backgroundColor: 'rgba(255,255,255,0.93)' },
  topBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 0.5, backgroundColor: '#E5E5EA', zIndex: 2 },
  tabSlot: { position: 'absolute', top: 0, height: 56, width: SLOT_W, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 0.1 },
  badge: { position: 'absolute', top: -4, right: -8, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, borderWidth: 1.5, borderColor: '#FFFFFF' },
  badgeText: { fontSize: 8, fontWeight: '700', color: '#fff' },
  fabSlot: { position: 'absolute', width: SLOT_W, alignItems: 'center', justifyContent: 'flex-end' },
  // FAB — dark navy, ambient shadow (no colored glow)
  fab: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
});

const sheet = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E5E5EA', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA' },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(26,26,46,0.07)', alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 16, fontWeight: '400', color: '#1A1A2E' },
});

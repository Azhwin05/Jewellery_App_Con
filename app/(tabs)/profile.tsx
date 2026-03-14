import { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SerifFonts } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuRow {
  id: string;
  label: string;
  icon: IoniconName;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

interface MenuGroup {
  title: string;
  rows: MenuRow[];
}

export default function ProfileScreen() {
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }, [logout]);

  const groups: MenuGroup[] = [
    {
      title: 'My Account',
      rows: [
        { id: 'orders',    label: 'My Orders',        icon: 'bag-outline',      onPress: () => router.push('/orders') },
        { id: 'addresses', label: 'Saved Addresses',  icon: 'location-outline', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      rows: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: 'notifications-outline',
          onPress: () => {},
          rightElement: (
            <Switch
              value={true}
              thumbColor="#FFFFFF"
              trackColor={{ true: '#1A1A2E', false: '#E5E5EA' }}
              accessibilityLabel="Toggle notifications"
            />
          ),
        },
        { id: 'preferences', label: 'App Preferences', icon: 'settings-outline', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      rows: [
        { id: 'review', label: 'Rate & Review',  icon: 'star-outline',         onPress: () => {} },
        { id: 'help',   label: 'Help & Support', icon: 'help-circle-outline',  onPress: () => {} },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Centered editorial header ─────────────────────────────── */}
        <SafeAreaView edges={['top']}>
          <View style={styles.hero}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.userName}>
              {user?.fullName ?? 'Welcome'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </SafeAreaView>

        {/* ── Grouped menu cards ────────────────────────────────────── */}
        {groups.map((group) => (
          <View key={group.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.rows.map((row, idx) => (
                <Pressable
                  key={row.id}
                  onPress={row.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={row.label}
                  style={({ pressed }) => [
                    styles.row,
                    idx < group.rows.length - 1 && styles.rowDivider,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <Ionicons name={row.icon} size={22} color="#1A1A2E" />
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  {row.rightElement ?? (
                    <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* ── Standalone logout ─────────────────────────────────────── */}
        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F8' },

  content: { paddingBottom: 100 },

  // ── Hero header — centered, editorial ─────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#1A1A2E',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 20,
  },
  avatarText: {
    fontFamily: SerifFonts.sans,
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontFamily: SerifFonts.serif,
    fontSize: 24,
    color: '#1A1A2E',
    marginTop: 16,
  },
  userEmail: {
    fontFamily: SerifFonts.sans,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },

  // ── Menu sections ─────────────────────────────────────────────────────────
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: SerifFonts.sans,
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 16,
    marginBottom: 8,
  },

  // White ambient-shadow card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Individual rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    gap: 0,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  rowPressed: { backgroundColor: '#F9F9F9' },
  rowLabel: {
    fontFamily: SerifFonts.sans,
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '400',
    flex: 1,
    marginLeft: 16,
  },

  // ── Standalone logout ─────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    marginBottom: 40,
  },
  logoutText: {
    fontFamily: SerifFonts.sans,
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
});

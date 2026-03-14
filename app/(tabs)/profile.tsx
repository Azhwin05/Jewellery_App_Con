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
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  isDanger?: boolean;
  rightElement?: React.ReactNode;
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
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

  const menuItems: MenuItem[] = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: 'bag-outline',
      onPress: () => router.push('/orders'),
    },
    {
      id: 'addresses',
      label: 'Saved Addresses',
      icon: 'location-outline',
      onPress: () => {},
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {},
      rightElement: (
        <Switch
          value={true}
          thumbColor={Colors.textOnPrimary}
          trackColor={{ true: Colors.primary, false: Colors.border }}
          accessibilityLabel="Toggle notifications"
        />
      ),
    },
    {
      id: 'review',
      label: 'Rate & Review',
      icon: 'star-outline',
      onPress: () => {},
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      id: 'preferences',
      label: 'App Preferences',
      icon: 'settings-outline',
      onPress: () => {},
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'log-out-outline',
      onPress: handleLogout,
      isDanger: true,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Purple header with avatar */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.fullName ?? 'Welcome'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={item.onPress}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.isDanger ? Colors.error : Colors.textPrimary}
              />
              <Text
                style={[
                  styles.menuLabel,
                  item.isDanger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>
              {item.rightElement ?? (
                !item.isDanger && (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textSecondary}
                  />
                )
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingBottom: 24,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.headlineMedium, color: Colors.textOnPrimary },
  userInfo: { gap: 4 },
  userName: { ...Typography.titleLarge, color: Colors.textOnPrimary },
  userEmail: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.75)' },

  content: { padding: Spacing.base, paddingBottom: 100 },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLabel: { ...Typography.bodyLarge, color: Colors.textPrimary, flex: 1 },
  menuLabelDanger: { color: Colors.error },
});

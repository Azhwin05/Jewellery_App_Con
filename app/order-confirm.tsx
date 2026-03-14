import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export default function OrderConfirmScreen() {
  const { orderId, estimatedDelivery } = useLocalSearchParams<{
    orderId: string;
    estimatedDelivery: string;
  }>();

  const formattedDelivery = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '5-7 business days';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Checkmark */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={48} color={Colors.gold} />
        </View>

        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your jewelry is on its way. We'll send you updates.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <Text style={styles.infoValue}>{orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Delivery</Text>
            <Text style={styles.infoValue}>{formattedDelivery}</Text>
          </View>
        </View>

        <PrimaryButton
          label="Track Order"
          onPress={() => router.replace('/(tabs)/profile')}
          style={styles.trackBtn}
        />
        <SecondaryButton
          label="Continue Shopping"
          onPress={() => router.replace('/(tabs)')}
          style={styles.shopBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.base,
    gap: 16,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.textOnPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  trackBtn: { alignSelf: 'stretch', marginTop: 8 },
  shopBtn: {
    alignSelf: 'stretch',
    borderColor: Colors.textOnPrimary,
  },
});

import {
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
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { StatusChip } from '../../components/ui/StatusChip';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textOnPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Order #{id}</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Status</Text>
            <StatusChip status="confirmed" />
          </View>
          <Text style={styles.note}>
            Your order is confirmed and being processed.
          </Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking</Text>
          {[
            { label: 'Order Placed', time: 'Just now', done: true },
            { label: 'Processing', time: 'Expected in 1h', done: true },
            { label: 'Shipped', time: 'Expected tomorrow', done: false },
            { label: 'Delivered', time: 'In 5-7 days', done: false },
          ].map((step, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineDot}>
                <View
                  style={[
                    styles.dot,
                    step.done ? styles.dotDone : styles.dotPending,
                  ]}
                />
                {i < 3 && (
                  <View
                    style={[
                      styles.timelineLine,
                      step.done && styles.timelineLineDone,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineInfo}>
                <Text
                  style={[
                    styles.timelineLabel,
                    !step.done && styles.timelineLabelPending,
                  ]}
                >
                  {step.label}
                </Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { ...Typography.headlineLarge, color: Colors.textOnPrimary },
  content: { padding: Spacing.base, gap: 16, paddingBottom: 40 },

  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { ...Typography.titleLarge, color: Colors.textPrimary },
  note: { ...Typography.bodyMedium, color: Colors.textSecondary },

  // Timeline
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDot: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 16, height: 16, borderRadius: 8,
  },
  dotDone: { backgroundColor: Colors.primary },
  dotPending: { backgroundColor: Colors.border },
  timelineLine: {
    width: 2, flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  timelineLineDone: { backgroundColor: Colors.primary },
  timelineInfo: { flex: 1, paddingBottom: 16 },
  timelineLabel: {
    ...Typography.titleMedium, color: Colors.textPrimary,
  },
  timelineLabelPending: { color: Colors.textSecondary },
  timelineTime: { ...Typography.bodyMedium, color: Colors.textSecondary },
});

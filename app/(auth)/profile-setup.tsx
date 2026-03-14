import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import type { JewelryPreference } from '../../types/user';

const PREFERENCES: JewelryPreference[] = ['Gold', 'Silver', 'Diamond', 'Platinum'];

export default function ProfileSetupScreen() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState<JewelryPreference[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePref = useCallback((pref: JewelryPreference) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await authService.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        preferences: selectedPrefs,
      });
      updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        preferences: selectedPrefs,
        isProfileComplete: true,
      });
      router.replace('/(tabs)');
    } catch {
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  }, [fullName, phone, selectedPrefs, updateProfile]);

  const handleSkip = useCallback(() => {
    router.replace('/(tabs)');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Skip link */}
        <View style={styles.skipRow}>
          <Pressable
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip profile setup"
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Set Up Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalise your experience
          </Text>

          <AppTextInput
            label="Full Name"
            placeholder="Enter your name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <AppTextInput
            label="Phone Number (Optional)"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="done"
          />

          <Text style={styles.prefLabel}>Jewelry Preferences</Text>
          <View style={styles.prefRow}>
            {PREFERENCES.map((pref) => {
              const active = selectedPrefs.includes(pref);
              return (
                <Pressable
                  key={pref}
                  onPress={() => togglePref(pref)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={pref}
                  accessibilityState={{ checked: active }}
                  style={[styles.prefChip, active && styles.prefChipActive]}
                >
                  <Text style={[styles.prefText, active && styles.prefTextActive]}>
                    {pref}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            label="Save & Continue"
            onPress={handleSave}
            loading={loading}
            style={styles.cta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  skipText: { ...Typography.labelMedium, color: Colors.textSecondary },
  content: {
    padding: Spacing.base,
    gap: 16,
    paddingBottom: 32,
  },
  title: { ...Typography.headlineLarge, color: Colors.textPrimary },
  subtitle: { ...Typography.bodyMedium, color: Colors.textSecondary },
  prefLabel: { ...Typography.titleMedium, color: Colors.textPrimary },
  prefRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  prefChipActive: {
    backgroundColor: Colors.primaryTint,
    borderColor: Colors.primary,
  },
  prefText: { ...Typography.labelLarge, color: Colors.textPrimary },
  prefTextActive: { color: Colors.primary },
  cta: { marginTop: 8 },
});

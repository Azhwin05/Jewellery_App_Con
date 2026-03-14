import { useState, useCallback } from 'react';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSendOtp = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed) { setError('Please enter your email address'); return; }
    if (!validate(trimmed)) { setError('Please enter a valid email address'); return; }
    setError('');
    setLoading(true);
    try {
      await authService.sendOtp(trimmed);
      setPendingEmail(trimmed);
      router.push('/(auth)/otp');
    } catch (err: any) {
      setError(err.message ?? 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, setPendingEmail]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Purple top card */}
          <View style={styles.purpleCard}>
            {/* Logo mark */}
            <View style={styles.logoMark}>
              <View style={styles.logoInner} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </View>

          {/* Form area */}
          <View style={styles.form}>
            <AppTextInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={handleSendOtp}
              accessibilityLabel="Email address input"
            />

            <PrimaryButton
              label="Send OTP"
              onPress={handleSendOtp}
              loading={loading}
            />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              onPress={() => router.push('/(auth)/otp')}
              accessibilityRole="button"
              accessibilityLabel="New user? Register"
              style={styles.registerRow}
            >
              <Text style={styles.registerText}>
                New user?{' '}
                <Text style={styles.registerLink}>Register</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  purpleCard: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'flex-start',
    gap: 8,
  },
  logoMark: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  logoInner: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.gold,
  },
  title: { ...Typography.headlineLarge, color: Colors.textOnPrimary },
  subtitle: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.75)' },

  form: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.base,
    paddingTop: 32,
    gap: 16,
  },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...Typography.bodyMedium, color: Colors.textSecondary },

  registerRow: { alignItems: 'center' },
  registerText: { ...Typography.bodyMedium, color: Colors.textSecondary },
  registerLink: { color: Colors.primary, fontWeight: '600' },
});

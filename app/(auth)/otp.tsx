import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { SerifFonts } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const pendingEmail = useAuthStore((s) => s.pendingEmail);
  const setUser = useAuthStore((s) => s.setUser);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focused, setFocused] = useState<number>(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Resend countdown
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const shake = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const verifyOtp = useCallback(
    async (code: string) => {
      setLoading(true);
      setError('');
      try {
        const result = await authService.verifyOtp(pendingEmail ?? '', code);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setUser(result.user, result.token);
        if (!result.user.isProfileComplete) {
          router.replace('/(auth)/profile-setup');
        } else {
          router.replace('/(tabs)');
        }
      } catch (err: any) {
        setError('Invalid OTP. Please try again.');
        shake();
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [pendingEmail, setUser, shake],
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      setError('');

      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocused(index + 1);
      }

      // Auto-submit when all filled
      if (digit && index === OTP_LENGTH - 1) {
        const fullCode = newOtp.join('');
        if (fullCode.length === OTP_LENGTH) {
          verifyOtp(fullCode);
        }
      }
    },
    [otp, verifyOtp],
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocused(index - 1);
      }
    },
    [otp],
  );

  const handleResend = useCallback(async () => {
    if (resendSeconds > 0 || !pendingEmail) return;
    setResendSeconds(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    try {
      await authService.sendOtp(pendingEmail);
    } catch {
      // silently ignore resend errors
    }
  }, [resendSeconds, pendingEmail]);

  const handleVerify = useCallback(() => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }
    verifyOtp(code);
  }, [otp, verifyOtp]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Purple top */}
        <View style={styles.purpleHeader}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            Sent to {pendingEmail ?? 'your email'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* OTP Boxes */}
          <Animated.View
            style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}
          >
            {otp.map((digit, index) => {
              const isFocused = focused === index;
              const isFilled = digit.length > 0;
              const borderColor = error
                ? Colors.error
                : isFocused
                ? Colors.primary
                : '#E5E5EA';
              const bg = isFilled ? Colors.primaryTint : '#FFFFFF';

              return (
                <TextInput
                  key={index}
                  ref={(r) => { inputRefs.current[index] = r; }}
                  value={digit}
                  onChangeText={(v) => handleChange(index, v)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(index, nativeEvent.key)
                  }
                  onFocus={() => setFocused(index)}
                  style={[
                    styles.otpBox,
                    {
                      borderColor,
                      borderWidth: isFocused ? 1.5 : 1,
                      backgroundColor: bg,
                    },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  accessibilityLabel={`OTP digit ${index + 1}`}
                />
              );
            })}
          </Animated.View>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <PrimaryButton
            label="Verify OTP"
            onPress={handleVerify}
            loading={loading}
            style={styles.cta}
          />

          <Pressable
            onPress={handleResend}
            disabled={resendSeconds > 0}
            accessibilityRole="button"
            accessibilityLabel={
              resendSeconds > 0
                ? `Resend OTP in ${resendSeconds} seconds`
                : 'Resend OTP'
            }
          >
            <Text
              style={[
                styles.resendText,
                resendSeconds > 0 && styles.resendDisabled,
              ]}
            >
              {resendSeconds > 0
                ? `Resend OTP in ${resendSeconds}s`
                : 'Resend OTP'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  purpleHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: Spacing.base,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 8,
  },
  title: { ...Typography.headlineLarge, color: Colors.textOnPrimary },
  subtitle: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.75)' },
  form: {
    flex: 1,
    padding: Spacing.base,
    paddingTop: 32,
    alignItems: 'center',
    gap: 16,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  otpBox: {
    width: 48,
    height: 52,
    borderRadius: 12,
    textAlign: 'center',
    fontFamily: SerifFonts.sans,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  error: {
    ...Typography.labelMedium,
    color: Colors.error,
    textAlign: 'center',
  },
  cta: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  resendText: {
    ...Typography.labelMedium,
    color: Colors.primary,
  },
  resendDisabled: {
    color: Colors.textSecondary,
  },
});

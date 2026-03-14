// Splash Screen — 2-second hold then auto-redirect based on auth state
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';

export default function SplashScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, useNativeDriver: true, friction: 6,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.inner}>
        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
          {/* Logo ring */}
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <View style={styles.logoGem} />
            </View>
          </View>

          <Text style={styles.appName}>Jewels</Text>
          <Text style={styles.tagline}>Discover. Try. Own.</Text>
        </Animated.View>

        {/* Bottom loading dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.loadDot, i === 1 && styles.loadDotActive]} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  inner: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logoOuter: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  logoInner: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoGem: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.gold,
  },
  appName: {
    ...Typography.displayLarge,
    color: Colors.textOnPrimary,
    letterSpacing: 3,
    fontWeight: '700',
  },
  tagline: {
    ...Typography.bodyLarge,
    color: Colors.gold,
    letterSpacing: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 48,
  },
  loadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  loadDotActive: {
    backgroundColor: Colors.gold,
    width: 20,
  },
});

/**
 * AR Try-On Camera Screen
 *
 * ⚠️  AR DOES NOT WORK IN SIMULATOR/EMULATOR.
 * This screen requires a physical iOS (ARKit 6+) or Android (ARCore 1.40+) device.
 *
 * In dev mode, a camera preview placeholder is shown.
 * Full AR is powered by @viro-community/react-viro + MediaPipe.
 * Install these packages and swap the placeholder for the real AR view:
 *
 *   npm install @viro-community/react-viro @mediapipe/tasks-vision
 *
 * Then replace <ARPlaceholder> with:
 *   <ViroARSceneNavigator
 *     autofocus
 *     initialScene={{ scene: ARScene }}
 *   />
 */

import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { SerifFonts } from '../../constants/typography';
import { productService } from '../../services/productService';

export default function TryOnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [captured, setCaptured] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id ?? ''),
    enabled: !!id,
  });

  const handleCapture = useCallback(() => {
    // In production: capture the AR scene frame + MediaPipe overlay
    setCaptured(true);
  }, []);

  const handleRetake = useCallback(() => {
    setCaptured(false);
  }, []);

  if (captured) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {/* Full-screen "captured" placeholder */}
        <View style={styles.capturedBg}>
          <Text style={styles.capturedLabel}>Captured Photo</Text>
        </View>

        {/* Top controls */}
        <SafeAreaView style={styles.topControls} edges={['top']}>
          <View style={{ flexDirection: 'row', gap: 8, marginLeft: 'auto' }}>
            <Pressable style={styles.controlBtn} accessibilityRole="button" accessibilityLabel="Save photo">
              <Ionicons name="download-outline" size={20} color={Colors.textOnPrimary} />
            </Pressable>
            <Pressable style={styles.controlBtn} accessibilityRole="button" accessibilityLabel="Share photo">
              <Ionicons name="share-outline" size={20} color={Colors.textOnPrimary} />
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Bottom controls */}
        <SafeAreaView style={styles.bottomControls} edges={['bottom']}>
          <Pressable
            style={styles.retakeBtn}
            onPress={handleRetake}
            accessibilityRole="button"
            accessibilityLabel="Retake photo"
          >
            <Text style={styles.retakeText}>Retake</Text>
          </Pressable>

          <Pressable
            style={styles.addToCartFab}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
          >
            <Ionicons name="bag-add-outline" size={20} color={Colors.textOnGold} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/*
       * AR Camera View placeholder.
       * In production, replace this View with:
       *   <ViroARSceneNavigator initialScene={{ scene: ARScene }} autofocus />
       */}
      <View style={styles.cameraPlaceholder}>
        <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.3)" />
        <Text style={styles.placeholderText}>
          AR Camera{'\n'}(Physical device required)
        </Text>
        {product && (
          <Text style={styles.productName}>{product.name}</Text>
        )}
      </View>

      {/* Top gradient + controls + instructions */}
      <LinearGradient
        colors={['rgba(0,0,0,0.60)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="box-none"
      >
        <SafeAreaView style={styles.topControls} edges={['top']} pointerEvents="box-none">
          <Pressable
            style={styles.controlBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Close AR try-on"
          >
            <Ionicons name="close" size={20} color={Colors.textOnPrimary} />
          </Pressable>
          <Text style={styles.instructions}>
            Point camera at your hand or neck
          </Text>
          <Pressable
            style={styles.controlBtn}
            onPress={() => setFrontCamera(!frontCamera)}
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
          >
            <Ionicons name="camera-reverse-outline" size={20} color={Colors.textOnPrimary} />
          </Pressable>
        </SafeAreaView>
      </LinearGradient>

      {/* Bottom gradient + controls */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.70)']}
        style={styles.bottomGradient}
        pointerEvents="box-none"
      >
        <SafeAreaView style={styles.bottomControls} edges={['bottom']} pointerEvents="box-none">
          {product && (
            <View style={styles.productThumb}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.thumbImage}
                resizeMode="cover"
                accessibilityLabel={`Trying on: ${product.name}`}
              />
            </View>
          )}

          {/* Premium iOS shutter — outer ring + inner fill */}
          <Pressable
            style={({ pressed }) => [styles.captureBtn, pressed && { opacity: 0.85 }]}
            onPress={handleCapture}
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
          >
            <View style={styles.captureInner} />
          </Pressable>

          <Pressable
            style={styles.tryAnotherBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Try another item"
          >
            <Text style={styles.tryAnotherText}>Try Another</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  // ── Camera placeholder ────────────────────────────────────────────────────────
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    gap: 12,
  },
  placeholderText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
  },
  productName: {
    ...Typography.titleLarge,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginTop: 8,
  },

  // ── Captured state ────────────────────────────────────────────────────────────
  capturedBg: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedLabel: {
    ...Typography.headlineMedium,
    color: 'rgba(255,255,255,0.4)',
  },

  // ── Top gradient + controls ───────────────────────────────────────────────────
  topGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 160,
    zIndex: 10,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  instructions: {
    fontFamily: SerifFonts.sans,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
    // subtle text shadow for legibility over any background
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  controlBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom gradient + controls ────────────────────────────────────────────────
  bottomGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 200,
    zIndex: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    // push controls to the bottom of the gradient
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
  },

  productThumb: {
    width: 52, height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  thumbImage: { width: '100%', height: '100%' },

  // Premium iOS shutter: outer white ring, inner solid white circle
  captureBtn: {
    width: 70, height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },

  tryAnotherBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tryAnotherText: {
    fontFamily: SerifFonts.sans,
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // ── Captured result ───────────────────────────────────────────────────────────
  retakeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  retakeText: {
    fontFamily: SerifFonts.sans,
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  addToCartFab: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  addToCartText: {
    fontFamily: SerifFonts.sans,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

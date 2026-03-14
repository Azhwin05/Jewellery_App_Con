import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, visible, onHide, duration = 3000 }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity, bottom: (insets.bottom || 16) + 83 + 8 },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '80%',
    zIndex: 9999,
  },
  text: {
    ...Typography.bodyMedium,
    color: Colors.textOnPrimary,
  },
});

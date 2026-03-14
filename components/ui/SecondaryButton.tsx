import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const SecondaryButton = React.memo(function SecondaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  danger = false,
  style,
  accessibilityLabel,
}: SecondaryButtonProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const borderColor = danger ? Colors.error : Colors.primary;
  const textColor = danger ? Colors.error : Colors.primary;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { borderColor },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...Typography.labelLarge,
    fontWeight: '700',
  },
});

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
import { Layout } from '../../constants/spacing';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const PrimaryButton = React.memo(function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textOnGold} size="small" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: Layout.buttonHeight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
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
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});

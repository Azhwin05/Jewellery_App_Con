import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/spacing';

interface CategoryChipProps {
  label: string;
  active: boolean;
  onPress: (label: string) => void;
}

export const CategoryChip = React.memo(function CategoryChip({
  label,
  active,
  onPress,
}: CategoryChipProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(label);
  }, [label, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${label} category${active ? ', selected' : ''}`}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.chip, active ? styles.active : styles.inactive, pressed && styles.pressed]}
    >
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  chip: {
    height: Layout.chipHeight,
    borderRadius: Layout.chipRadius,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  active: {
    backgroundColor: '#1A1A2E',
  },
  inactive: {
    backgroundColor: '#F4F4F8',
  },
  text: {
    ...Typography.labelLarge,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactiveText: {
    color: '#8E8E93',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/spacing';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// Outline-style icon per category — monochromatic, line-art only
const CATEGORY_ICONS: Record<string, IoniconName> = {
  Diamond:   'diamond-outline',
  Gold:      'sparkles-outline',
  Silver:    'moon-outline',
  Rings:     'radio-button-off-outline',
  Necklaces: 'link-outline',
  Earrings:  'ellipse-outline',
  Bracelets: 'git-branch-outline',
};

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

  const iconName = CATEGORY_ICONS[label];
  const iconColor = active ? '#FFFFFF' : '#8E8E93';

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${label} category${active ? ', selected' : ''}`}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.chip, active ? styles.active : styles.inactive, pressed && styles.pressed]}
    >
      <View style={styles.inner}>
        {iconName && (
          <Ionicons name={iconName} size={14} color={iconColor} />
        )}
        <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
          {label}
        </Text>
      </View>
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
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

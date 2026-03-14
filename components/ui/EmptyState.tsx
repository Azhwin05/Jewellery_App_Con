import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';
import { SerifFonts } from '../../constants/typography';

interface EmptyStateProps {
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  style?: ViewStyle;
}

export const EmptyState = React.memo(function EmptyState({
  iconName = 'diamond-outline',
  title,
  subtitle,
  ctaLabel,
  onCta,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Oversized ultra-thin icon — no background circle */}
      <Ionicons name={iconName} size={80} color="#D1D1D6" />

      <Text style={styles.title}>{title}</Text>

      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {ctaLabel && onCta && (
        <PrimaryButton
          label={ctaLabel}
          onPress={onCta}
          style={styles.cta}
          accessibilityLabel={ctaLabel}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: SerifFonts.serif,
    fontSize: 20,
    color: '#1A1A2E',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontFamily: SerifFonts.sans,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    paddingHorizontal: 40,
  },
  cta: {
    marginTop: 32,
    paddingHorizontal: 40,
  },
});

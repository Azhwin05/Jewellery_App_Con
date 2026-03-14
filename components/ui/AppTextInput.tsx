import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/spacing';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  function AppTextInput({ label, error, containerStyle, style, ...props }, ref) {
    const [focused, setFocused] = useState(false);

    const borderColor = error
      ? Colors.error
      : focused
      ? Colors.primary
      : Colors.border;
    const borderWidth = focused || error ? 2 : 1;

    return (
      <View style={containerStyle}>
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
        <TextInput
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={Colors.textSecondary}
          style={[
            styles.input,
            { borderColor, borderWidth },
            style,
          ]}
          {...props}
        />
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    ...Typography.labelLarge,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    height: Layout.inputHeight,
    borderRadius: Layout.inputRadius,
    paddingHorizontal: 16,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  error: {
    ...Typography.labelMedium,
    color: Colors.error,
    marginTop: 4,
  },
});

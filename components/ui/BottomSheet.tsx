import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  heightPercent?: number;
  children: React.ReactNode;
}

export function BottomSheet({
  visible,
  onClose,
  heightPercent = 60,
  children,
}: BottomSheetProps) {
  const sheetHeight = (SCREEN_HEIGHT * heightPercent) / 100;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const insets = useSafeAreaInsets();

  const open = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [translateY]);

  const close = useCallback(() => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  }, [translateY, sheetHeight, onClose]);

  useEffect(() => {
    if (visible) open();
  }, [visible, open]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > sheetHeight * 0.3) {
          close();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <Animated.View
        style={[
          styles.sheet,
          { height: sheetHeight, paddingBottom: insets.bottom },
          { transform: [{ translateY }] },
        ]}
      >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
        </View>
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
  },
});

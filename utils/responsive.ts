import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export function getScreenDimensions() {
  return Dimensions.get('window');
}

/**
 * Returns true if the device is a tablet (iPad or Android tablet).
 * Threshold: width >= 768dp
 */
export function isTablet(): boolean {
  const dim = Dimensions.get('window');
  return dim.width >= 768;
}

/**
 * Returns true if the device is in landscape orientation.
 */
export function isLandscape(): boolean {
  const dim = Dimensions.get('window');
  return dim.width > dim.height;
}

/**
 * Returns the appropriate horizontal screen padding.
 */
export function getScreenPaddingH(): number {
  if (isTablet()) {
    return isLandscape() ? 32 : 24;
  }
  return 16;
}

/**
 * Number of columns for product grid.
 */
export function getProductGridColumns(): number {
  return isTablet() ? 3 : 2;
}

export const screenWidth = width;
export const screenHeight = height;

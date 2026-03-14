/**
 * Ambient shadow system — soft, luxurious, never harsh
 */
import { ViewStyle } from 'react-native';

export const Shadows = {
  /** Standard card lift */
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  } satisfies ViewStyle,

  /** Floating elements: FAB, bottom sheets */
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  } satisfies ViewStyle,

  /** Primary-colored shadow on purple buttons/FAB */
  primaryBtn: {
    shadowColor: '#5C40C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  } satisfies ViewStyle,

  /** Tab bar — upward */
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 12,
  } satisfies ViewStyle,
};

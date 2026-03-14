// 8dp base grid — all values are multiples of 4dp
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const Layout = {
  screenPaddingH: 16,       // horizontal margin for phones
  screenPaddingHTablet: 24, // horizontal margin for tablets
  screenPaddingHTabletLandscape: 32,
  maxContentWidth: 600,
  cardPadding: 16,
  cardGap: 12,
  cardRadius: 16,
  buttonHeight: 52,
  buttonSecondaryHeight: 44,
  inputHeight: 52,
  inputRadius: 10,
  chipHeight: 36,
  chipRadius: 20,
  fabSize: 56,
  fabRadius: 16,
  bottomSheetRadius: 20,
  navBarHeight: 44,
  tabBarHeight: 83,
  touchTarget: 44,
} as const;

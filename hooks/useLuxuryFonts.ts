/**
 * Loads Playfair Display from @expo-google-fonts.
 * Call once in the root _layout.tsx before rendering.
 *
 * Install: npm install @expo-google-fonts/playfair-display
 */
import {
  useFonts,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

export function useLuxuryFonts() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  return fontsLoaded;
}

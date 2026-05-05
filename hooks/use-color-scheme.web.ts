import { useThemeContext } from "@/lib/theme-provider";

/**
 * Web version: uses ThemeContext to get the user-selected color scheme
 * (same as native version now that we have ThemeProvider managing state)
 */
export function useColorScheme() {
  return useThemeContext().colorScheme;
}

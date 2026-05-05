import { Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";

export default function SettingsScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();

  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <ScreenContainer className="px-5 pt-4">
      <Text className="text-3xl font-bold text-foreground tracking-tight mb-8">設定</Text>

      {/* Theme Toggle */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: `${colors.primary}12`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol
                name={isDark ? "moon.fill" : "sun.max.fill"}
                size={22}
                color={colors.primary}
              />
            </View>
            <View className="ml-3">
              <Text className="text-base font-medium text-foreground">外観モード</Text>
              <Text className="text-sm text-muted mt-0.5">
                {isDark ? "ダークモード" : "ライトモード"}
              </Text>
            </View>
          </View>

          {/* Toggle Switch */}
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              {
                width: 52,
                height: 30,
                borderRadius: 15,
                backgroundColor: isDark ? colors.primary : colors.border,
                justifyContent: "center",
                paddingHorizontal: 3,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                alignSelf: isDark ? "flex-end" : "flex-start",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2,
              }}
            />
          </Pressable>
        </View>
      </View>

      {/* App info */}
      <View className="items-center mt-auto mb-8">
        <Text className="text-sm text-muted">Spilio v1.0.0</Text>
      </View>
    </ScreenContainer>
  );
}

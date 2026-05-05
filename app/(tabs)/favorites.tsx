import { Text, View, FlatList, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import * as Speech from "expo-speech";

export default function FavoritesScreen() {
  const colors = useColors();
  const { state, removeFavorite } = useStore();

  const speakText = (text: string) => {
    Speech.speak(text, { language: "en-US", rate: 0.85 });
  };

  const handleDelete = (id: string, text: string) => {
    Alert.alert(
      "削除確認",
      `この表現をお気に入りから削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        { text: "削除", style: "destructive", onPress: () => removeFavorite(id) },
      ]
    );
  };

  return (
    <ScreenContainer className="px-5 pt-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-foreground tracking-tight">My Favorites</Text>
        <Text className="text-sm text-muted mt-1">お気に入りの表現コレクション</Text>
      </View>

      {state.favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: `${colors.primary}12`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconSymbol name="heart.fill" size={36} color={colors.border} />
          </View>
          <Text className="text-lg font-semibold text-muted text-center">
            まだお気に入りがありません
          </Text>
          <Text className="text-sm text-muted mt-2 text-center leading-relaxed">
            日記の結果画面から{"\n"}気に入った表現を保存できます
          </Text>
        </View>
      ) : (
        <FlatList
          data={state.favorites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-base font-medium text-foreground leading-relaxed mb-1">
                    {item.english}
                  </Text>
                  <Text className="text-sm text-muted leading-relaxed">{item.japanese}</Text>
                </View>
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => speakText(item.english)}
                    style={({ pressed }) => [
                      {
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: `${colors.primary}12`,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="speaker.wave.2.fill" size={18} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item.id, item.english)}
                    style={({ pressed }) => [
                      {
                        padding: 10,
                        borderRadius: 10,
                        marginLeft: 6,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="trash.fill" size={16} color={colors.muted} />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

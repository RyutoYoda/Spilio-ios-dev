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
      `「${text}」をお気に入りから削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        { text: "削除", style: "destructive", onPress: () => removeFavorite(id) },
      ]
    );
  };

  return (
    <ScreenContainer className="px-5 pt-4">
      <Text className="text-2xl font-bold text-foreground mb-2">My Favorites</Text>
      <Text className="text-sm text-muted mb-6">お気に入りの表現コレクション</Text>

      {state.favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <IconSymbol name="heart.fill" size={64} color={colors.border} />
          <Text className="text-lg font-semibold text-muted mt-4 text-center">
            まだお気に入りがありません
          </Text>
          <Text className="text-sm text-muted mt-2 text-center">
            日記の結果画面から{"\n"}気に入った表現を保存できます
          </Text>
        </View>
      ) : (
        <FlatList
          data={state.favorites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              className="bg-surface rounded-xl p-4 mb-3 border border-border"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-base font-medium text-foreground mb-1">
                    {item.english}
                  </Text>
                  <Text className="text-sm text-muted">{item.japanese}</Text>
                  {item.note ? (
                    <Text className="text-xs text-muted mt-1 italic">{item.note}</Text>
                  ) : null}
                </View>
                <View className="flex-row items-center gap-1">
                  <Pressable
                    onPress={() => speakText(item.english)}
                    style={({ pressed }) => [
                      {
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: `${colors.primary}15`,
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
                        padding: 8,
                        borderRadius: 8,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="trash.fill" size={18} color={colors.error} />
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

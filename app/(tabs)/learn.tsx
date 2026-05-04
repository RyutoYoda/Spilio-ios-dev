import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { categories } from "@/data/content";
import { useProgress } from "@/lib/progress-context";

export default function LearnScreen() {
  const router = useRouter();
  const { state } = useProgress();

  const getCategoryCompletedCount = (categoryId: string) => {
    return Object.entries(state.lessons).filter(
      ([key, val]) => key.startsWith(`${categoryId}:`) && val.completed
    ).length;
  };

  return (
    <ScreenContainer className="px-4 pt-4">
      <Text className="text-2xl font-bold text-foreground mb-2">学習</Text>
      <Text className="text-sm text-muted mb-4">カテゴリを選んでレッスンを始めましょう</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const completed = getCategoryCompletedCount(item.id);
          const total = item.lessons.length;
          const progress = total > 0 ? completed / total : 0;

          return (
            <TouchableOpacity
              className="bg-surface rounded-2xl p-4 mb-3 border border-border"
              activeOpacity={0.7}
              onPress={() => router.push(`/learn/${item.id}` as any)}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-3">{item.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{item.titleJa}</Text>
                  <Text className="text-xs text-muted">{item.title} · {total}レッスン</Text>
                </View>
                <Text className="text-xs text-muted">{completed}/{total}</Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: `${progress * 100}%`, backgroundColor: item.color }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </ScreenContainer>
  );
}

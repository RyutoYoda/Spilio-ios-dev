import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { categories } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function CategoryLessonsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const colors = useColors();
  const { state } = useProgress();

  const category = categories.find((c) => c.id === categoryId);
  if (!category) {
    return (
      <ScreenContainer className="p-4">
        <Text className="text-foreground">カテゴリが見つかりません</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-4 pt-4">
      <TouchableOpacity
        className="flex-row items-center mb-4"
        activeOpacity={0.7}
        onPress={() => router.back()}
      >
        <IconSymbol name="arrow.left" size={20} color={colors.primary} />
        <Text className="text-primary ml-1 text-sm">戻る</Text>
      </TouchableOpacity>

      <View className="flex-row items-center mb-4">
        <Text className="text-3xl mr-3">{category.icon}</Text>
        <View>
          <Text className="text-xl font-bold text-foreground">{category.titleJa}</Text>
          <Text className="text-sm text-muted">{category.title}</Text>
        </View>
      </View>

      <FlatList
        data={category.lessons}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const key = `${categoryId}:${item.id}`;
          const lessonProgress = state.lessons[key];
          const isCompleted = lessonProgress?.completed;

          return (
            <TouchableOpacity
              className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push(`/learn/${categoryId}/${item.id}` as any)}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: isCompleted ? colors.success : colors.border }}
              >
                {isCompleted ? (
                  <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
                ) : (
                  <Text className="text-xs font-bold text-foreground">{index + 1}</Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">{item.titleJa}</Text>
                <Text className="text-xs text-muted">{item.title}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>
          );
        }}
      />
    </ScreenContainer>
  );
}

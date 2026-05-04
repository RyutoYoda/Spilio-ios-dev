import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { categories } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function LessonDetailScreen() {
  const { categoryId, lessonId } = useLocalSearchParams<{ categoryId: string; lessonId: string }>();
  const router = useRouter();
  const colors = useColors();
  const { completeLesson, state } = useProgress();

  const category = categories.find((c) => c.id === categoryId);
  const lesson = category?.lessons.find((l) => l.id === lessonId);

  if (!category || !lesson) {
    return (
      <ScreenContainer className="p-4">
        <Text className="text-foreground">レッスンが見つかりません</Text>
      </ScreenContainer>
    );
  }

  const key = `${categoryId}:${lessonId}`;
  const isCompleted = state.lessons[key]?.completed;

  const handleComplete = () => {
    completeLesson(categoryId!, lessonId!, 100);
    router.back();
  };

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="mb-4">
          <Text className="text-xs text-muted mb-1">{category.titleJa}</Text>
          <Text className="text-2xl font-bold text-foreground">{lesson.titleJa}</Text>
          <Text className="text-sm text-muted">{lesson.title}</Text>
        </View>

        {/* Explanation */}
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-2">解説</Text>
          <Text className="text-sm text-foreground leading-6">{lesson.explanation}</Text>
        </View>

        {/* Key Points */}
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-2">ポイント</Text>
          {lesson.keyPoints.map((point, idx) => (
            <View key={idx} className="flex-row mb-2">
              <Text className="text-primary mr-2 text-sm">•</Text>
              <Text className="text-sm text-foreground flex-1 leading-5">{point}</Text>
            </View>
          ))}
        </View>

        {/* Examples */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-foreground mb-3">例文</Text>
          {lesson.examples.map((example, idx) => (
            <View key={idx} className="bg-surface rounded-xl p-4 mb-3 border border-border">
              <Text className="text-base font-medium text-foreground mb-1">{example.en}</Text>
              <Text className="text-sm text-muted mb-1">{example.ja}</Text>
              {example.note && (
                <View className="bg-primary/10 rounded-lg px-2 py-1 self-start mt-1">
                  <Text className="text-xs text-primary">{example.note}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Complete Button */}
        {!isCompleted ? (
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center"
            activeOpacity={0.8}
            onPress={handleComplete}
          >
            <Text className="text-white font-semibold text-base">レッスン完了</Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-success/20 rounded-xl py-4 items-center flex-row justify-center">
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
            <Text className="text-success font-semibold text-base ml-2">完了済み</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

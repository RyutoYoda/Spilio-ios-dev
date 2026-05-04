import { Text, View, ScrollView } from "react-native";
import { useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useProgress } from "@/lib/progress-context";
import { categories } from "@/data/content";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ProgressScreen() {
  const colors = useColors();
  const { state } = useProgress();

  const stats = useMemo(() => {
    const totalLessons = categories.reduce((sum, cat) => sum + cat.lessons.length, 0);
    const completedLessons = Object.values(state.lessons).filter((l) => l.completed).length;
    const totalQuizzes = state.quizResults.length;
    const correctQuizzes = state.quizResults.filter((r) => r.score > 0).length;
    const accuracy = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;
    const flashcardsKnown = state.flashcards.known.length;
    const flashcardsTotal = state.flashcards.known.length + state.flashcards.unknown.length;

    // Quiz type breakdown
    const quizByType = {
      quiz: state.quizResults.filter((r) => r.type === "quiz"),
      fill: state.quizResults.filter((r) => r.type === "fill"),
      reorder: state.quizResults.filter((r) => r.type === "reorder"),
      writing: state.quizResults.filter((r) => r.type === "writing"),
    };

    const typeAccuracy = (type: keyof typeof quizByType) => {
      const results = quizByType[type];
      if (results.length === 0) return 0;
      const correct = results.filter((r) => r.score > 0).length;
      return Math.round((correct / results.length) * 100);
    };

    // Weak categories
    const categoryAccuracy = categories.map((cat) => {
      const catResults = state.quizResults.filter((r) => r.categoryId === cat.id);
      const correct = catResults.filter((r) => r.score > 0).length;
      const acc = catResults.length > 0 ? Math.round((correct / catResults.length) * 100) : -1;
      return { ...cat, accuracy: acc, attempts: catResults.length };
    });

    return {
      totalLessons,
      completedLessons,
      totalQuizzes,
      accuracy,
      flashcardsKnown,
      flashcardsTotal,
      typeAccuracy,
      categoryAccuracy,
    };
  }, [state]);

  return (
    <ScreenContainer className="px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="text-2xl font-bold text-foreground mb-2">進捗</Text>
        <Text className="text-sm text-muted mb-6">学習の成果を確認しましょう</Text>

        {/* Overview Cards */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="w-[47%] bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="flame.fill" size={20} color={colors.warning} />
            <Text className="text-2xl font-bold text-foreground mt-2">{state.streak}日</Text>
            <Text className="text-xs text-muted">連続学習</Text>
          </View>
          <View className="w-[47%] bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="star.fill" size={20} color={colors.primary} />
            <Text className="text-2xl font-bold text-foreground mt-2">{state.totalStudyDays}日</Text>
            <Text className="text-xs text-muted">総学習日数</Text>
          </View>
          <View className="w-[47%] bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
            <Text className="text-2xl font-bold text-foreground mt-2">{stats.completedLessons}/{stats.totalLessons}</Text>
            <Text className="text-xs text-muted">レッスン完了</Text>
          </View>
          <View className="w-[47%] bg-surface rounded-xl p-4 border border-border">
            <IconSymbol name="pencil.and.outline" size={20} color={"#7C3AED"} />
            <Text className="text-2xl font-bold text-foreground mt-2">{stats.totalQuizzes}問</Text>
            <Text className="text-xs text-muted">回答数</Text>
          </View>
        </View>

        {/* Accuracy by Type */}
        <Text className="text-base font-semibold text-foreground mb-3">問題タイプ別正答率</Text>
        <View className="bg-surface rounded-xl p-4 mb-6 border border-border">
          {[
            { label: "4択クイズ", type: "quiz" as const, color: "#2563EB" },
            { label: "穴埋め", type: "fill" as const, color: "#7C3AED" },
            { label: "並べ替え", type: "reorder" as const, color: "#059669" },
            { label: "英作文", type: "writing" as const, color: "#D97706" },
          ].map((item) => {
            const acc = stats.typeAccuracy(item.type);
            return (
              <View key={item.type} className="mb-3 last:mb-0">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm text-foreground">{item.label}</Text>
                  <Text className="text-xs text-muted">{acc}%</Text>
                </View>
                <View className="h-2 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${acc}%`, backgroundColor: item.color }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Category Progress */}
        <Text className="text-base font-semibold text-foreground mb-3">カテゴリ別習熟度</Text>
        <View className="bg-surface rounded-xl p-4 mb-6 border border-border">
          {stats.categoryAccuracy.map((cat) => (
            <View key={cat.id} className="flex-row items-center mb-3 last:mb-0">
              <Text className="text-lg mr-2">{cat.icon}</Text>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm text-foreground">{cat.titleJa}</Text>
                  <Text className="text-xs text-muted">
                    {cat.accuracy >= 0 ? `${cat.accuracy}%` : "未挑戦"}
                  </Text>
                </View>
                <View className="h-2 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.accuracy >= 0 ? cat.accuracy : 0}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Flashcard Stats */}
        <Text className="text-base font-semibold text-foreground mb-3">フラッシュカード</Text>
        <View className="bg-surface rounded-xl p-4 border border-border">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-foreground">覚えたカード</Text>
            <Text className="text-sm font-semibold text-success">{stats.flashcardsKnown}枚</Text>
          </View>
          {stats.flashcardsTotal > 0 && (
            <View className="h-2 bg-border rounded-full overflow-hidden mt-2">
              <View
                className="h-full rounded-full bg-success"
                style={{ width: `${(stats.flashcardsKnown / stats.flashcardsTotal) * 100}%` }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

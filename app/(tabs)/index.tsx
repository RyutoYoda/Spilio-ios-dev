import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useProgress } from "@/lib/progress-context";
import { categories } from "@/data/content";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useMemo } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { state, updateStreak } = useProgress();

  useEffect(() => {
    updateStreak();
  }, []);

  const stats = useMemo(() => {
    const totalLessons = categories.reduce((sum, cat) => sum + cat.lessons.length, 0);
    const completedLessons = Object.values(state.lessons).filter((l) => l.completed).length;
    const totalQuizzes = state.quizResults.length;
    const correctQuizzes = state.quizResults.filter((r) => r.score > 0).length;
    const accuracy = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;
    const flashcardsKnown = state.flashcards.known.length;

    return { totalLessons, completedLessons, totalQuizzes, accuracy, flashcardsKnown };
  }, [state]);

  const progressPercent = stats.totalLessons > 0
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0;

  return (
    <ScreenContainer className="px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">EnglishMaster</Text>
          <Text className="text-sm text-muted">毎日の学習で英語力を伸ばそう</Text>
        </View>

        {/* Streak & Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
            <IconSymbol name="flame.fill" size={24} color={colors.warning} />
            <Text className="text-2xl font-bold text-foreground mt-1">{state.streak}</Text>
            <Text className="text-xs text-muted">連続日数</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
            <IconSymbol name="star.fill" size={24} color={colors.primary} />
            <Text className="text-2xl font-bold text-foreground mt-1">{stats.accuracy}%</Text>
            <Text className="text-xs text-muted">正答率</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text className="text-2xl font-bold text-foreground mt-1">{stats.completedLessons}</Text>
            <Text className="text-xs text-muted">完了レッスン</Text>
          </View>
        </View>

        {/* Overall Progress */}
        <View className="bg-surface rounded-xl p-4 mb-6 border border-border">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-foreground">全体の進捗</Text>
            <Text className="text-sm text-primary font-semibold">{progressPercent}%</Text>
          </View>
          <View className="h-3 bg-border rounded-full overflow-hidden">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="text-xs text-muted mt-2">
            {stats.completedLessons} / {stats.totalLessons} レッスン完了
          </Text>
        </View>

        {/* Quick Actions */}
        <Text className="text-base font-semibold text-foreground mb-3">クイックスタート</Text>
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 bg-primary rounded-xl p-4 items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/learn")}
          >
            <Text className="text-white text-2xl mb-1">📖</Text>
            <Text className="text-white font-medium text-sm">レッスン</Text>
            <Text className="text-white/70 text-xs">インプット</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-secondary rounded-xl p-4 items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/flashcards" as any)}
          >
            <Text className="text-white text-2xl mb-1">🃏</Text>
            <Text className="text-white font-medium text-sm">カード</Text>
            <Text className="text-white/70 text-xs">インプット</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-success rounded-xl p-4 items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/practice")}
          >
            <Text className="text-white text-2xl mb-1">✍️</Text>
            <Text className="text-white font-medium text-sm">練習</Text>
            <Text className="text-white/70 text-xs">アウトプット</Text>
          </TouchableOpacity>
        </View>

        {/* Category Progress */}
        <Text className="text-base font-semibold text-foreground mb-3">カテゴリ別進捗</Text>
        {categories.map((cat) => {
          const catLessons = Object.entries(state.lessons).filter(
            ([key]) => key.startsWith(`${cat.id}:`)
          );
          const completed = catLessons.filter(([, v]) => v.completed).length;
          const total = cat.lessons.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <TouchableOpacity
              key={cat.id}
              className="bg-surface rounded-xl p-3 mb-2 border border-border flex-row items-center"
              activeOpacity={0.7}
              onPress={() => router.push(`/learn/${cat.id}` as any)}
            >
              <Text className="text-lg mr-3">{cat.icon}</Text>
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-medium text-foreground">{cat.titleJa}</Text>
                  <Text className="text-xs text-muted">{pct}%</Text>
                </View>
                <View className="h-1.5 bg-border rounded-full overflow-hidden mt-1">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

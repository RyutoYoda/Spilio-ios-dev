import { Text, View, Pressable } from "react-native";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import * as Speech from "expo-speech";

export default function ReviewScreen() {
  const colors = useColors();
  const { state, markMastered } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const unreviewedQuestions = useMemo(
    () => state.reviewQuestions.filter((q) => !q.mastered),
    [state.reviewQuestions]
  );

  const currentQuestion = unreviewedQuestions[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    if (currentIndex < unreviewedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    setShowAnswer(true);
  };

  const handleMastered = () => {
    if (currentQuestion) {
      markMastered(currentQuestion.id);
      setShowAnswer(false);
      setSelectedOption(null);
      if (currentIndex >= unreviewedQuestions.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  const speakText = (text: string) => {
    Speech.speak(text, { language: "en-US", rate: 0.85 });
  };

  if (unreviewedQuestions.length === 0) {
    return (
      <ScreenContainer className="px-5 pt-4">
        <Text className="text-2xl font-bold text-foreground mb-2">復習</Text>
        <View className="flex-1 items-center justify-center">
          <IconSymbol name="checkmark.circle.fill" size={64} color={colors.success} />
          <Text className="text-lg font-semibold text-foreground mt-4 text-center">
            {state.entries.length === 0
              ? "まず日記を録音しよう！"
              : "復習する問題がありません"}
          </Text>
          <Text className="text-sm text-muted mt-2 text-center">
            {state.entries.length === 0
              ? "日記タブからマイクボタンを押して\n英語で今日のことを話してみましょう"
              : "すべての表現をマスターしました！\n新しい日記を録音すると問題が追加されます"}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-5 pt-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-foreground">復習</Text>
        <Text className="text-sm text-muted">
          {currentIndex + 1} / {unreviewedQuestions.length}
        </Text>
      </View>

      {/* Question Card */}
      <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
        <Text className="text-sm text-muted mb-2">この表現を正しく言い換えると？</Text>
        <View className="flex-row items-center">
          <Text className="text-lg text-foreground flex-1" style={{ color: colors.error }}>
            {currentQuestion.original}
          </Text>
          <Pressable
            onPress={() => speakText(currentQuestion.original)}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
          >
            <IconSymbol name="speaker.wave.2.fill" size={22} color={colors.muted} />
          </Pressable>
        </View>
      </View>

      {/* Answer options */}
      {!showAnswer ? (
        <View className="gap-3">
          <Pressable
            onPress={() => handleAnswer(currentQuestion.correct)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-foreground text-base">答えを見る</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          {/* Correct answer */}
          <View
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: `${colors.success}15`, borderWidth: 1, borderColor: colors.success }}
          >
            <Text className="text-sm font-medium mb-1" style={{ color: colors.success }}>
              正しい表現
            </Text>
            <View className="flex-row items-center">
              <Text className="text-lg text-foreground flex-1">{currentQuestion.correct}</Text>
              <Pressable
                onPress={() => speakText(currentQuestion.correct)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
              >
                <IconSymbol name="speaker.wave.2.fill" size={22} color={colors.success} />
              </Pressable>
            </View>
            {currentQuestion.explanation ? (
              <Text className="text-sm text-muted mt-2">{currentQuestion.explanation}</Text>
            ) : null}
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleMastered}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.success,
                  borderRadius: 12,
                  padding: 14,
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold">覚えた</Text>
            </Pressable>
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-foreground font-semibold">次へ</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

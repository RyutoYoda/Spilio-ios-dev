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

  const unreviewedQuestions = useMemo(
    () => state.reviewQuestions.filter((q) => !q.mastered),
    [state.reviewQuestions]
  );

  const currentQuestion = unreviewedQuestions[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < unreviewedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleMastered = () => {
    if (currentQuestion) {
      markMastered(currentQuestion.id);
      setShowAnswer(false);
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

      {/* Question Card - Full Sentence */}
      <View className="bg-surface rounded-2xl p-6 border border-border mb-4">
        <Text className="text-sm text-muted mb-3">この文の間違いを直すと？</Text>

        {/* Show full original sentence with error highlighted */}
        {currentQuestion.originalSentence ? (
          <View className="mb-3">
            <View className="flex-row items-start">
              <Text className="text-base text-foreground leading-relaxed flex-1">
                {currentQuestion.originalSentence}
              </Text>
              <Pressable
                onPress={() => speakText(currentQuestion.originalSentence || currentQuestion.original)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
              >
                <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.muted} />
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Highlight the specific error */}
        <View className="bg-background rounded-lg p-3 mt-1">
          <Text className="text-xs text-muted mb-1">間違い箇所</Text>
          <Text className="text-base" style={{ color: colors.error }}>
            {currentQuestion.original}
          </Text>
        </View>
      </View>

      {/* Answer section */}
      {!showAnswer ? (
        <Pressable
          onPress={() => setShowAnswer(true)}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold text-base">答えを見る</Text>
        </Pressable>
      ) : (
        <View>
          {/* Corrected full sentence */}
          {currentQuestion.correctedSentence ? (
            <View
              className="rounded-2xl p-5 mb-3"
              style={{ backgroundColor: `${colors.success}15`, borderWidth: 1.5, borderColor: colors.success }}
            >
              <Text className="text-sm font-medium mb-2" style={{ color: colors.success }}>
                正しい全文
              </Text>
              <View className="flex-row items-start">
                <Text className="text-base text-foreground flex-1 leading-relaxed">
                  {currentQuestion.correctedSentence}
                </Text>
                <Pressable
                  onPress={() => speakText(currentQuestion.correctedSentence || currentQuestion.correct)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
                >
                  <IconSymbol name="speaker.wave.2.fill" size={22} color={colors.success} />
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Specific correction point */}
          <View className="bg-surface rounded-xl p-4 border border-border mb-4">
            <Text className="text-xs text-muted mb-2">修正ポイント</Text>
            <View className="flex-row items-center mb-1">
              <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
              <Text className="text-sm ml-2" style={{ color: colors.error, textDecorationLine: "line-through" }}>
                {currentQuestion.original}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
              <Text className="text-sm ml-2" style={{ color: colors.success }}>
                {currentQuestion.correct}
              </Text>
            </View>
            {currentQuestion.explanation ? (
              <Text className="text-sm text-muted">{currentQuestion.explanation}</Text>
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

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
        <Text className="text-3xl font-bold text-foreground tracking-tight mb-2">復習</Text>
        <View className="flex-1 items-center justify-center">
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: `${colors.success}18`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <IconSymbol name="checkmark.circle.fill" size={44} color={colors.success} />
          </View>
          <Text className="text-lg font-semibold text-foreground text-center">
            {state.entries.length === 0
              ? "まず日記を録音しよう"
              : "すべてマスターしました"}
          </Text>
          <Text className="text-sm text-muted mt-2 text-center leading-relaxed">
            {state.entries.length === 0
              ? "日記タブからマイクボタンを押して\n英語で今日のことを話してみましょう"
              : "新しい日記を録音すると\n問題が追加されます"}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-5 pt-4">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-3xl font-bold text-foreground tracking-tight">復習</Text>
        <View
          style={{
            backgroundColor: `${colors.primary}15`,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
            {currentIndex + 1} / {unreviewedQuestions.length}
          </Text>
        </View>
      </View>

      {/* Question Card */}
      <View
        className="rounded-2xl p-6 mb-5"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text className="text-xs font-medium text-muted uppercase tracking-wider mb-4">
          この文の間違いを直すと？
        </Text>

        {/* Full original sentence */}
        {currentQuestion.originalSentence ? (
          <View className="mb-4">
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

        {/* Error highlight */}
        <View
          style={{
            backgroundColor: `${colors.error}10`,
            borderRadius: 10,
            padding: 12,
            borderLeftWidth: 3,
            borderLeftColor: colors.error,
          }}
        >
          <Text className="text-xs text-muted mb-1">間違い箇所</Text>
          <Text className="text-base font-medium" style={{ color: colors.error }}>
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
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 6,
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
              className="rounded-2xl p-5 mb-4"
              style={{
                backgroundColor: `${colors.success}08`,
                borderWidth: 1.5,
                borderColor: `${colors.success}50`,
              }}
            >
              <Text className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: colors.success }}>
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

          {/* Correction detail */}
          <View
            className="rounded-xl p-4 mb-5"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          >
            <Text className="text-xs text-muted mb-3 uppercase tracking-wider">修正ポイント</Text>
            <View className="flex-row items-center mb-2">
              <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
              <Text className="text-sm ml-2" style={{ color: colors.error, textDecorationLine: "line-through" }}>
                {currentQuestion.original}
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
              <Text className="text-sm ml-2" style={{ color: colors.success }}>
                {currentQuestion.correct}
              </Text>
            </View>
            {currentQuestion.explanation ? (
              <Text className="text-sm text-muted leading-relaxed">{currentQuestion.explanation}</Text>
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
                  borderRadius: 14,
                  padding: 15,
                  alignItems: "center",
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
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
                  borderRadius: 14,
                  padding: 15,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
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

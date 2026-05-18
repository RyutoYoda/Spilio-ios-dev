import { Text, View, Pressable, TextInput, Platform } from "react-native";
import { useState, useMemo, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";

type QuizMode = "fill-blank" | "show-answer";

export default function ReviewScreen() {
  const colors = useColors();
  const { state, markReviewed, markMastered } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<QuizMode>("fill-blank");
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Filter questions that need more review (not mastered = reviewed < 6 times)
  const activeQuestions = useMemo(
    () => state.reviewQuestions.filter((q) => !q.mastered),
    [state.reviewQuestions]
  );

  const currentQuestion = activeQuestions[currentIndex];

  const generateBlankSentence = useCallback((question: typeof currentQuestion) => {
    if (!question) return { sentence: "", blank: "" };

    // Use the corrected sentence and blank out the corrected part
    const sentence = question.correctedSentence || question.correct;
    const blankWord = question.correct;

    // Try to find the correct phrase in the sentence
    const lowerSentence = sentence.toLowerCase();
    const lowerBlank = blankWord.toLowerCase();
    const idx = lowerSentence.indexOf(lowerBlank);

    if (idx !== -1) {
      const before = sentence.slice(0, idx);
      const after = sentence.slice(idx + blankWord.length);
      return {
        sentence: `${before}______${after}`,
        blank: blankWord,
        before,
        after,
      };
    }

    // Fallback: show the original wrong sentence and ask for correction
    return {
      sentence: question.originalSentence || question.original,
      blank: blankWord,
      isFallback: true,
    };
  }, []);

  const handleSubmit = () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    const blankInfo = generateBlankSentence(currentQuestion);
    const correctAnswer = blankInfo.blank.toLowerCase().trim();
    const userInput = userAnswer.toLowerCase().trim();

    // Check if answer is correct (allow minor differences)
    const correct = userInput === correctAnswer ||
      userInput.replace(/[.,!?;:'"]/g, "") === correctAnswer.replace(/[.,!?;:'"]/g, "");

    setIsCorrect(correct);
    setShowResult(true);

    if (Platform.OS !== "web") {
      if (correct) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    // Mark as reviewed (increment review count)
    markReviewed(currentQuestion.id, correct);
  };

  const handleNext = () => {
    setUserAnswer("");
    setIsCorrect(null);
    setShowResult(false);
    setMode("fill-blank");
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleSkip = () => {
    setMode("show-answer");
  };

  const speakText = (text: string) => {
    Speech.speak(text, { language: "en-US", rate: 0.85 });
  };

  if (activeQuestions.length === 0) {
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

  const blankInfo = generateBlankSentence(currentQuestion);
  const reviewCount = currentQuestion?.reviewCount || 0;
  const requiredReviews = 6;
  const progressPercent = Math.min((reviewCount / requiredReviews) * 100, 100);

  return (
    <ScreenContainer className="px-5 pt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-3xl font-bold text-foreground tracking-tight">復習</Text>
        <View className="flex-row items-center gap-3">
          <View
            style={{
              backgroundColor: `${colors.primary}15`,
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 5,
            }}
          >
            <Text className="text-sm font-medium" style={{ color: colors.primary }}>
              {currentIndex + 1} / {activeQuestions.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress indicator for current question */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-xs text-muted">復習進捗</Text>
          <Text className="text-xs font-medium" style={{ color: colors.primary }}>
            {reviewCount} / {requiredReviews}回
          </Text>
        </View>
        <View
          style={{
            height: 4,
            backgroundColor: `${colors.primary}15`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: colors.primary,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {mode === "fill-blank" && !showResult ? (
        <>
          {/* Fill in the blank question */}
          <View
            className="rounded-2xl p-5 mb-5"
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
            <Text className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
              {blankInfo.isFallback ? "この文を正しく直すと？" : "空欄に入る正しい表現は？"}
            </Text>

            {/* Show the original wrong sentence */}
            {currentQuestion.originalSentence && (
              <View className="mb-3">
                <View className="flex-row items-start">
                  <View
                    style={{
                      backgroundColor: `${colors.error}10`,
                      borderRadius: 10,
                      padding: 10,
                      flex: 1,
                      borderLeftWidth: 3,
                      borderLeftColor: colors.error,
                    }}
                  >
                    <Text className="text-xs text-muted mb-1">間違い文</Text>
                    <Text className="text-sm" style={{ color: colors.error }}>
                      {currentQuestion.originalSentence}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Blank sentence */}
            <View
              style={{
                backgroundColor: `${colors.primary}08`,
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: `${colors.primary}20`,
              }}
            >
              <Text className="text-xs text-muted mb-1">
                {blankInfo.isFallback ? "正しい表現" : "正しい文（空欄を埋めよう）"}
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                {blankInfo.sentence}
              </Text>
            </View>

            {/* Hint: show the error part */}
            <View className="mt-3 flex-row items-center">
              <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
              <Text className="text-sm ml-1.5" style={{ color: colors.error, textDecorationLine: "line-through" }}>
                {currentQuestion.original}
              </Text>
            </View>
          </View>

          {/* Answer Input */}
          <View className="mb-4">
            <TextInput
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="正しい表現を入力..."
              placeholderTextColor={colors.muted}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 16,
                fontSize: 16,
                color: colors.foreground,
                borderWidth: 1.5,
                borderColor: colors.border,
              }}
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                {
                  flex: 2,
                  backgroundColor: userAnswer.trim() ? colors.primary : `${colors.primary}40`,
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                  opacity: pressed && userAnswer.trim() ? 0.85 : 1,
                  transform: [{ scale: pressed && userAnswer.trim() ? 0.98 : 1 }],
                },
              ]}
            >
              <Text className="text-white font-semibold text-base">回答する</Text>
            </Pressable>
            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-muted font-medium">答えを見る</Text>
            </Pressable>
          </View>
        </>
      ) : showResult ? (
        <>
          {/* Result Display */}
          <View
            className="rounded-2xl p-5 mb-5"
            style={{
              backgroundColor: isCorrect ? `${colors.success}08` : `${colors.error}08`,
              borderWidth: 1.5,
              borderColor: isCorrect ? `${colors.success}40` : `${colors.error}40`,
            }}
          >
            <View className="flex-row items-center mb-3">
              <IconSymbol
                name={isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill"}
                size={24}
                color={isCorrect ? colors.success : colors.error}
              />
              <Text
                className="text-lg font-bold ml-2"
                style={{ color: isCorrect ? colors.success : colors.error }}
              >
                {isCorrect ? "正解" : "不正解"}
              </Text>
            </View>

            {!isCorrect && (
              <View className="mb-3">
                <Text className="text-xs text-muted mb-1">あなたの回答</Text>
                <Text className="text-base" style={{ color: colors.error, textDecorationLine: "line-through" }}>
                  {userAnswer}
                </Text>
              </View>
            )}

            <View className="mb-3">
              <Text className="text-xs text-muted mb-1">正解</Text>
              <View className="flex-row items-center">
                <Text className="text-base font-medium flex-1" style={{ color: colors.success }}>
                  {currentQuestion.correct}
                </Text>
                <Pressable
                  onPress={() => speakText(currentQuestion.correctedSentence || currentQuestion.correct)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
                >
                  <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.success} />
                </Pressable>
              </View>
            </View>

            {currentQuestion.correctedSentence && (
              <View className="mb-3">
                <Text className="text-xs text-muted mb-1">正しい全文</Text>
                <Text className="text-sm text-foreground leading-relaxed">
                  {currentQuestion.correctedSentence}
                </Text>
              </View>
            )}

            {currentQuestion.explanation && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  padding: 12,
                  marginTop: 4,
                }}
              >
                <Text className="text-sm text-muted leading-relaxed">
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </View>

          {/* Next Button */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text className="text-white font-semibold text-base">次の問題へ</Text>
          </Pressable>
        </>
      ) : (
        <>
          {/* Show Answer Mode (skipped) */}
          <View
            className="rounded-2xl p-5 mb-5"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
              この文の間違いを直すと？
            </Text>

            {currentQuestion.originalSentence && (
              <View className="mb-4">
                <View
                  style={{
                    backgroundColor: `${colors.error}10`,
                    borderRadius: 10,
                    padding: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: colors.error,
                  }}
                >
                  <Text className="text-xs text-muted mb-1">間違い文</Text>
                  <Text className="text-base" style={{ color: colors.error }}>
                    {currentQuestion.originalSentence}
                  </Text>
                </View>
              </View>
            )}

            {/* Correction detail */}
            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
                <Text className="text-sm ml-2" style={{ color: colors.error, textDecorationLine: "line-through" }}>
                  {currentQuestion.original}
                </Text>
              </View>
              <View className="flex-row items-center mb-3">
                <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
                <Text className="text-sm ml-2 font-medium" style={{ color: colors.success }}>
                  {currentQuestion.correct}
                </Text>
              </View>
            </View>

            {currentQuestion.correctedSentence && (
              <View
                style={{
                  backgroundColor: `${colors.success}08`,
                  borderRadius: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: `${colors.success}30`,
                }}
              >
                <Text className="text-xs font-medium mb-1" style={{ color: colors.success }}>正しい全文</Text>
                <View className="flex-row items-start">
                  <Text className="text-sm text-foreground flex-1 leading-relaxed">
                    {currentQuestion.correctedSentence}
                  </Text>
                  <Pressable
                    onPress={() => speakText(currentQuestion.correctedSentence || currentQuestion.correct)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 6 }]}
                  >
                    <IconSymbol name="speaker.wave.2.fill" size={18} color={colors.success} />
                  </Pressable>
                </View>
              </View>
            )}

            {currentQuestion.explanation && (
              <Text className="text-sm text-muted leading-relaxed mt-3">
                {currentQuestion.explanation}
              </Text>
            )}
          </View>

          {/* Next Button */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 14,
                padding: 16,
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text className="text-white font-semibold text-base">次の問題へ</Text>
          </Pressable>
        </>
      )}
    </ScreenContainer>
  );
}

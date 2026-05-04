import { useState, useMemo } from "react";
import { Text, View, TouchableOpacity, TextInput, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { generateQuizQuestions } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function FillScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addQuizResult } = useProgress();

  const allQuestions = useMemo(() => {
    return generateQuizQuestions().filter((q) => q.type === "fill");
  }, []);

  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-4">
        <Text className="text-foreground">問題がありません</Text>
      </ScreenContainer>
    );
  }

  if (isFinished) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6">
        <View className="bg-surface rounded-2xl p-8 border border-border items-center w-full">
          <Text className="text-4xl mb-4">✏️</Text>
          <Text className="text-2xl font-bold text-foreground mb-2">完了！</Text>
          <Text className="text-lg text-muted mb-4">
            {score} / {questions.length} 正解
          </Text>
          <View className="w-full h-3 bg-border rounded-full overflow-hidden mb-6">
            <View
              className="h-full rounded-full bg-secondary"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </View>
          <TouchableOpacity
            className="bg-primary rounded-xl py-3 px-8"
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">戻る</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const currentQ = questions[currentIdx];

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === currentQ.answer.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore(score + 1);
    addQuizResult({
      categoryId: currentQ.categoryId,
      lessonId: currentQ.lessonId,
      type: "fill",
      score: correct ? 1 : 0,
      total: 1,
      date: new Date().toISOString(),
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserInput("");
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <ScreenContainer className="px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className="flex-row items-center"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color={colors.primary} />
          <Text className="text-primary ml-1 text-sm">戻る</Text>
        </TouchableOpacity>
        <Text className="text-sm text-muted">
          {currentIdx + 1} / {questions.length}
        </Text>
      </View>

      <View className="h-2 bg-border rounded-full overflow-hidden mb-6">
        <View
          className="h-full rounded-full bg-secondary"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
          <Text className="text-base text-foreground leading-6">{currentQ.question}</Text>
          {currentQ.questionJa && (
            <Text className="text-sm text-muted mt-2">{currentQ.questionJa}</Text>
          )}
        </View>

        {!isAnswered ? (
          <View>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground mb-4"
              placeholder="答えを入力..."
              placeholderTextColor={colors.muted}
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              className="bg-secondary rounded-xl py-4 items-center"
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">回答する</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View className={`rounded-xl p-4 mb-4 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-error/10 border border-error/30"}`}>
              <Text className={`text-base font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
                {isCorrect ? "正解！" : "不正解"}
              </Text>
              {!isCorrect && (
                <Text className="text-sm text-foreground mt-2">
                  正解: <Text className="font-semibold">{currentQ.answer}</Text>
                </Text>
              )}
              <Text className="text-sm text-muted mt-2">{currentQ.explanation}</Text>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center"
              activeOpacity={0.8}
              onPress={handleNext}
            >
              <Text className="text-white font-semibold">
                {currentIdx < questions.length - 1 ? "次の問題" : "結果を見る"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

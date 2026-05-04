import { useState, useMemo } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { generateQuizQuestions } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function QuizScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addQuizResult } = useProgress();

  const allQuestions = useMemo(() => {
    return generateQuizQuestions().filter((q) => q.type === "choice");
  }, []);

  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
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
          <Text className="text-4xl mb-4">🎉</Text>
          <Text className="text-2xl font-bold text-foreground mb-2">完了！</Text>
          <Text className="text-lg text-muted mb-4">
            {score} / {questions.length} 正解
          </Text>
          <View className="w-full h-3 bg-border rounded-full overflow-hidden mb-6">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </View>
          <Text className="text-sm text-muted mb-6">
            正答率: {Math.round((score / questions.length) * 100)}%
          </Text>
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

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === currentQ.answer) {
      setScore(score + 1);
    }
    addQuizResult({
      categoryId: currentQ.categoryId,
      lessonId: currentQ.lessonId,
      type: "quiz",
      score: option === currentQ.answer ? 1 : 0,
      total: 1,
      date: new Date().toISOString(),
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
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

      {/* Progress bar */}
      <View className="h-2 bg-border rounded-full overflow-hidden mb-6">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Question */}
        <View className="bg-surface rounded-xl p-4 mb-6 border border-border">
          <Text className="text-base text-foreground leading-6">{currentQ.question}</Text>
        </View>

        {/* Options */}
        {currentQ.options?.map((option, idx) => {
          let optionStyle = "bg-surface border-border";
          if (isAnswered) {
            if (option === currentQ.answer) {
              optionStyle = "bg-success/10 border-success";
            } else if (option === selectedAnswer) {
              optionStyle = "bg-error/10 border-error";
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              className={`rounded-xl p-4 mb-3 border ${optionStyle}`}
              activeOpacity={0.7}
              onPress={() => handleSelect(option)}
              disabled={isAnswered}
            >
              <Text className="text-sm text-foreground" numberOfLines={3}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {isAnswered && (
          <View className="bg-primary/5 rounded-xl p-4 mt-2 mb-4 border border-primary/20">
            <Text className="text-xs font-semibold text-primary mb-1">解説</Text>
            <Text className="text-sm text-foreground">{currentQ.explanation}</Text>
          </View>
        )}

        {/* Next Button */}
        {isAnswered && (
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center mt-2"
            activeOpacity={0.8}
            onPress={handleNext}
          >
            <Text className="text-white font-semibold">
              {currentIdx < questions.length - 1 ? "次の問題" : "結果を見る"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

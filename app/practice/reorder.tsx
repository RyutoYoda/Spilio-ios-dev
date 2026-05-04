import { useState, useMemo } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { generateQuizQuestions } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ReorderScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addQuizResult } = useProgress();

  const allQuestions = useMemo(() => {
    return generateQuizQuestions().filter((q) => q.type === "reorder" && q.answerParts);
  }, []);

  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(() => {
    if (questions.length > 0 && questions[0].answerParts) {
      return [...questions[0].answerParts].sort(() => Math.random() - 0.5);
    }
    return [];
  });
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
          <Text className="text-4xl mb-4">🔀</Text>
          <Text className="text-2xl font-bold text-foreground mb-2">完了！</Text>
          <Text className="text-lg text-muted mb-4">
            {score} / {questions.length} 正解
          </Text>
          <View className="w-full h-3 bg-border rounded-full overflow-hidden mb-6">
            <View
              className="h-full rounded-full bg-success"
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

  const handleSelectWord = (word: string, idx: number) => {
    if (isAnswered) return;
    setSelectedWords([...selectedWords, word]);
    const newAvailable = [...availableWords];
    newAvailable.splice(idx, 1);
    setAvailableWords(newAvailable);
  };

  const handleRemoveWord = (word: string, idx: number) => {
    if (isAnswered) return;
    setAvailableWords([...availableWords, word]);
    const newSelected = [...selectedWords];
    newSelected.splice(idx, 1);
    setSelectedWords(newSelected);
  };

  const handleCheck = () => {
    const userAnswer = selectedWords.join(" ").toLowerCase();
    const correctAnswer = currentQ.answer.toLowerCase();
    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore(score + 1);
    addQuizResult({
      categoryId: currentQ.categoryId,
      lessonId: currentQ.lessonId,
      type: "reorder",
      score: correct ? 1 : 0,
      total: 1,
      date: new Date().toISOString(),
    });
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setSelectedWords([]);
      setAvailableWords(
        [...(questions[nextIdx].answerParts || [])].sort(() => Math.random() - 0.5)
      );
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
          className="h-full rounded-full bg-success"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
          <Text className="text-base text-foreground leading-6">{currentQ.question}</Text>
        </View>

        {/* Selected words area */}
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border min-h-[60px]">
          <Text className="text-xs text-muted mb-2">あなたの回答:</Text>
          <View className="flex-row flex-wrap gap-2">
            {selectedWords.map((word, idx) => (
              <TouchableOpacity
                key={`selected-${idx}`}
                className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-2"
                activeOpacity={0.7}
                onPress={() => handleRemoveWord(word, idx)}
                disabled={isAnswered}
              >
                <Text className="text-sm text-primary font-medium">{word}</Text>
              </TouchableOpacity>
            ))}
            {selectedWords.length === 0 && (
              <Text className="text-sm text-muted">下の単語をタップして並べ替えてください</Text>
            )}
          </View>
        </View>

        {/* Available words */}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {availableWords.map((word, idx) => (
            <TouchableOpacity
              key={`available-${idx}`}
              className="bg-surface border border-border rounded-lg px-3 py-2"
              activeOpacity={0.7}
              onPress={() => handleSelectWord(word, idx)}
              disabled={isAnswered}
            >
              <Text className="text-sm text-foreground">{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Result */}
        {isAnswered && (
          <View className={`rounded-xl p-4 mb-4 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-error/10 border border-error/30"}`}>
            <Text className={`text-base font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
              {isCorrect ? "正解！" : "不正解"}
            </Text>
            {!isCorrect && (
              <Text className="text-sm text-foreground mt-2">
                正解: <Text className="font-semibold">{currentQ.answer}</Text>
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {!isAnswered ? (
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center"
            activeOpacity={0.8}
            onPress={handleCheck}
            disabled={selectedWords.length === 0}
            style={{ opacity: selectedWords.length === 0 ? 0.5 : 1 }}
          >
            <Text className="text-white font-semibold">回答する</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center"
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

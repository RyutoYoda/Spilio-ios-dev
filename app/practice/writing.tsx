import { useState, useMemo } from "react";
import { Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { generateQuizQuestions } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function WritingScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addQuizResult } = useProgress();

  const allQuestions = useMemo(() => {
    return generateQuizQuestions().filter((q) => q.type === "writing");
  }, []);

  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [similarity, setSimilarity] = useState(0);
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
          <Text className="text-4xl mb-4">📝</Text>
          <Text className="text-2xl font-bold text-foreground mb-2">完了！</Text>
          <Text className="text-lg text-muted mb-4">
            {score} / {questions.length} 正解
          </Text>
          <View className="w-full h-3 bg-border rounded-full overflow-hidden mb-6">
            <View
              className="h-full rounded-full bg-warning"
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

  const calculateSimilarity = (input: string, answer: string): number => {
    const inputWords = input.toLowerCase().replace(/[.,!?']/g, "").split(/\s+/).filter(Boolean);
    const answerWords = answer.toLowerCase().replace(/[.,!?']/g, "").split(/\s+/).filter(Boolean);
    if (answerWords.length === 0) return 0;
    let matches = 0;
    inputWords.forEach((word) => {
      if (answerWords.includes(word)) matches++;
    });
    return Math.min(Math.round((matches / answerWords.length) * 100), 100);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const sim = calculateSimilarity(userInput, currentQ.answer);
    setSimilarity(sim);
    setIsAnswered(true);
    if (sim >= 70) setScore(score + 1);
    addQuizResult({
      categoryId: currentQ.categoryId,
      lessonId: currentQ.lessonId,
      type: "writing",
      score: sim >= 70 ? 1 : 0,
      total: 1,
      date: new Date().toISOString(),
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserInput("");
      setIsAnswered(false);
      setSimilarity(0);
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
          className="h-full rounded-full bg-warning"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border">
          <Text className="text-xs text-muted mb-1">日本語を英語に訳してください</Text>
          <Text className="text-base text-foreground leading-6">{currentQ.question}</Text>
        </View>

        {!isAnswered ? (
          <View>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground mb-4"
              placeholder="英文を入力..."
              placeholderTextColor={colors.muted}
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
            <TouchableOpacity
              className="bg-warning rounded-xl py-4 items-center"
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">回答する</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View className={`rounded-xl p-4 mb-4 ${similarity >= 70 ? "bg-success/10 border border-success/30" : "bg-warning/10 border border-warning/30"}`}>
              <View className="flex-row items-center mb-2">
                <Text className={`text-base font-semibold ${similarity >= 70 ? "text-success" : "text-warning"}`}>
                  {similarity >= 70 ? "よくできました！" : "もう少し！"}
                </Text>
                <Text className="text-sm text-muted ml-2">一致度: {similarity}%</Text>
              </View>
              <Text className="text-xs text-muted mb-1">あなたの回答:</Text>
              <Text className="text-sm text-foreground mb-2">{userInput}</Text>
              <Text className="text-xs text-muted mb-1">模範解答:</Text>
              <Text className="text-sm text-foreground font-medium">{currentQ.answer}</Text>
              {currentQ.explanation && (
                <Text className="text-xs text-muted mt-2">{currentQ.explanation}</Text>
              )}
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

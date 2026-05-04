import { useState, useMemo, useCallback } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";

import { ScreenContainer } from "@/components/screen-container";
import { generateFlashcards, categories } from "@/data/content";
import { useProgress } from "@/lib/progress-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function FlashcardsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { markFlashcardKnown, markFlashcardUnknown, state } = useProgress();

  const allCards = useMemo(() => generateFlashcards(), []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0 });

  const filteredCards = useMemo(() => {
    if (!selectedCategory) return allCards;
    return allCards.filter((c) => c.categoryId === selectedCategory);
  }, [allCards, selectedCategory]);

  const flipAnim = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipAnim.value}deg` }],
    backfaceVisibility: "hidden" as const,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipAnim.value + 180}deg` }],
    backfaceVisibility: "hidden" as const,
  }));

  const handleFlip = () => {
    if (isFlipped) {
      flipAnim.value = withTiming(0, { duration: 300 });
    } else {
      flipAnim.value = withTiming(180, { duration: 300 });
    }
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    const card = filteredCards[currentIndex];
    markFlashcardKnown(card.id);
    setSessionStats((prev) => ({ ...prev, known: prev.known + 1 }));
    nextCard();
  };

  const handleUnknown = () => {
    const card = filteredCards[currentIndex];
    markFlashcardUnknown(card.id);
    setSessionStats((prev) => ({ ...prev, unknown: prev.unknown + 1 }));
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    flipAnim.value = 0;
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Category selection view
  if (!selectedCategory && selectedCategory !== "") {
    return (
      <ScreenContainer className="px-4 pt-4">
        <TouchableOpacity
          className="flex-row items-center mb-4"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color={colors.primary} />
          <Text className="text-primary ml-1 text-sm">戻る</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-foreground mb-2">フラッシュカード</Text>
        <Text className="text-sm text-muted mb-4">カテゴリを選んで復習しましょう</Text>

        <TouchableOpacity
          className="bg-primary rounded-xl p-4 mb-3"
          activeOpacity={0.7}
          onPress={() => setSelectedCategory("")}
        >
          <Text className="text-white font-semibold text-center">全カテゴリ ({allCards.length}枚)</Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const count = allCards.filter((c) => c.categoryId === cat.id).length;
          return (
            <TouchableOpacity
              key={cat.id}
              className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center"
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text className="text-xl mr-3">{cat.icon}</Text>
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">{cat.titleJa}</Text>
                <Text className="text-xs text-muted">{count}枚</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>
          );
        })}
      </ScreenContainer>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-4">
        <Text className="text-foreground">カードがありません</Text>
      </ScreenContainer>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <ScreenContainer className="px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className="flex-row items-center"
          activeOpacity={0.7}
          onPress={() => {
            setSelectedCategory(null);
            setCurrentIndex(0);
            setSessionStats({ known: 0, unknown: 0 });
          }}
        >
          <IconSymbol name="arrow.left" size={20} color={colors.primary} />
          <Text className="text-primary ml-1 text-sm">カテゴリ</Text>
        </TouchableOpacity>
        <Text className="text-sm text-muted">
          {currentIndex + 1} / {filteredCards.length}
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-center mb-4 gap-4">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-success mr-1" />
          <Text className="text-xs text-muted">覚えた: {sessionStats.known}</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-error mr-1" />
          <Text className="text-xs text-muted">まだ: {sessionStats.unknown}</Text>
        </View>
      </View>

      {/* Card */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleFlip}
        style={{ height: 280, marginBottom: 24 }}
      >
        <Animated.View
          style={[frontStyle, { position: "absolute", width: "100%", height: "100%" }]}
        >
          <View className="flex-1 bg-surface rounded-2xl border border-border items-center justify-center p-6">
            <Text className="text-xs text-muted mb-2">English</Text>
            <Text className="text-xl font-semibold text-foreground text-center leading-8">
              {currentCard.front}
            </Text>
            <Text className="text-xs text-muted mt-4">タップして裏面を見る</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[backStyle, { position: "absolute", width: "100%", height: "100%" }]}
        >
          <View className="flex-1 bg-primary/5 rounded-2xl border border-primary/30 items-center justify-center p-6">
            <Text className="text-xs text-primary mb-2">日本語</Text>
            <Text className="text-xl font-semibold text-foreground text-center leading-8">
              {currentCard.back}
            </Text>
            {currentCard.note && (
              <View className="bg-primary/10 rounded-lg px-3 py-1 mt-3">
                <Text className="text-xs text-primary">{currentCard.note}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View className="flex-row gap-4 px-4">
        <TouchableOpacity
          className="flex-1 bg-error/10 rounded-xl py-4 items-center border border-error/30"
          activeOpacity={0.7}
          onPress={handleUnknown}
        >
          <IconSymbol name="xmark.circle.fill" size={24} color={colors.error} />
          <Text className="text-error font-medium text-sm mt-1">まだ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-success/10 rounded-xl py-4 items-center border border-success/30"
          activeOpacity={0.7}
          onPress={handleKnown}
        >
          <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
          <Text className="text-success font-medium text-sm mt-1">覚えた</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

import { Text, View, ScrollView, Pressable, TextInput, Alert, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useState, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { ShareCard } from "@/components/share-card";
import { shareToInstagramStory } from "@/lib/share-utils";
import ViewShot from "react-native-view-shot";
import * as Speech from "expo-speech";

export default function ResultScreen() {
  const colors = useColors();
  const router = useRouter();
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const { state, addFavorite } = useStore();
  const [favoriteNote, setFavoriteNote] = useState("");
  const viewShotRef = useRef<any>(null);

  const entry = useMemo(
    () => state.entries.find((e) => e.id === entryId),
    [state.entries, entryId]
  );

  if (!entry) {
    return (
      <ScreenContainer className="px-5 pt-4">
        <Text className="text-foreground">エントリが見つかりません</Text>
      </ScreenContainer>
    );
  }

  const speakText = (text: string) => {
    Speech.speak(text, { language: "en-US", rate: 0.85 });
  };

  const handleAddFavorite = (english: string, japanese: string) => {
    addFavorite({
      id: `fav_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      english,
      japanese,
      addedDate: new Date().toISOString(),
    });
    Alert.alert("追加しました", "My Favoritesに保存しました");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return "#F59E0B";
    return colors.error;
  };

  const handleShareToX = () => {
    // Post the corrected (correct) version, not the original with mistakes
    const correctText = entry.correctedTranscript || entry.transcript;
    const text = `${correctText}\n\n📊 Score: ${entry.overallScore}/100\n#Spilio #EnglishDiary`;
    const encodedText = encodeURIComponent(text);
    const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    Linking.openURL(url);
  };

  return (
    <ScreenContainer className="px-5 pt-2" edges={["top", "bottom", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground">分析結果</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Scores */}
        <View className="flex-row justify-between mb-6">
          {[
            { label: "文法", score: entry.grammarScore },
            { label: "発音", score: entry.pronunciationScore },
            { label: "流暢さ", score: entry.fluencyScore },
            { label: "総合", score: entry.overallScore },
          ].map((item) => (
            <View key={item.label} className="items-center flex-1">
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  borderWidth: 3,
                  borderColor: getScoreColor(item.score),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-lg font-bold" style={{ color: getScoreColor(item.score) }}>
                  {item.score}
                </Text>
              </View>
              <Text className="text-xs text-muted mt-1">{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Transcript */}
        <View className="bg-surface rounded-xl p-4 border border-border mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-muted">あなたが話した内容</Text>
            <Pressable
              onPress={() => speakText(entry.transcript)}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 4 }]}
            >
              <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.primary} />
            </Pressable>
          </View>
          <Text className="text-base text-foreground leading-relaxed">{entry.transcript}</Text>
        </View>

        {/* Corrected Full Text */}
        {entry.correctedTranscript && entry.correctedTranscript !== entry.transcript && (
          <View className="bg-surface rounded-xl p-4 border border-border mb-4" style={{ borderColor: colors.success, borderWidth: 1.5 }}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium" style={{ color: colors.success }}>修正後の全文</Text>
              <Pressable
                onPress={() => speakText(entry.correctedTranscript)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 4 }]}
              >
                <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.success} />
              </Pressable>
            </View>
            <Text className="text-base text-foreground leading-relaxed">{entry.correctedTranscript}</Text>
          </View>
        )}

        {/* Corrections */}
        {entry.corrections.length > 0 && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-foreground mb-3">
              修正ポイント ({entry.corrections.length}件)
            </Text>
            {entry.corrections.map((correction, idx) => (
              <View key={idx} className="bg-surface rounded-xl p-4 border border-border mb-3">
                {/* Original (wrong) */}
                <View className="flex-row items-center mb-2">
                  <IconSymbol name="xmark.circle.fill" size={16} color={colors.error} />
                  <Text className="text-base ml-2" style={{ color: colors.error, textDecorationLine: "line-through" }}>
                    {correction.original}
                  </Text>
                </View>
                {/* Corrected */}
                <View className="flex-row items-center mb-2">
                  <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                  <Text className="text-base ml-2 flex-1" style={{ color: colors.success }}>
                    {correction.corrected}
                  </Text>
                  <Pressable
                    onPress={() => speakText(correction.corrected)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 4 }]}
                  >
                    <IconSymbol name="speaker.wave.2.fill" size={18} color={colors.primary} />
                  </Pressable>
                </View>
                {/* Explanation */}
                <Text className="text-sm text-muted">{correction.explanation}</Text>
                {/* Add to favorites */}
                <Pressable
                  onPress={() => handleAddFavorite(correction.corrected, correction.explanation)}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                      paddingVertical: 6,
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <IconSymbol name="heart" size={16} color={colors.primary} />
                  <Text className="text-sm ml-1" style={{ color: colors.primary }}>
                    お気に入りに追加
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* No corrections */}
        {entry.corrections.length === 0 && (
          <View className="bg-surface rounded-xl p-5 border border-border mb-4 items-center">
            <IconSymbol name="checkmark.circle.fill" size={40} color={colors.success} />
            <Text className="text-base font-semibold text-foreground mt-2">素晴らしい！</Text>
            <Text className="text-sm text-muted mt-1 text-center">
              文法的な間違いは見つかりませんでした
            </Text>
          </View>
        )}

        {/* Share Card (hidden, for capture) */}
        <View style={{ position: "absolute", left: -9999, top: 0 }}>
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
            <ShareCard
              transcript={entry.transcript}
              correctedTranscript={entry.correctedTranscript}
              overallScore={entry.overallScore}
              grammarScore={entry.grammarScore}
              pronunciationScore={entry.pronunciationScore}
              fluencyScore={entry.fluencyScore}
              streak={state.streak}
              date={entry.date}
            />
          </ViewShot>
        </View>

        {/* Share buttons row */}
        <View className="flex-row gap-3" style={{ marginTop: 8 }}>
          {/* Share to X */}
          <Pressable
            onPress={handleShareToX}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: "#000000",
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white font-bold text-base mr-1">𝕏</Text>
            <Text className="text-white font-semibold text-sm">ポスト</Text>
          </Pressable>

          {/* Share to Instagram Story */}
          <Pressable
            onPress={() => shareToInstagramStory(viewShotRef)}
            style={({ pressed }) => [
              {
                flex: 1,
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
                backgroundColor: "#E1306C",
              },
            ]}
          >
            <Text className="text-white font-bold text-base mr-1">📷</Text>
            <Text className="text-white font-semibold text-sm">ストーリー</Text>
          </Pressable>
        </View>

        {/* Done button */}
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              marginTop: 12,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold text-base">ホームに戻る</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

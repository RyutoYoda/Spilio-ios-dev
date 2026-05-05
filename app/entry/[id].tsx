import { Text, View, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { ShareCard } from "@/components/share-card";
import { shareToFriends } from "@/lib/share-utils";
import ViewShot from "react-native-view-shot";
import * as Speech from "expo-speech";
import { openBrowserAsync } from "expo-web-browser";

export default function EntryDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, addFavorite, deleteEntry } = useStore();
  const viewShotRef = useRef<any>(null);

  const entry = useMemo(
    () => state.entries.find((e) => e.id === id),
    [state.entries, id]
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

  const handleShare = () => {
    shareToFriends(viewShotRef);
  };

  const handlePostToX = () => {
    const text = entry.correctedTranscript || entry.transcript;
    const scoreText = `Score: ${entry.overallScore}/100`;
    const hashtag = "Spilio";
    const tweetText = `${text}\n\n${scoreText} #${hashtag}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    openBrowserAsync(url);
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("この日記を削除しますか？関連する復習問題も削除されます。");
      if (confirmed) {
        deleteEntry(entry.id);
        router.back();
      }
    } else {
      Alert.alert(
        "日記を削除",
        "この日記を削除しますか？関連する復習問題も削除されます。",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "削除する",
            style: "destructive",
            onPress: () => {
              deleteEntry(entry.id);
              router.back();
            },
          },
        ]
      );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    return `${date.getFullYear()}/${month}/${day} (${weekday})`;
  };

  return (
    <ScreenContainer className="px-5 pt-2" edges={["top", "bottom", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
              padding: 8,
              borderRadius: 10,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <IconSymbol name="chevron.left" size={22} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">{formatDate(entry.date)}</Text>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
              padding: 8,
              borderRadius: 10,
              backgroundColor: `${colors.error}12`,
            },
          ]}
        >
          <IconSymbol name="trash.fill" size={18} color={colors.error} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Score Cards */}
        <View className="flex-row justify-between mb-6">
          {[
            { label: "文法", score: entry.grammarScore },
            { label: "発音", score: entry.pronunciationScore },
            { label: "流暢さ", score: entry.fluencyScore },
            { label: "総合", score: entry.overallScore },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                alignItems: "center",
                marginHorizontal: 4,
                backgroundColor: `${getScoreColor(item.score)}08`,
                borderRadius: 14,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: `${getScoreColor(item.score)}30`,
              }}
            >
              <Text className="text-2xl font-bold" style={{ color: getScoreColor(item.score) }}>
                {item.score}
              </Text>
              <Text className="text-xs text-muted mt-1">{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Original Transcript */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 14,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-medium text-muted uppercase tracking-wider">
              あなたが話した内容
            </Text>
            <Pressable
              onPress={() => speakText(entry.transcript)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                  padding: 6,
                  borderRadius: 8,
                  backgroundColor: `${colors.primary}12`,
                },
              ]}
            >
              <IconSymbol name="speaker.wave.2.fill" size={18} color={colors.primary} />
            </Pressable>
          </View>
          <Text className="text-base text-foreground leading-relaxed">{entry.transcript}</Text>
        </View>

        {/* Corrected Full Text */}
        {entry.correctedTranscript && entry.correctedTranscript !== entry.transcript && (
          <View
            style={{
              backgroundColor: `${colors.success}06`,
              borderRadius: 16,
              padding: 18,
              borderWidth: 1.5,
              borderColor: `${colors.success}40`,
              marginBottom: 14,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.success }}
              >
                修正後の全文
              </Text>
              <Pressable
                onPress={() => speakText(entry.correctedTranscript)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                    padding: 6,
                    borderRadius: 8,
                    backgroundColor: `${colors.success}15`,
                  },
                ]}
              >
                <IconSymbol name="speaker.wave.2.fill" size={18} color={colors.success} />
              </Pressable>
            </View>
            <Text className="text-base text-foreground leading-relaxed">
              {entry.correctedTranscript}
            </Text>
            <Pressable
              onPress={() => handleAddFavorite(entry.correctedTranscript, "日記の修正後全文")}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: `${colors.primary}08`,
                  alignSelf: "flex-start",
                  opacity: pressed ? 0.6 : 1,
                  marginTop: 12,
                },
              ]}
            >
              <IconSymbol name="heart" size={14} color={colors.primary} />
              <Text className="text-sm ml-1.5 font-medium" style={{ color: colors.primary }}>
                お気に入りに追加
              </Text>
            </Pressable>
          </View>
        )}

        {/* Add favorite for transcript when no corrections */}
        {entry.corrections.length === 0 && entry.correctedTranscript === entry.transcript && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 18,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 14,
            }}
          >
            <Pressable
              onPress={() => handleAddFavorite(entry.transcript, "日記の表現")}
              style={({ pressed }) => [
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: `${colors.primary}08`,
                  alignSelf: "flex-start",
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <IconSymbol name="heart" size={14} color={colors.primary} />
              <Text className="text-sm ml-1.5 font-medium" style={{ color: colors.primary }}>
                この表現をお気に入りに追加
              </Text>
            </Pressable>
          </View>
        )}

        {/* Corrections */}
        {entry.corrections.length > 0 && (
          <View className="mb-5">
            <Text className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              修正ポイント ({entry.corrections.length}件)
            </Text>
            {entry.corrections.map((correction, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 12,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <IconSymbol name="xmark.circle.fill" size={15} color={colors.error} />
                  <Text
                    className="text-base ml-2"
                    style={{ color: colors.error, textDecorationLine: "line-through" }}
                  >
                    {correction.original}
                  </Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <IconSymbol name="checkmark.circle.fill" size={15} color={colors.success} />
                  <Text className="text-base ml-2 flex-1" style={{ color: colors.success }}>
                    {correction.corrected}
                  </Text>
                  <Pressable
                    onPress={() => speakText(correction.corrected)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.6 : 1,
                        padding: 6,
                        borderRadius: 8,
                        backgroundColor: `${colors.primary}12`,
                      },
                    ]}
                  >
                    <IconSymbol name="speaker.wave.2.fill" size={16} color={colors.primary} />
                  </Pressable>
                </View>
                <Text className="text-sm text-muted leading-relaxed mb-3">
                  {correction.explanation}
                </Text>
                <Pressable
                  onPress={() => handleAddFavorite(correction.corrected, correction.explanation)}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      backgroundColor: `${colors.primary}08`,
                      alignSelf: "flex-start",
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <IconSymbol name="heart" size={14} color={colors.primary} />
                  <Text className="text-sm ml-1.5 font-medium" style={{ color: colors.primary }}>
                    お気に入りに追加
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {entry.corrections.length === 0 && (
          <View
            style={{
              backgroundColor: `${colors.success}08`,
              borderRadius: 16,
              padding: 24,
              borderWidth: 1,
              borderColor: `${colors.success}30`,
              marginBottom: 14,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: `${colors.success}15`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
            </View>
            <Text className="text-base font-semibold text-foreground">完璧です</Text>
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

        {/* Share button */}
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 6,
            },
          ]}
        >
          <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
          <Text className="text-white font-semibold text-base ml-2">友達にシェア</Text>
        </Pressable>

        {/* X (Twitter) 投稿ボタン */}
        <Pressable
          onPress={handlePostToX}
          style={({ pressed }) => [
            {
              backgroundColor: "#000000",
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#FFFFFF" }}>X</Text>
          <Text className="text-white font-semibold text-base ml-2">に投稿する</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

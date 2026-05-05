import { Text, View, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";

export default function DiaryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state } = useStore();

  const handleRecord = () => {
    router.push("/record");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return "#F59E0B";
    return colors.error;
  };

  return (
    <ScreenContainer className="px-5 pt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <View>
          <Text className="text-3xl font-bold text-foreground tracking-tight">Spilio</Text>
          <Text className="text-sm text-muted mt-0.5">今日のことを英語で話そう</Text>
        </View>
        {state.streak > 0 && (
          <View
            style={{
              backgroundColor: `${colors.warning}18`,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${colors.warning}40`,
            }}
          >
            <IconSymbol name="flame.fill" size={16} color={colors.warning} />
            <Text
              className="text-sm font-bold ml-1.5"
              style={{ color: colors.warning }}
            >
              {state.streak}日連続
            </Text>
          </View>
        )}
      </View>

      {/* Knowledge Graph Link */}
      {state.entries.length > 0 && (
        <Pressable
          onPress={() => router.push("/knowledge-graph" as any)}
          style={({ pressed }) => [
            {
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: `${colors.primary}12`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSymbol name="arrow.clockwise" size={18} color={colors.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm font-medium text-foreground">ナレッジグラフ</Text>
            <Text className="text-xs text-muted">学んだ表現を可視化</Text>
          </View>
          <IconSymbol name="chevron.right" size={16} color={colors.muted} />
        </Pressable>
      )}

      {/* Record Button - Hero Area */}
      <View className="items-center mb-10">
        <Pressable
          onPress={handleRecord}
          style={({ pressed }) => [
            {
              width: 130,
              height: 130,
              borderRadius: 65,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 12,
            },
          ]}
        >
          <IconSymbol name="mic.fill" size={52} color="#FFFFFF" />
        </Pressable>
        <Text className="text-sm text-muted mt-4 tracking-wide">タップして録音開始</Text>
      </View>

      {/* Past entries */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-foreground">過去の日記</Text>
          {state.entries.length > 0 && (
            <Text className="text-xs text-muted">{state.entries.length}件</Text>
          )}
        </View>
        {state.entries.length === 0 ? (
          <View className="items-center py-12">
            <IconSymbol name="mic.fill" size={36} color={colors.border} />
            <Text className="text-muted text-center mt-4 leading-relaxed">
              まだ日記がありません{"\n"}マイクボタンを押して始めましょう
            </Text>
          </View>
        ) : (
          <FlatList
            data={state.entries}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/entry/${item.id}` as any)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-muted">{formatDate(item.date)}</Text>
                  <View
                    style={{
                      backgroundColor: `${getScoreColor(item.overallScore)}18`,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: getScoreColor(item.overallScore) }}
                    >
                      {item.overallScore}
                    </Text>
                  </View>
                </View>
                <Text className="text-foreground leading-relaxed" numberOfLines={2}>
                  {item.transcript}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

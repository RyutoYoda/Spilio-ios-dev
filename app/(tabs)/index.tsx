import { Text, View, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { CalendarModal } from "@/components/calendar-modal";

export default function DiaryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state } = useStore();
  const [calendarVisible, setCalendarVisible] = useState(false);

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
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text
            style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 30, letterSpacing: -1 }}
            className="text-foreground"
          >Spilio</Text>
          <Text className="text-sm text-muted mt-0.5">英語で今日を振り返ろう</Text>
        </View>
        <Pressable
          onPress={() => setCalendarVisible(true)}
          style={({ pressed }) => [
            {
              backgroundColor: `${colors.warning}18`,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${colors.warning}40`,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <IconSymbol name="flame.fill" size={16} color={colors.warning} />
          <Text
            className="text-sm font-bold ml-1.5"
            style={{ color: colors.warning }}
          >
            {state.streak > 0 ? `${state.streak}日連続` : "0日"}
          </Text>
        </Pressable>
      </View>

      {/* Welcome Hero Section */}
      {state.entries.length === 0 ? (
        <View className="items-center py-8 mb-4">
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: `${colors.primary}10`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 42, fontFamily: "SpaceGrotesk_700Bold", color: colors.primary }}>S</Text>
          </View>
          <Text
            style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 24, letterSpacing: -0.5 }}
            className="text-foreground mb-2"
          >
            Welcome to Spilio
          </Text>
          <Text className="text-sm text-muted text-center leading-relaxed mb-8">
            毎日英語で日記を録音して{"\n"}AIがあなたの文法と発音を分析します
          </Text>
          <Pressable
            onPress={handleRecord}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingHorizontal: 32,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
          >
            <IconSymbol name="mic.fill" size={22} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base ml-2">録音を始める</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* Quick Actions */}
          <View className="flex-row gap-3 mb-5">
            {/* Record Button */}
            <Pressable
              onPress={handleRecord}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 6,
                },
              ]}
            >
              <IconSymbol name="mic.fill" size={22} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">録音する</Text>
            </Pressable>

            {/* Knowledge Graph */}
            <Pressable
              onPress={() => router.push("/knowledge-graph" as any)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <IconSymbol name="arrow.clockwise" size={18} color={colors.primary} />
              <Text className="text-foreground font-medium ml-2 text-sm">グラフ</Text>
            </Pressable>
          </View>

          {/* Stats Summary */}
          <View
            className="flex-row mb-5"
            style={{
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-foreground">{state.entries.length}</Text>
              <Text className="text-xs text-muted">日記数</Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border }} />
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-foreground">{state.totalDays}</Text>
              <Text className="text-xs text-muted">学習日数</Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border }} />
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-foreground">
                {state.entries.length > 0
                  ? Math.round(state.entries.reduce((sum, e) => sum + e.overallScore, 0) / state.entries.length)
                  : 0}
              </Text>
              <Text className="text-xs text-muted">平均スコア</Text>
            </View>
          </View>

          {/* Past entries */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-foreground">過去の日記</Text>
              <Text className="text-xs text-muted">{state.entries.length}件</Text>
            </View>
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
          </View>
        </>
      )}

      {/* Calendar Modal */}
      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
      />
    </ScreenContainer>
  );
}

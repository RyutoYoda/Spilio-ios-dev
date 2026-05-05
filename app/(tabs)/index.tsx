import { Text, View, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { useState } from "react";

export default function DiaryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state } = useStore();
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <ScreenContainer className="px-5 pt-4">
      {/* Header with streak */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">English Diary</Text>
          <Text className="text-sm text-muted mt-1">今日のことを英語で話そう</Text>
        </View>
        <View className="flex-row items-center bg-surface px-3 py-2 rounded-full border border-border">
          <IconSymbol name="flame.fill" size={18} color="#F59E0B" />
          <Text className="text-base font-bold text-foreground ml-1">{state.streak}</Text>
          <Text className="text-xs text-muted ml-1">日</Text>
        </View>
      </View>

      {/* Record Button */}
      <View className="items-center mb-8">
        <Pressable
          onPress={handleRecord}
          style={({ pressed }) => [
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        >
          <IconSymbol name="mic.fill" size={48} color="#FFFFFF" />
        </Pressable>
        <Text className="text-sm text-muted mt-3">タップして録音開始</Text>
      </View>

      {/* Past entries */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground mb-3">過去の日記</Text>
        {state.entries.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-muted text-center">まだ日記がありません{"\n"}マイクボタンを押して始めましょう</Text>
          </View>
        ) : (
          <FlatList
            data={state.entries}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/entry/${item.id}` as any)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-medium text-muted">{formatDate(item.date)}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                      {item.overallScore}点
                    </Text>
                  </View>
                </View>
                <Text className="text-foreground" numberOfLines={2}>
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

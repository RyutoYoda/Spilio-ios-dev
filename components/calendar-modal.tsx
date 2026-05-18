import { Text, View, Pressable, Modal, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CalendarModal({ visible, onClose }: CalendarModalProps) {
  const colors = useColors();
  const { state } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get dates that have diary entries
  const activeDates = useMemo(() => {
    const dates = new Map<string, { count: number; avgScore: number }>();
    state.entries.forEach((entry) => {
      const dateKey = entry.date.split("T")[0];
      const existing = dates.get(dateKey);
      if (existing) {
        const newCount = existing.count + 1;
        const newAvg = (existing.avgScore * existing.count + entry.overallScore) / newCount;
        dates.set(dateKey, { count: newCount, avgScore: Math.round(newAvg) });
      } else {
        dates.set(dateKey, { count: 1, avgScore: entry.overallScore });
      }
    });
    return dates;
  }, [state.entries]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getDateColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return "#F59E0B";
    return colors.error;
  };

  const today = new Date().toISOString().split("T")[0];

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  // Fill in empty days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 16 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text className="text-xl font-bold text-foreground">学習カレンダー</Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              {
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.muted} />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5 pt-4">
          {/* Month Navigation */}
          <View className="flex-row items-center justify-between mb-6">
            <Pressable
              onPress={prevMonth}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
            >
              <IconSymbol name="chevron.left" size={20} color={colors.foreground} />
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">
              {year}年 {monthNames[month]}
            </Text>
            <Pressable
              onPress={nextMonth}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, padding: 8 }]}
            >
              <IconSymbol name="chevron.right" size={20} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Day Headers */}
          <View className="flex-row mb-2">
            {dayNames.map((day, i) => (
              <View key={i} className="flex-1 items-center">
                <Text
                  className="text-xs font-medium"
                  style={{ color: i === 0 ? colors.error : i === 6 ? colors.primary : colors.muted }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          {weeks.map((week, weekIdx) => (
            <View key={weekIdx} className="flex-row mb-2">
              {week.map((day, dayIdx) => {
                if (day === null) {
                  return <View key={dayIdx} className="flex-1 items-center py-2" />;
                }

                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const activity = activeDates.get(dateStr);
                const isToday = dateStr === today;

                return (
                  <View key={dayIdx} className="flex-1 items-center py-1">
                    <View
                      style={[
                        {
                          width: 38,
                          height: 38,
                          borderRadius: 19,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        activity && {
                          backgroundColor: `${getDateColor(activity.avgScore)}20`,
                        },
                        isToday && !activity && {
                          borderWidth: 1.5,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <Text
                        className="text-sm"
                        style={{
                          color: activity ? getDateColor(activity.avgScore) : isToday ? colors.primary : colors.foreground,
                          fontWeight: activity || isToday ? "600" : "400",
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                    {activity && (
                      <View
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: getDateColor(activity.avgScore),
                          marginTop: 2,
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          ))}

          {/* Stats Section */}
          <View
            className="mt-6 mb-6 rounded-2xl p-5"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          >
            <Text className="text-base font-semibold text-foreground mb-4">今月のサマリー</Text>
            <View className="flex-row">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {Array.from(activeDates.entries()).filter(([key]) => key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length}
                </Text>
                <Text className="text-xs text-muted mt-1">学習日数</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {state.streak}
                </Text>
                <Text className="text-xs text-muted mt-1">連続日数</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {state.totalDays}
                </Text>
                <Text className="text-xs text-muted mt-1">累計日数</Text>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View className="flex-row items-center justify-center gap-4 mb-8">
            <View className="flex-row items-center">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, marginRight: 4 }} />
              <Text className="text-xs text-muted">80+</Text>
            </View>
            <View className="flex-row items-center">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#F59E0B", marginRight: 4 }} />
              <Text className="text-xs text-muted">60-79</Text>
            </View>
            <View className="flex-row items-center">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.error, marginRight: 4 }} />
              <Text className="text-xs text-muted">60未満</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

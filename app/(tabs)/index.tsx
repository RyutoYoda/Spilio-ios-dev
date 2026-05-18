import { Text, View, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { CalendarModal } from "@/components/calendar-modal";
import { Image } from "expo-image";

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

  const hasEntries = state.entries.length > 0;

  return (
    <ScreenContainer className="px-5 pt-2">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.headerLogo}
          />
          <View>
            <Text
              style={[styles.headerTitle, { color: colors.foreground }]}
            >Spilio</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setCalendarVisible(true)}
          style={({ pressed }) => [
            styles.streakBadge,
            {
              backgroundColor: state.streak > 0 ? `${colors.warning}15` : `${colors.muted}10`,
              borderColor: state.streak > 0 ? `${colors.warning}30` : `${colors.border}`,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <IconSymbol name="flame.fill" size={15} color={state.streak > 0 ? colors.warning : colors.muted} />
          <Text
            style={[styles.streakText, { color: state.streak > 0 ? colors.warning : colors.muted }]}
          >
            {state.streak > 0 ? `${state.streak}` : "0"}
          </Text>
        </Pressable>
      </View>

      {/* Welcome Section for new users */}
      {!hasEntries ? (
        <View style={styles.welcomeContainer}>
          {/* Gradient-like hero card */}
          <View
            style={[styles.heroCard, { backgroundColor: colors.primary }]}
          >
            <View style={styles.heroCardInner}>
              <View style={styles.heroIconRow}>
                <View style={styles.heroIconCircle}>
                  <IconSymbol name="mic.fill" size={28} color={colors.primary} />
                </View>
              </View>
              <Text style={styles.heroTitle}>
                英語で今日を{"\n"}振り返ろう
              </Text>
              <Text style={styles.heroSubtitle}>
                声で日記を録音するだけ。AIが文法と発音を分析して、あなたの英語力を伸ばします。
              </Text>
              <Pressable
                onPress={handleRecord}
                style={({ pressed }) => [
                  styles.heroButton,
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                <Text style={[styles.heroButtonText, { color: colors.primary }]}>録音を始める</Text>
                <IconSymbol name="chevron.right" size={18} color={colors.primary} />
              </Pressable>
            </View>
            {/* Decorative circles */}
            <View style={[styles.decorCircle1, { backgroundColor: "rgba(255,255,255,0.08)" }]} />
            <View style={[styles.decorCircle2, { backgroundColor: "rgba(255,255,255,0.05)" }]} />
          </View>

          {/* Feature hints */}
          <View style={styles.featureGrid}>
            <View style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.success}15` }]}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>文法チェック</Text>
              <Text style={[styles.featureDesc, { color: colors.muted }]}>AIが間違いを指摘</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.secondary}15` }]}>
                <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>発音スコア</Text>
              <Text style={[styles.featureDesc, { color: colors.muted }]}>発音を数値で評価</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.warning}15` }]}>
                <IconSymbol name="arrow.clockwise" size={20} color={colors.warning} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>復習クイズ</Text>
              <Text style={[styles.featureDesc, { color: colors.muted }]}>穴埋めで定着</Text>
            </View>
            <View style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}15` }]}>
                <IconSymbol name="flame.fill" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>継続記録</Text>
              <Text style={[styles.featureDesc, { color: colors.muted }]}>毎日の学習を可視化</Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Quick Actions */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleRecord}
              style={({ pressed }) => [
                styles.primaryAction,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  shadowColor: colors.primary,
                },
              ]}
            >
              <IconSymbol name="mic.fill" size={20} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>録音する</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/knowledge-graph" as any)}
              style={({ pressed }) => [
                styles.secondaryAction,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <IconSymbol name="arrow.clockwise" size={17} color={colors.primary} />
              <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>グラフ</Text>
            </Pressable>
          </View>

          {/* Stats Summary */}
          <View
            style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.entries.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>日記数</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.totalDays}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>学習日数</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {state.entries.length > 0
                  ? Math.round(state.entries.reduce((sum, e) => sum + e.overallScore, 0) / state.entries.length)
                  : 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>平均スコア</Text>
            </View>
          </View>

          {/* Past entries */}
          <View style={styles.entriesSection}>
            <View style={styles.entriesHeader}>
              <Text style={[styles.entriesTitle, { color: colors.foreground }]}>過去の日記</Text>
              <Text style={[styles.entriesCount, { color: colors.muted }]}>{state.entries.length}件</Text>
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
                    styles.entryCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.entryHeader}>
                    <Text style={[styles.entryDate, { color: colors.muted }]}>{formatDate(item.date)}</Text>
                    <View
                      style={[styles.scoreBadge, { backgroundColor: `${getScoreColor(item.overallScore)}15` }]}
                    >
                      <Text
                        style={[styles.scoreText, { color: getScoreColor(item.overallScore) }]}
                      >
                        {item.overallScore}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.entryTranscript, { color: colors.foreground }]} numberOfLines={2}>
                    {item.transcript}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </>
      )}

      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Welcome (empty state)
  welcomeContainer: {
    flex: 1,
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
  },
  heroCardInner: {
    padding: 28,
    zIndex: 1,
  },
  heroIconRow: {
    marginBottom: 20,
  },
  heroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
    marginBottom: 24,
  },
  heroButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    gap: 6,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  decorCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -40,
  },
  decorCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -30,
    right: 40,
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Has entries state
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
  },

  entriesSection: {
    flex: 1,
  },
  entriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  entriesTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  entriesCount: {
    fontSize: 12,
  },
  entryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 13,
  },
  scoreBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: "700",
  },
  entryTranscript: {
    fontSize: 14,
    lineHeight: 22,
  },
});

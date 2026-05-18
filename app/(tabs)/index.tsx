import { Text, View, FlatList, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { CalendarModal } from "@/components/calendar-modal";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Spilio</Text>
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
          <Text style={[styles.streakText, { color: state.streak > 0 ? colors.warning : colors.muted }]}>
            {state.streak > 0 ? `${state.streak}` : "0"}
          </Text>
        </Pressable>
      </View>

      {/* Large Record Button - Hero Area */}
      <Pressable
        onPress={handleRecord}
        style={({ pressed }) => [
          styles.recordHero,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        {/* Decorative circles */}
        <View style={[styles.heroDecor1, { backgroundColor: "rgba(255,255,255,0.08)" }]} />
        <View style={[styles.heroDecor2, { backgroundColor: "rgba(255,255,255,0.05)" }]} />
        <View style={[styles.heroDecor3, { backgroundColor: "rgba(255,255,255,0.04)" }]} />

        <View style={styles.recordHeroInner}>
          {/* Large mic icon */}
          <View style={styles.micCircle}>
            <IconSymbol name="mic.fill" size={36} color={colors.primary} />
          </View>

          <Text style={styles.recordHeroTitle}>
            {hasEntries ? "今日も英語で話そう" : "英語で今日を振り返ろう"}
          </Text>
          <Text style={styles.recordHeroSub}>
            タップして録音を開始
          </Text>
        </View>
      </Pressable>

      {!hasEntries ? (
        /* Empty state - feature hints */
        <View style={styles.featureSection}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Spilioでできること</Text>
          <View style={styles.featureRow}>
            <View style={[styles.featureChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
              <Text style={[styles.featureChipText, { color: colors.foreground }]}>文法チェック</Text>
            </View>
            <View style={[styles.featureChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="speaker.wave.2.fill" size={16} color={colors.primary} />
              <Text style={[styles.featureChipText, { color: colors.foreground }]}>発音スコア</Text>
            </View>
            <View style={[styles.featureChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="arrow.clockwise" size={16} color={colors.warning} />
              <Text style={[styles.featureChipText, { color: colors.foreground }]}>復習クイズ</Text>
            </View>
            <View style={[styles.featureChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="flame.fill" size={16} color={colors.error} />
              <Text style={[styles.featureChipText, { color: colors.foreground }]}>継続記録</Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.entries.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>日記</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{state.totalDays}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>日数</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {state.entries.length > 0
                  ? Math.round(state.entries.reduce((sum, e) => sum + e.overallScore, 0) / state.entries.length)
                  : 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>平均点</Text>
            </View>
          </View>

          {/* Quick links */}
          <View style={styles.quickLinks}>
            <Pressable
              onPress={() => router.push("/knowledge-graph" as any)}
              style={({ pressed }) => [
                styles.quickLink,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <IconSymbol name="arrow.clockwise" size={16} color={colors.primary} />
              <Text style={[styles.quickLinkText, { color: colors.foreground }]}>ナレッジグラフ</Text>
            </Pressable>
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
                    <View style={[styles.scoreBadge, { backgroundColor: `${getScoreColor(item.overallScore)}15` }]}>
                      <Text style={[styles.scoreText, { color: getScoreColor(item.overallScore) }]}>
                        {item.overallScore}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.entryTranscript, { color: colors.foreground }]}
                    numberOfLines={2}
                  >
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
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 34,
    height: 34,
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

  // Record Hero Button
  recordHero: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 200,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  recordHeroInner: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  micCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recordHeroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  recordHeroSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  heroDecor1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -80,
    right: -50,
  },
  heroDecor2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    bottom: -40,
    left: -30,
  },
  heroDecor3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 20,
    left: SCREEN_WIDTH * 0.5,
  },

  // Feature hints (empty state)
  featureSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureChipText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },

  // Quick links
  quickLinks: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  quickLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickLinkText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Entries
  entriesSection: {
    flex: 1,
  },
  entriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  entriesTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  entriesCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  entryCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  scoreBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: "700",
  },
  entryTranscript: {
    fontSize: 14,
    lineHeight: 20,
  },
});

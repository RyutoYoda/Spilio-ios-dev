import { Text, View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useStore } from "@/lib/store-context";
import { buildKnowledgeGraph, CATEGORY_LABELS, CATEGORY_COLORS, GrammarCategory } from "@/lib/knowledge-graph";
import { KnowledgeGraphView } from "@/components/knowledge-graph-view";

export default function KnowledgeGraphScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state } = useStore();

  const graphData = useMemo(
    () => buildKnowledgeGraph(state.entries, state.favorites),
    [state.entries, state.favorites]
  );

  const hasData = graphData.nodes.length > 0;

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
        <Text className="text-base font-semibold text-foreground">ナレッジグラフ</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Description */}
        <View className="mb-5">
          <Text className="text-sm text-muted leading-relaxed">
            あなたが学んだ表現や文法ポイントを、カテゴリごとに可視化しています。
            ノードをタップすると詳細を確認できます。
          </Text>
        </View>

        {hasData ? (
          <>
            {/* Stats summary */}
            <View className="flex-row mb-5" style={{ gap: 10 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-2xl font-bold text-foreground">{graphData.nodes.length}</Text>
                <Text className="text-xs text-muted mt-1">ノード数</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-2xl font-bold text-foreground">{graphData.clusters.length}</Text>
                <Text className="text-xs text-muted mt-1">カテゴリ</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-2xl font-bold text-foreground">{graphData.edges.length}</Text>
                <Text className="text-xs text-muted mt-1">つながり</Text>
              </View>
            </View>

            {/* Graph visualization */}
            <KnowledgeGraphView data={graphData} />

            {/* Cluster breakdown */}
            <View className="mt-6">
              <Text className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                カテゴリ別の内訳
              </Text>
              {graphData.clusters.map((cluster) => (
                <View
                  key={cluster.category}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderLeftWidth: 4,
                    borderLeftColor: cluster.color,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-foreground">{cluster.label}</Text>
                    <Text className="text-sm text-muted">{cluster.nodes.length}件</Text>
                  </View>
                  <View className="flex-row flex-wrap mt-2" style={{ gap: 6 }}>
                    {cluster.nodes.slice(0, 5).map((node) => (
                      <View
                        key={node.id}
                        style={{
                          backgroundColor: `${cluster.color}12`,
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: cluster.color }}>
                          {node.label}
                        </Text>
                      </View>
                    ))}
                    {cluster.nodes.length > 5 && (
                      <View
                        style={{
                          backgroundColor: `${cluster.color}08`,
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: colors.muted }}>
                          +{cluster.nodes.length - 5}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View className="items-center py-16">
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: `${colors.primary}12`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <IconSymbol name="arrow.clockwise" size={36} color={colors.border} />
            </View>
            <Text className="text-lg font-semibold text-muted text-center">
              まだデータがありません
            </Text>
            <Text className="text-sm text-muted mt-2 text-center leading-relaxed">
              日記を録音すると、文法ポイントが{"\n"}自動的にグラフに追加されます
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

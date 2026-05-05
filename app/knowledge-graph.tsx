import { Text, View, ScrollView, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const graphData = useMemo(
    () => buildKnowledgeGraph(state.entries, state.favorites),
    [state.entries, state.favorites]
  );

  const filteredGraphData = useMemo(() => {
    if (!searchQuery.trim()) return graphData;

    const query = searchQuery.toLowerCase().trim();
    const matchedNodes = graphData.nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query) ||
        (CATEGORY_LABELS[node.category as GrammarCategory] || "").includes(query)
    );
    const matchedNodeIds = new Set(matchedNodes.map((n) => n.id));
    const matchedEdges = graphData.edges.filter(
      (edge) => matchedNodeIds.has(edge.source) && matchedNodeIds.has(edge.target)
    );
    const matchedCategories = new Set(matchedNodes.map((n) => n.category));
    const matchedClusters = graphData.clusters
      .filter((c) => matchedCategories.has(c.category))
      .map((c) => ({
        ...c,
        nodes: c.nodes.filter((n) => matchedNodeIds.has(n.id)),
      }))
      .filter((c) => c.nodes.length > 0);

    return {
      nodes: matchedNodes,
      edges: matchedEdges,
      clusters: matchedClusters,
    };
  }, [graphData, searchQuery]);

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

      {/* Search Bar */}
      {hasData && (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            marginBottom: 16,
          }}
        >
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="表現やカテゴリを検索..."
            placeholderTextColor={colors.muted}
            returnKeyType="done"
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 10,
              fontSize: 15,
              color: colors.foreground,
            }}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, padding: 4 }]}
            >
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
      )}

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
            {/* Search results info */}
            {searchQuery.trim().length > 0 && (
              <View className="mb-4">
                <Text className="text-sm text-muted">
                  「{searchQuery}」の検索結果: {filteredGraphData.nodes.length}件
                </Text>
              </View>
            )}

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
                <Text className="text-2xl font-bold text-foreground">{filteredGraphData.nodes.length}</Text>
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
                <Text className="text-2xl font-bold text-foreground">{filteredGraphData.clusters.length}</Text>
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
                <Text className="text-2xl font-bold text-foreground">{filteredGraphData.edges.length}</Text>
                <Text className="text-xs text-muted mt-1">つながり</Text>
              </View>
            </View>

            {/* Graph visualization */}
            {filteredGraphData.nodes.length > 0 ? (
              <KnowledgeGraphView data={filteredGraphData} entries={state.entries} />
            ) : (
              <View className="items-center py-8">
                <Text className="text-sm text-muted">一致するノードがありません</Text>
              </View>
            )}

            {/* Cluster breakdown */}
            <View className="mt-6">
              <Text className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                カテゴリ別の内訳
              </Text>
              {filteredGraphData.clusters.map((cluster) => (
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

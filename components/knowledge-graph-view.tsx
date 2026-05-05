import { useState, useMemo } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import Svg, { Circle, Line, G, Text as SvgText } from "react-native-svg";
import { useColors } from "@/hooks/use-colors";
import {
  KnowledgeGraphData,
  GraphNode,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "@/lib/knowledge-graph";

interface Props {
  data: KnowledgeGraphData;
  onNodePress?: (node: GraphNode) => void;
}

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
}

/**
 * Force-directed layout の簡易版
 * クラスタごとにノードを円形に配置し、クラスタ自体も円形に配置
 */
function layoutNodes(data: KnowledgeGraphData, width: number, height: number): PositionedNode[] {
  const positioned: PositionedNode[] = [];
  const clusters = data.clusters;
  const centerX = width / 2;
  const centerY = height / 2;

  if (clusters.length === 0) return positioned;

  // クラスタを円形に配置（1クラスタなら中央）
  const clusterRadius = clusters.length === 1 ? 0 : Math.min(width, height) * 0.3;

  clusters.forEach((cluster, clusterIdx) => {
    const clusterAngle = (2 * Math.PI * clusterIdx) / clusters.length - Math.PI / 2;
    const clusterCenterX = centerX + clusterRadius * Math.cos(clusterAngle);
    const clusterCenterY = centerY + clusterRadius * Math.sin(clusterAngle);

    // クラスタ内のノードを小さな円形に配置
    const nodeRadius = Math.min(55, 18 + cluster.nodes.length * 10);
    cluster.nodes.forEach((node, nodeIdx) => {
      let nodeX: number;
      let nodeY: number;

      if (cluster.nodes.length === 1) {
        nodeX = clusterCenterX;
        nodeY = clusterCenterY;
      } else {
        const nodeAngle = (2 * Math.PI * nodeIdx) / cluster.nodes.length - Math.PI / 2;
        nodeX = clusterCenterX + nodeRadius * Math.cos(nodeAngle);
        nodeY = clusterCenterY + nodeRadius * Math.sin(nodeAngle);
      }

      // 境界内に収める
      nodeX = Math.max(20, Math.min(width - 20, nodeX));
      nodeY = Math.max(20, Math.min(height - 20, nodeY));

      positioned.push({
        ...node,
        x: nodeX,
        y: nodeY,
      });
    });
  });

  return positioned;
}

export function KnowledgeGraphView({ data, onNodePress }: Props) {
  const colors = useColors();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const screenWidth = Dimensions.get("window").width - 40;
  const graphSize = Math.min(screenWidth, 380);

  const positionedNodes = useMemo(
    () => layoutNodes(data, graphSize, graphSize),
    [data, graphSize]
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    for (const node of positionedNodes) {
      map.set(node.id, node);
    }
    return map;
  }, [positionedNodes]);

  const handleNodePress = (node: GraphNode) => {
    setSelectedNode(node);
    onNodePress?.(node);
  };

  if (data.nodes.length === 0) {
    return null;
  }

  return (
    <View>
      {/* Graph SVG */}
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Svg width={graphSize} height={graphSize}>
          {/* Edges - colored by source node category */}
          {data.edges.map((edge, idx) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            // 同カテゴリならそのカテゴリの色、異なるカテゴリならグレー
            const isSameCategory = source.category === target.category;
            const edgeColor = isSameCategory
              ? CATEGORY_COLORS[source.category]
              : colors.border;
            const edgeOpacity = isSameCategory ? 0.4 : 0.25;

            return (
              <Line
                key={`edge-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={edgeColor}
                strokeWidth={isSameCategory ? 1.5 : 1}
                opacity={edgeOpacity}
              />
            );
          })}

          {/* Nodes */}
          {positionedNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const nodeColor = CATEGORY_COLORS[node.category];
            const radius = isSelected ? 14 : node.type === "favorite" ? 11 : 10;

            return (
              <G key={node.id}>
                {/* Glow effect for selected */}
                {isSelected && (
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 4}
                    fill={nodeColor}
                    opacity={0.2}
                  />
                )}
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={nodeColor}
                  opacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? colors.foreground : "transparent"}
                  strokeWidth={isSelected ? 2 : 0}
                  onPress={() => handleNodePress(node)}
                />
                {/* Show short label for smaller graphs */}
                {positionedNodes.length <= 10 && (
                  <SvgText
                    x={node.x}
                    y={node.y + radius + 13}
                    fontSize={9}
                    fill={colors.muted}
                    textAnchor="middle"
                  >
                    {node.label.slice(0, 8)}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap mt-4 mb-3" style={{ gap: 8 }}>
        {data.clusters.map((cluster) => (
          <View
            key={cluster.category}
            className="flex-row items-center"
            style={{
              backgroundColor: `${cluster.color}15`,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: cluster.color,
                marginRight: 5,
              }}
            />
            <Text style={{ fontSize: 11, color: colors.muted }}>
              {cluster.label} ({cluster.nodes.length})
            </Text>
          </View>
        ))}
      </View>

      {/* Selected node detail */}
      {selectedNode && (
        <Pressable
          onPress={() => setSelectedNode(null)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            borderWidth: 1.5,
            borderColor: CATEGORY_COLORS[selectedNode.category],
            marginTop: 4,
          }}
        >
          <View className="flex-row items-center mb-2">
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: CATEGORY_COLORS[selectedNode.category],
                marginRight: 8,
              }}
            />
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {CATEGORY_LABELS[selectedNode.category]}
              {selectedNode.type === "favorite" ? " / お気に入り" : " / 修正"}
            </Text>
          </View>

          {selectedNode.type === "correction" && (
            <>
              <Text style={{ fontSize: 14, color: colors.error, textDecorationLine: "line-through", marginBottom: 4 }}>
                {selectedNode.fullText}
              </Text>
              {selectedNode.corrected && (
                <Text style={{ fontSize: 14, color: colors.success, marginBottom: 4 }}>
                  {selectedNode.corrected}
                </Text>
              )}
            </>
          )}

          {selectedNode.type === "favorite" && (
            <Text style={{ fontSize: 14, color: colors.foreground, marginBottom: 4 }}>
              {selectedNode.fullText}
            </Text>
          )}

          {selectedNode.explanation && (
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              {selectedNode.explanation}
            </Text>
          )}

          <Text style={{ fontSize: 10, color: colors.muted, marginTop: 8, textAlign: "right" }}>
            タップで閉じる
          </Text>
        </Pressable>
      )}
    </View>
  );
}

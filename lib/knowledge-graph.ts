/**
 * Knowledge Graph - 文法カテゴリ分類とグラフデータ生成
 *
 * 修正ポイントやお気に入り表現を文法カテゴリに分類し、
 * ノードとエッジのデータ構造を生成する。
 */

import { CorrectionItem, DiaryEntry, FavoriteExpression } from "./store-context";

// 文法カテゴリの定義
export type GrammarCategory =
  | "tense"        // 時制
  | "preposition"  // 前置詞
  | "article"      // 冠詞
  | "plural"       // 複数形
  | "pronoun"      // 代名詞
  | "word_order"   // 語順
  | "vocabulary"   // 語彙
  | "conjunction"  // 接続詞
  | "verb_form"    // 動詞の形
  | "other";       // その他

export interface GraphNode {
  id: string;
  label: string;         // 表示テキスト（短縮版）
  fullText: string;      // 全文
  category: GrammarCategory;
  type: "correction" | "favorite";
  corrected?: string;    // 正しい表現
  explanation?: string;
  diaryDate?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphCluster {
  category: GrammarCategory;
  label: string;
  nodes: GraphNode[];
  color: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: GraphCluster[];
}

// カテゴリ表示名
export const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  tense: "時制",
  preposition: "前置詞",
  article: "冠詞",
  plural: "複数形",
  pronoun: "代名詞",
  word_order: "語順",
  vocabulary: "語彙",
  conjunction: "接続詞",
  verb_form: "動詞の形",
  other: "その他",
};

// カテゴリごとのカラー
export const CATEGORY_COLORS: Record<GrammarCategory, string> = {
  tense: "#3B82F6",       // blue
  preposition: "#8B5CF6", // purple
  article: "#EC4899",     // pink
  plural: "#F59E0B",      // amber
  pronoun: "#10B981",     // emerald
  word_order: "#F97316",  // orange
  vocabulary: "#06B6D4",  // cyan
  conjunction: "#84CC16", // lime
  verb_form: "#EF4444",   // red
  other: "#6B7280",       // gray
};

// キーワードベースのカテゴリ分類
const CATEGORY_KEYWORDS: Record<GrammarCategory, string[]> = {
  tense: [
    "tense", "past", "present", "future", "was", "were", "had", "have", "has",
    "will", "would", "did", "does", "時制", "過去", "現在", "未来", "完了",
    "ing", "ed form", "progressive", "perfect",
  ],
  preposition: [
    "preposition", "in", "on", "at", "to", "for", "with", "from", "by",
    "about", "前置詞", "of", "into", "onto", "upon",
  ],
  article: [
    "article", "the", "a ", "an ", "冠詞", "定冠詞", "不定冠詞",
    "no article", "missing article",
  ],
  plural: [
    "plural", "singular", "複数", "単数", "countable", "uncountable",
    "many", "much", "few", "little", "数えられ",
  ],
  pronoun: [
    "pronoun", "he", "she", "it", "they", "him", "her", "them",
    "代名詞", "which", "who", "whom", "whose", "that",
  ],
  word_order: [
    "word order", "order", "語順", "position", "placement", "並び",
    "inversion", "倒置",
  ],
  vocabulary: [
    "vocabulary", "word choice", "語彙", "expression", "idiom",
    "collocation", "単語", "表現", "phrase", "meaning",
  ],
  conjunction: [
    "conjunction", "接続詞", "because", "although", "however", "therefore",
    "but", "and", "or", "so", "yet", "nor",
  ],
  verb_form: [
    "verb", "動詞", "infinitive", "gerund", "participle", "modal",
    "auxiliary", "不定詞", "動名詞", "分詞", "助動詞",
  ],
  other: [],
};

/**
 * explanationテキストからカテゴリを推定する
 */
export function classifyCategory(explanation: string, original: string, corrected: string): GrammarCategory {
  const text = `${explanation} ${original} ${corrected}`.toLowerCase();

  let bestCategory: GrammarCategory = "other";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "other") continue;
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += keyword.length; // 長いキーワードほど重み付け
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as GrammarCategory;
    }
  }

  return bestCategory;
}

/**
 * 2つのノード間の関連度を計算（0〜1）
 */
function calculateSimilarity(a: GraphNode, b: GraphNode): number {
  // 同じカテゴリなら基本スコア
  if (a.category === b.category) return 0.7;

  // テキストの単語重複で追加スコア
  const wordsA = new Set(a.fullText.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.fullText.toLowerCase().split(/\s+/));
  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w) && w.length > 2) overlap++;
  }
  const similarity = overlap / Math.max(wordsA.size, wordsB.size, 1);
  return similarity * 0.5;
}

/**
 * ストアデータからナレッジグラフデータを生成する
 */
export function buildKnowledgeGraph(
  entries: DiaryEntry[],
  favorites: FavoriteExpression[]
): KnowledgeGraphData {
  const nodes: GraphNode[] = [];

  // 修正ポイントからノードを生成
  for (const entry of entries) {
    for (const correction of entry.corrections) {
      const category = classifyCategory(
        correction.explanation,
        correction.original,
        correction.corrected
      );
      nodes.push({
        id: `corr_${entry.id}_${correction.original.slice(0, 20)}`,
        label: correction.original.length > 20
          ? correction.original.slice(0, 20) + "..."
          : correction.original,
        fullText: correction.original,
        category,
        type: "correction",
        corrected: correction.corrected,
        explanation: correction.explanation,
        diaryDate: entry.date,
      });
    }
  }

  // お気に入りからノードを生成
  for (const fav of favorites) {
    const category = classifyCategory(
      fav.japanese || "",
      fav.english,
      fav.english
    );
    nodes.push({
      id: `fav_${fav.id}`,
      label: fav.english.length > 25 ? fav.english.slice(0, 25) + "..." : fav.english,
      fullText: fav.english,
      category,
      type: "favorite",
      explanation: fav.japanese,
      diaryDate: fav.addedDate,
    });
  }

  // エッジを生成（同カテゴリ内 + 類似度が高いもの）
  const edges: GraphEdge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const sim = calculateSimilarity(nodes[i], nodes[j]);
      if (sim >= 0.5) {
        edges.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
  }

  // クラスタリング
  const clusterMap = new Map<GrammarCategory, GraphNode[]>();
  for (const node of nodes) {
    if (!clusterMap.has(node.category)) {
      clusterMap.set(node.category, []);
    }
    clusterMap.get(node.category)!.push(node);
  }

  const clusters: GraphCluster[] = [];
  for (const [category, clusterNodes] of clusterMap) {
    clusters.push({
      category,
      label: CATEGORY_LABELS[category],
      nodes: clusterNodes,
      color: CATEGORY_COLORS[category],
    });
  }

  // クラスタサイズ降順でソート
  clusters.sort((a, b) => b.nodes.length - a.nodes.length);

  return { nodes, edges, clusters };
}

/**
 * Review Variations - 同じ文法パターンで異なる文を出題するユーティリティ
 *
 * ユーザーが同じ問題を繰り返すのではなく、同じ文法カテゴリの
 * 異なる問題をローテーションで出題することで脳への定着を促す。
 */

import { ReviewQuestion } from "./store-context";
import { classifyCategory, GrammarCategory, CATEGORY_LABELS } from "./knowledge-graph";

export interface QuizItem {
  /** 元のReviewQuestionのID */
  questionId: string;
  /** 文法カテゴリ */
  category: GrammarCategory;
  /** カテゴリ表示名 */
  categoryLabel: string;
  /** 間違い表現 */
  original: string;
  /** 正しい表現 */
  correct: string;
  /** 間違いを含む全文 */
  originalSentence: string;
  /** 正しい全文 */
  correctedSentence: string;
  /** 解説 */
  explanation: string;
  /** 復習回数 */
  reviewCount: number;
  /** 正解回数 */
  correctCount: number;
}

/**
 * ReviewQuestionにカテゴリを付与してQuizItemに変換する
 */
export function toQuizItem(q: ReviewQuestion): QuizItem {
  const category = classifyCategory(q.explanation, q.original, q.correct);
  return {
    questionId: q.id,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    original: q.original,
    correct: q.correct,
    originalSentence: q.originalSentence || "",
    correctedSentence: q.correctedSentence || "",
    explanation: q.explanation,
    reviewCount: q.reviewCount || 0,
    correctCount: q.correctCount || 0,
  };
}

/**
 * カテゴリ別にグループ化する
 */
export function groupByCategory(items: QuizItem[]): Map<GrammarCategory, QuizItem[]> {
  const groups = new Map<GrammarCategory, QuizItem[]>();
  for (const item of items) {
    const existing = groups.get(item.category) || [];
    existing.push(item);
    groups.set(item.category, existing);
  }
  return groups;
}

/**
 * バリエーション出題順を生成する
 *
 * 同じカテゴリの問題をまとめず、カテゴリを交互に出題する。
 * 各カテゴリ内では復習回数が少ない問題を優先する。
 *
 * 例: tense問題が3つ、preposition問題が2つある場合
 * → tense1, prep1, tense2, prep2, tense3 のように交互に出題
 */
export function generateVariedQuizOrder(questions: ReviewQuestion[]): QuizItem[] {
  if (questions.length === 0) return [];

  const items = questions.map(toQuizItem);
  const groups = groupByCategory(items);

  // 各カテゴリ内で復習回数が少ない順にソート
  for (const [, categoryItems] of groups) {
    categoryItems.sort((a, b) => {
      // 復習回数が少ないものを優先
      const reviewDiff = a.reviewCount - b.reviewCount;
      if (reviewDiff !== 0) return reviewDiff;
      // 同じなら正解率が低いものを優先
      const aRate = a.reviewCount > 0 ? a.correctCount / a.reviewCount : 0;
      const bRate = b.reviewCount > 0 ? b.correctCount / b.reviewCount : 0;
      return aRate - bRate;
    });
  }

  // カテゴリをラウンドロビンで交互に出題
  const result: QuizItem[] = [];
  const categoryQueues = Array.from(groups.values());

  // カテゴリ数が多い順にソート（均等に分散させるため）
  categoryQueues.sort((a, b) => b.length - a.length);

  let maxLen = 0;
  for (const q of categoryQueues) {
    if (q.length > maxLen) maxLen = q.length;
  }

  for (let i = 0; i < maxLen; i++) {
    for (const queue of categoryQueues) {
      if (i < queue.length) {
        result.push(queue[i]);
      }
    }
  }

  return result;
}

/**
 * 現在の問題と同じカテゴリの他の問題を取得する
 * （「同じパターンの他の問題」として表示するため）
 */
export function getSameCategoryQuestions(
  currentQuestionId: string,
  allQuestions: ReviewQuestion[]
): QuizItem[] {
  const items = allQuestions.map(toQuizItem);
  const current = items.find((i) => i.questionId === currentQuestionId);
  if (!current) return [];

  return items.filter(
    (i) => i.category === current.category && i.questionId !== currentQuestionId
  );
}

import { describe, it, expect } from "vitest";
import {
  toQuizItem,
  groupByCategory,
  generateVariedQuizOrder,
  getSameCategoryQuestions,
} from "../lib/review-variations";
import type { ReviewQuestion } from "../lib/store-context";

function makeQuestion(overrides: Partial<ReviewQuestion> & { id: string }): ReviewQuestion {
  return {
    diaryId: "diary-1",
    original: "I go to school yesterday",
    correct: "went",
    explanation: "Use past tense for actions in the past",
    originalSentence: "I go to school yesterday.",
    correctedSentence: "I went to school yesterday.",
    mastered: false,
    reviewCount: 0,
    correctCount: 0,
    ...overrides,
  };
}

describe("toQuizItem", () => {
  it("converts ReviewQuestion to QuizItem with category", () => {
    const q = makeQuestion({ id: "q1" });
    const item = toQuizItem(q);
    expect(item.questionId).toBe("q1");
    expect(item.category).toBeDefined();
    expect(item.categoryLabel).toBeDefined();
    expect(item.original).toBe("I go to school yesterday");
    expect(item.correct).toBe("went");
  });
});

describe("groupByCategory", () => {
  it("groups items by their grammar category", () => {
    const questions: ReviewQuestion[] = [
      makeQuestion({ id: "q1", explanation: "Use past tense", original: "go", correct: "went" }),
      makeQuestion({ id: "q2", explanation: "Use past tense", original: "eat", correct: "ate" }),
      makeQuestion({ id: "q3", explanation: "Wrong preposition", original: "in Monday", correct: "on Monday" }),
    ];
    const items = questions.map(toQuizItem);
    const groups = groupByCategory(items);
    expect(groups.size).toBeGreaterThanOrEqual(1);
    // At least one group should have 2 items (the tense ones)
    const sizes = Array.from(groups.values()).map((g) => g.length);
    expect(Math.max(...sizes)).toBeGreaterThanOrEqual(2);
  });
});

describe("generateVariedQuizOrder", () => {
  it("returns empty array for no questions", () => {
    const result = generateVariedQuizOrder([]);
    expect(result).toEqual([]);
  });

  it("returns all questions for a single question", () => {
    const questions = [makeQuestion({ id: "q1" })];
    const result = generateVariedQuizOrder(questions);
    expect(result).toHaveLength(1);
    expect(result[0].questionId).toBe("q1");
  });

  it("interleaves different categories", () => {
    const questions: ReviewQuestion[] = [
      makeQuestion({ id: "t1", explanation: "Use past tense for past actions", original: "go", correct: "went" }),
      makeQuestion({ id: "t2", explanation: "Use past tense for past actions", original: "eat", correct: "ate" }),
      makeQuestion({ id: "p1", explanation: "Wrong preposition used", original: "in Monday", correct: "on Monday" }),
      makeQuestion({ id: "p2", explanation: "Wrong preposition used", original: "at the morning", correct: "in the morning" }),
    ];
    const result = generateVariedQuizOrder(questions);
    expect(result).toHaveLength(4);

    // Should not have two consecutive items from the same category
    // (unless there's only one category)
    const categories = result.map((r) => r.category);
    const uniqueCategories = new Set(categories);
    if (uniqueCategories.size > 1) {
      let consecutive = false;
      for (let i = 0; i < categories.length - 1; i++) {
        if (categories[i] === categories[i + 1]) {
          consecutive = true;
          break;
        }
      }
      expect(consecutive).toBe(false);
    }
  });

  it("prioritizes questions with fewer reviews", () => {
    const questions: ReviewQuestion[] = [
      makeQuestion({ id: "q1", reviewCount: 5, correctCount: 3, explanation: "past tense", original: "go", correct: "went" }),
      makeQuestion({ id: "q2", reviewCount: 0, correctCount: 0, explanation: "past tense", original: "eat", correct: "ate" }),
    ];
    const result = generateVariedQuizOrder(questions);
    // q2 (0 reviews) should come before q1 (5 reviews) within same category
    const q2Index = result.findIndex((r) => r.questionId === "q2");
    const q1Index = result.findIndex((r) => r.questionId === "q1");
    expect(q2Index).toBeLessThan(q1Index);
  });
});

describe("getSameCategoryQuestions", () => {
  it("returns questions from the same category excluding current", () => {
    const questions: ReviewQuestion[] = [
      makeQuestion({ id: "t1", explanation: "Use past tense", original: "go", correct: "went" }),
      makeQuestion({ id: "t2", explanation: "Use past tense", original: "eat", correct: "ate" }),
      makeQuestion({ id: "p1", explanation: "Wrong preposition", original: "in Monday", correct: "on Monday" }),
    ];
    const same = getSameCategoryQuestions("t1", questions);
    // t2 should be in the same category as t1
    expect(same.some((s) => s.questionId === "t2")).toBe(true);
    // t1 itself should not be included
    expect(same.some((s) => s.questionId === "t1")).toBe(false);
  });

  it("returns empty array for unknown question id", () => {
    const questions = [makeQuestion({ id: "q1" })];
    const same = getSameCategoryQuestions("unknown", questions);
    expect(same).toEqual([]);
  });
});

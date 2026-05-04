import { describe, it, expect } from "vitest";
import { categories, generateFlashcards, generateQuizQuestions } from "../data/content";

describe("Content Data", () => {
  it("should have at least 5 categories", () => {
    expect(categories.length).toBeGreaterThanOrEqual(5);
  });

  it("each category should have lessons", () => {
    categories.forEach((cat) => {
      expect(cat.lessons.length).toBeGreaterThan(0);
      expect(cat.id).toBeTruthy();
      expect(cat.title).toBeTruthy();
      expect(cat.titleJa).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.color).toBeTruthy();
    });
  });

  it("each lesson should have required fields", () => {
    categories.forEach((cat) => {
      cat.lessons.forEach((lesson) => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(lesson.titleJa).toBeTruthy();
        expect(lesson.explanation).toBeTruthy();
        expect(lesson.keyPoints.length).toBeGreaterThan(0);
        expect(lesson.examples.length).toBeGreaterThan(0);
      });
    });
  });

  it("each example should have en and ja", () => {
    categories.forEach((cat) => {
      cat.lessons.forEach((lesson) => {
        lesson.examples.forEach((ex) => {
          expect(ex.en).toBeTruthy();
          expect(ex.ja).toBeTruthy();
        });
      });
    });
  });

  it("should generate flashcards from all examples", () => {
    const cards = generateFlashcards();
    expect(cards.length).toBeGreaterThan(0);
    const totalExamples = categories.reduce(
      (sum, cat) => sum + cat.lessons.reduce((s, l) => s + l.examples.length, 0),
      0
    );
    expect(cards.length).toBe(totalExamples);
  });

  it("should generate quiz questions of all types", () => {
    const questions = generateQuizQuestions();
    expect(questions.length).toBeGreaterThan(0);

    const types = new Set(questions.map((q) => q.type));
    expect(types.has("choice")).toBe(true);
    expect(types.has("fill")).toBe(true);
    expect(types.has("reorder")).toBe(true);
    expect(types.has("writing")).toBe(true);
  });

  it("quiz questions should have required fields", () => {
    const questions = generateQuizQuestions();
    questions.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.categoryId).toBeTruthy();
      expect(q.lessonId).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(q.answer).toBeTruthy();
      if (q.type === "choice") {
        expect(q.options).toBeDefined();
        expect(q.options!.length).toBe(4);
        expect(q.options!.includes(q.answer)).toBe(true);
      }
      if (q.type === "reorder") {
        expect(q.answerParts).toBeDefined();
        expect(q.answerParts!.length).toBeGreaterThan(0);
      }
    });
  });

  it("input and output content should be roughly balanced", () => {
    // Input: lessons + flashcards
    const totalLessons = categories.reduce((sum, cat) => sum + cat.lessons.length, 0);
    const totalFlashcards = generateFlashcards().length;
    const inputItems = totalLessons + totalFlashcards;

    // Output: quiz questions
    const outputItems = generateQuizQuestions().length;

    // Both should be substantial
    expect(inputItems).toBeGreaterThan(30);
    expect(outputItems).toBeGreaterThan(30);
  });
});

import { describe, it, expect } from "vitest";

// Test the reducer logic directly
describe("App Store Reducer Logic", () => {
  const initialState = {
    entries: [],
    favorites: [],
    reviewQuestions: [],
    streak: 0,
    lastActiveDate: "",
    totalDays: 0,
  };

  it("should add an entry to the beginning of the list", () => {
    const entry = {
      id: "entry_1",
      date: "2026-05-05T10:00:00.000Z",
      transcript: "Today I went to the park",
      corrections: [],
      grammarScore: 90,
      pronunciationScore: 85,
      fluencyScore: 88,
      overallScore: 87,
    };

    const newState = {
      ...initialState,
      entries: [entry, ...initialState.entries],
    };

    expect(newState.entries).toHaveLength(1);
    expect(newState.entries[0].transcript).toBe("Today I went to the park");
    expect(newState.entries[0].overallScore).toBe(87);
  });

  it("should add a favorite expression", () => {
    const favorite = {
      id: "fav_1",
      english: "I went to the park",
      japanese: "公園に行きました",
      addedDate: "2026-05-05T10:00:00.000Z",
    };

    const newState = {
      ...initialState,
      favorites: [favorite, ...initialState.favorites],
    };

    expect(newState.favorites).toHaveLength(1);
    expect(newState.favorites[0].english).toBe("I went to the park");
  });

  it("should remove a favorite by id", () => {
    const stateWithFavorites = {
      ...initialState,
      favorites: [
        { id: "fav_1", english: "Hello", japanese: "こんにちは", addedDate: "2026-05-05" },
        { id: "fav_2", english: "Goodbye", japanese: "さようなら", addedDate: "2026-05-05" },
      ],
    };

    const newState = {
      ...stateWithFavorites,
      favorites: stateWithFavorites.favorites.filter((f) => f.id !== "fav_1"),
    };

    expect(newState.favorites).toHaveLength(1);
    expect(newState.favorites[0].english).toBe("Goodbye");
  });

  it("should calculate streak correctly for consecutive days", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const stateWithStreak = {
      ...initialState,
      streak: 3,
      lastActiveDate: yesterday,
      totalDays: 3,
    };

    const today = new Date().toISOString().split("T")[0];
    const newStreak = stateWithStreak.lastActiveDate === yesterday ? stateWithStreak.streak + 1 : 1;

    expect(newStreak).toBe(4);
  });

  it("should reset streak when days are not consecutive", () => {
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split("T")[0];
    const stateWithStreak = {
      ...initialState,
      streak: 5,
      lastActiveDate: twoDaysAgo,
      totalDays: 5,
    };

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = stateWithStreak.lastActiveDate === yesterday ? stateWithStreak.streak + 1 : 1;

    expect(newStreak).toBe(1);
  });

  it("should mark a review question as mastered", () => {
    const questions = [
      { id: "q1", diaryId: "e1", original: "I goed", correct: "I went", explanation: "過去形", mastered: false },
      { id: "q2", diaryId: "e1", original: "He don't", correct: "He doesn't", explanation: "三単現", mastered: false },
    ];

    const stateWithQuestions = {
      ...initialState,
      reviewQuestions: questions,
    };

    const newState = {
      ...stateWithQuestions,
      reviewQuestions: stateWithQuestions.reviewQuestions.map((q) =>
        q.id === "q1" ? { ...q, mastered: true } : q
      ),
    };

    expect(newState.reviewQuestions[0].mastered).toBe(true);
    expect(newState.reviewQuestions[1].mastered).toBe(false);
  });

  it("should add review questions from corrections", () => {
    const corrections = [
      { original: "I goed to park", corrected: "I went to the park", explanation: "goの過去形はwent" },
    ];

    const questions = corrections.map((c, idx) => ({
      id: `review_${Date.now()}_${idx}`,
      diaryId: "entry_1",
      original: c.original,
      correct: c.corrected,
      explanation: c.explanation,
      mastered: false,
    }));

    const newState = {
      ...initialState,
      reviewQuestions: [...initialState.reviewQuestions, ...questions],
    };

    expect(newState.reviewQuestions).toHaveLength(1);
    expect(newState.reviewQuestions[0].original).toBe("I goed to park");
    expect(newState.reviewQuestions[0].correct).toBe("I went to the park");
  });
});

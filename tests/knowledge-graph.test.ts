import { describe, it, expect } from "vitest";
import { classifyCategory, buildKnowledgeGraph } from "../lib/knowledge-graph";
import { DiaryEntry, FavoriteExpression } from "../lib/store-context";

describe("Knowledge Graph - classifyCategory", () => {
  it("should classify tense-related corrections", () => {
    const result = classifyCategory(
      "Use past tense 'went' instead of 'go'",
      "I go to school yesterday",
      "I went to school yesterday"
    );
    expect(result).toBe("tense");
  });

  it("should classify preposition-related corrections", () => {
    const result = classifyCategory(
      "Use 'at' for specific times, not 'in'",
      "I arrived in 3 o'clock",
      "I arrived at 3 o'clock"
    );
    expect(result).toBe("preposition");
  });

  it("should classify article-related corrections", () => {
    const result = classifyCategory(
      "Missing article 'the' before a specific noun",
      "I went to park",
      "I went to the park"
    );
    expect(result).toBe("article");
  });

  it("should classify vocabulary-related corrections", () => {
    const result = classifyCategory(
      "Better word choice: use 'interesting' instead of 'funny' in this context",
      "The movie was funny",
      "The movie was interesting"
    );
    expect(result).toBe("vocabulary");
  });

  it("should return 'other' when no category matches", () => {
    const result = classifyCategory("", "x", "y");
    expect(result).toBe("other");
  });
});

describe("Knowledge Graph - buildKnowledgeGraph", () => {
  it("should return empty graph when no data", () => {
    const result = buildKnowledgeGraph([], []);
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
    expect(result.clusters).toHaveLength(0);
  });

  it("should create nodes from diary corrections", () => {
    const entries: DiaryEntry[] = [
      {
        id: "entry_1",
        date: "2025-01-01T00:00:00.000Z",
        transcript: "I go to school yesterday",
        correctedTranscript: "I went to school yesterday",
        corrections: [
          {
            original: "go",
            corrected: "went",
            explanation: "Use past tense for past events",
          },
        ],
        grammarScore: 70,
        pronunciationScore: 80,
        fluencyScore: 75,
        overallScore: 75,
      },
    ];

    const result = buildKnowledgeGraph(entries, []);
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].type).toBe("correction");
    expect(result.nodes[0].category).toBe("tense");
    expect(result.clusters.length).toBeGreaterThan(0);
  });

  it("should create nodes from favorites", () => {
    const favorites: FavoriteExpression[] = [
      {
        id: "fav_1",
        english: "I'm looking forward to it",
        japanese: "楽しみにしています",
        addedDate: "2025-01-01T00:00:00.000Z",
      },
    ];

    const result = buildKnowledgeGraph([], favorites);
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].type).toBe("favorite");
  });

  it("should create edges between nodes in the same category", () => {
    const entries: DiaryEntry[] = [
      {
        id: "entry_1",
        date: "2025-01-01T00:00:00.000Z",
        transcript: "I go yesterday and I eat lunch",
        correctedTranscript: "I went yesterday and I ate lunch",
        corrections: [
          {
            original: "go",
            corrected: "went",
            explanation: "Use past tense for past events",
          },
          {
            original: "eat",
            corrected: "ate",
            explanation: "Use past tense: ate is the past form of eat",
          },
        ],
        grammarScore: 60,
        pronunciationScore: 80,
        fluencyScore: 70,
        overallScore: 70,
      },
    ];

    const result = buildKnowledgeGraph(entries, []);
    expect(result.nodes.length).toBe(2);
    // Both are tense-related (same category) + same diary date, should be connected
    expect(result.edges.length).toBeGreaterThan(0);
  });

  it("should create edges between related categories", () => {
    const entries: DiaryEntry[] = [
      {
        id: "entry_1",
        date: "2025-01-01T00:00:00.000Z",
        transcript: "I go yesterday",
        correctedTranscript: "I went yesterday",
        corrections: [
          {
            original: "go",
            corrected: "went",
            explanation: "Use past tense for past events",
          },
        ],
        grammarScore: 70,
        pronunciationScore: 80,
        fluencyScore: 75,
        overallScore: 75,
      },
      {
        id: "entry_2",
        date: "2025-01-02T00:00:00.000Z",
        transcript: "I have eat lunch",
        correctedTranscript: "I have eaten lunch",
        corrections: [
          {
            original: "have eat",
            corrected: "have eaten",
            explanation: "Use the past participle verb form after 'have'",
          },
        ],
        grammarScore: 70,
        pronunciationScore: 80,
        fluencyScore: 75,
        overallScore: 75,
      },
    ];

    const result = buildKnowledgeGraph(entries, []);
    expect(result.nodes.length).toBe(2);
    // tense and verb_form are related categories, should be connected
    expect(result.edges.length).toBeGreaterThan(0);
  });
});

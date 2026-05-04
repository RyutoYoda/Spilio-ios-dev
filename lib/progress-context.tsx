import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export interface LessonProgress {
  completed: boolean;
  score: number; // 0-100
  lastStudied: string; // ISO date
}

export interface QuizResult {
  categoryId: string;
  lessonId: string;
  type: "quiz" | "fill" | "reorder" | "writing";
  score: number;
  total: number;
  date: string;
}

export interface FlashcardProgress {
  known: string[]; // card IDs marked as known
  unknown: string[]; // card IDs still learning
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>; // key: "categoryId:lessonId"
  quizResults: QuizResult[];
  flashcards: FlashcardProgress;
  streak: number;
  lastActiveDate: string;
  totalStudyDays: number;
}

type ProgressAction =
  | { type: "COMPLETE_LESSON"; categoryId: string; lessonId: string; score: number }
  | { type: "ADD_QUIZ_RESULT"; result: QuizResult }
  | { type: "MARK_FLASHCARD_KNOWN"; cardId: string }
  | { type: "MARK_FLASHCARD_UNKNOWN"; cardId: string }
  | { type: "UPDATE_STREAK" }
  | { type: "LOAD_STATE"; state: ProgressState };

const initialState: ProgressState = {
  lessons: {},
  quizResults: [],
  flashcards: { known: [], unknown: [] },
  streak: 0,
  lastActiveDate: "",
  totalStudyDays: 0,
};

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "COMPLETE_LESSON": {
      const key = `${action.categoryId}:${action.lessonId}`;
      return {
        ...state,
        lessons: {
          ...state.lessons,
          [key]: {
            completed: true,
            score: Math.max(state.lessons[key]?.score || 0, action.score),
            lastStudied: new Date().toISOString(),
          },
        },
      };
    }
    case "ADD_QUIZ_RESULT": {
      return {
        ...state,
        quizResults: [...state.quizResults, action.result],
      };
    }
    case "MARK_FLASHCARD_KNOWN": {
      const known = [...new Set([...state.flashcards.known, action.cardId])];
      const unknown = state.flashcards.unknown.filter((id) => id !== action.cardId);
      return { ...state, flashcards: { known, unknown } };
    }
    case "MARK_FLASHCARD_UNKNOWN": {
      const unknown = [...new Set([...state.flashcards.unknown, action.cardId])];
      const known = state.flashcards.known.filter((id) => id !== action.cardId);
      return { ...state, flashcards: { known, unknown } };
    }
    case "UPDATE_STREAK": {
      const today = new Date().toISOString().split("T")[0];
      if (state.lastActiveDate === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
      return {
        ...state,
        streak: newStreak,
        lastActiveDate: today,
        totalStudyDays: state.totalStudyDays + 1,
      };
    }
    case "LOAD_STATE":
      return action.state;
    default:
      return state;
  }
}

const STORAGE_KEY = "@english_master_progress";

interface ProgressContextType {
  state: ProgressState;
  completeLesson: (categoryId: string, lessonId: string, score: number) => void;
  addQuizResult: (result: QuizResult) => void;
  markFlashcardKnown: (cardId: string) => void;
  markFlashcardUnknown: (cardId: string) => void;
  updateStreak: () => void;
  getCategoryProgress: (categoryId: string) => number;
  getTotalProgress: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: "LOAD_STATE", state: JSON.parse(stored) });
        }
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
    })();
  }, []);

  // Save to AsyncStorage on state change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save progress:", e);
      }
    })();
  }, [state]);

  const completeLesson = useCallback((categoryId: string, lessonId: string, score: number) => {
    dispatch({ type: "COMPLETE_LESSON", categoryId, lessonId, score });
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  const addQuizResult = useCallback((result: QuizResult) => {
    dispatch({ type: "ADD_QUIZ_RESULT", result });
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  const markFlashcardKnown = useCallback((cardId: string) => {
    dispatch({ type: "MARK_FLASHCARD_KNOWN", cardId });
  }, []);

  const markFlashcardUnknown = useCallback((cardId: string) => {
    dispatch({ type: "MARK_FLASHCARD_UNKNOWN", cardId });
  }, []);

  const updateStreak = useCallback(() => {
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  const getCategoryProgress = useCallback(
    (categoryId: string) => {
      const categoryLessons = Object.entries(state.lessons).filter(([key]) =>
        key.startsWith(`${categoryId}:`)
      );
      if (categoryLessons.length === 0) return 0;
      const completed = categoryLessons.filter(([, v]) => v.completed).length;
      return Math.round((completed / categoryLessons.length) * 100);
    },
    [state.lessons]
  );

  const getTotalProgress = useCallback(() => {
    const allLessons = Object.values(state.lessons);
    if (allLessons.length === 0) return 0;
    const completed = allLessons.filter((l) => l.completed).length;
    return Math.round((completed / allLessons.length) * 100);
  }, [state.lessons]);

  return (
    <ProgressContext.Provider
      value={{
        state,
        completeLesson,
        addQuizResult,
        markFlashcardKnown,
        markFlashcardUnknown,
        updateStreak,
        getCategoryProgress,
        getTotalProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

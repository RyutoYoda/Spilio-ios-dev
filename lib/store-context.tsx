import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export interface CorrectionItem {
  original: string;
  corrected: string;
  explanation: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // ISO date
  transcript: string; // what user said
  correctedTranscript: string; // AI-corrected full text
  corrections: CorrectionItem[];
  grammarScore: number; // 0-100
  pronunciationScore: number; // 0-100
  fluencyScore: number; // 0-100
  overallScore: number; // 0-100
}

export interface FavoriteExpression {
  id: string;
  english: string;
  japanese: string;
  note?: string;
  addedDate: string;
}

export interface ReviewQuestion {
  id: string;
  diaryId: string;
  original: string; // wrong expression
  correct: string; // correct expression
  explanation: string;
  originalSentence?: string; // full original sentence
  correctedSentence?: string; // full corrected sentence
  mastered: boolean;
  lastReviewed?: string;
  reviewCount: number; // number of times reviewed
  correctCount: number; // number of times answered correctly
}

export interface AppState {
  entries: DiaryEntry[];
  favorites: FavoriteExpression[];
  reviewQuestions: ReviewQuestion[];
  streak: number;
  lastActiveDate: string;
  totalDays: number;
}

type AppAction =
  | { type: "ADD_ENTRY"; entry: DiaryEntry }
  | { type: "DELETE_ENTRY"; id: string }
  | { type: "ADD_FAVORITE"; favorite: FavoriteExpression }
  | { type: "REMOVE_FAVORITE"; id: string }
  | { type: "ADD_REVIEW_QUESTIONS"; questions: ReviewQuestion[] }
  | { type: "MARK_MASTERED"; questionId: string }
  | { type: "MARK_REVIEWED"; questionId: string; correct: boolean }
  | { type: "UPDATE_STREAK" }
  | { type: "LOAD_STATE"; state: AppState };

const REQUIRED_REVIEWS = 6;

const initialState: AppState = {
  entries: [],
  favorites: [],
  reviewQuestions: [],
  streak: 0,
  lastActiveDate: "",
  totalDays: 0,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_ENTRY":
      return { ...state, entries: [action.entry, ...state.entries] };
    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.id),
        reviewQuestions: state.reviewQuestions.filter((q) => q.diaryId !== action.id),
      };
    case "ADD_FAVORITE":
      return { ...state, favorites: [action.favorite, ...state.favorites] };
    case "REMOVE_FAVORITE":
      return { ...state, favorites: state.favorites.filter((f) => f.id !== action.id) };
    case "ADD_REVIEW_QUESTIONS":
      return { ...state, reviewQuestions: [...state.reviewQuestions, ...action.questions] };
    case "MARK_MASTERED":
      return {
        ...state,
        reviewQuestions: state.reviewQuestions.map((q) =>
          q.id === action.questionId ? { ...q, mastered: true, lastReviewed: new Date().toISOString() } : q
        ),
      };
    case "MARK_REVIEWED": {
      return {
        ...state,
        reviewQuestions: state.reviewQuestions.map((q) => {
          if (q.id !== action.questionId) return q;
          const newReviewCount = (q.reviewCount || 0) + 1;
          const newCorrectCount = (q.correctCount || 0) + (action.correct ? 1 : 0);
          // Auto-master after REQUIRED_REVIEWS correct answers
          const shouldMaster = newCorrectCount >= REQUIRED_REVIEWS;
          return {
            ...q,
            reviewCount: newReviewCount,
            correctCount: newCorrectCount,
            lastReviewed: new Date().toISOString(),
            mastered: shouldMaster,
          };
        }),
      };
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
        totalDays: state.totalDays + 1,
      };
    }
    case "LOAD_STATE":
      return action.state;
    default:
      return state;
  }
}

const STORAGE_KEY = "@english_rehearsal_store";

interface StoreContextType {
  state: AppState;
  addEntry: (entry: DiaryEntry) => void;
  deleteEntry: (id: string) => void;
  addFavorite: (favorite: FavoriteExpression) => void;
  removeFavorite: (id: string) => void;
  addReviewQuestions: (questions: ReviewQuestion[]) => void;
  markMastered: (questionId: string) => void;
  markReviewed: (questionId: string, correct: boolean) => void;
  updateStreak: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: "LOAD_STATE", state: JSON.parse(stored) });
        }
      } catch (e) {
        console.error("Failed to load state:", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save state:", e);
      }
    })();
  }, [state]);

  const addEntry = useCallback((entry: DiaryEntry) => {
    dispatch({ type: "ADD_ENTRY", entry });
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    dispatch({ type: "DELETE_ENTRY", id });
  }, []);

  const addFavorite = useCallback((favorite: FavoriteExpression) => {
    dispatch({ type: "ADD_FAVORITE", favorite });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    dispatch({ type: "REMOVE_FAVORITE", id });
  }, []);

  const addReviewQuestions = useCallback((questions: ReviewQuestion[]) => {
    dispatch({ type: "ADD_REVIEW_QUESTIONS", questions });
  }, []);

  const markMastered = useCallback((questionId: string) => {
    dispatch({ type: "MARK_MASTERED", questionId });
  }, []);

  const markReviewed = useCallback((questionId: string, correct: boolean) => {
    dispatch({ type: "MARK_REVIEWED", questionId, correct });
  }, []);

  const updateStreak = useCallback(() => {
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  return (
    <StoreContext.Provider
      value={{ state, addEntry, deleteEntry, addFavorite, removeFavorite, addReviewQuestions, markMastered, markReviewed, updateStreak }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

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
  | { type: "ADD_FAVORITE"; favorite: FavoriteExpression }
  | { type: "REMOVE_FAVORITE"; id: string }
  | { type: "ADD_REVIEW_QUESTIONS"; questions: ReviewQuestion[] }
  | { type: "MARK_MASTERED"; questionId: string }
  | { type: "UPDATE_STREAK" }
  | { type: "LOAD_STATE"; state: AppState };

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
  addFavorite: (favorite: FavoriteExpression) => void;
  removeFavorite: (id: string) => void;
  addReviewQuestions: (questions: ReviewQuestion[]) => void;
  markMastered: (questionId: string) => void;
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

  const updateStreak = useCallback(() => {
    dispatch({ type: "UPDATE_STREAK" });
  }, []);

  return (
    <StoreContext.Provider
      value={{ state, addEntry, addFavorite, removeFavorite, addReviewQuestions, markMastered, updateStreak }}
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

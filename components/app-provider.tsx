'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultAircraftEntries, defaultQuestions } from '@/lib/mock-data';
import type { AircraftEntry, Profile, Question, QuizAttempt, Role } from '@/lib/types';

const STORAGE_KEY = 'aircraft-quiz-demo-store';
const SESSION_KEY = 'aircraft-quiz-session';

type Store = {
  profiles: Profile[];
  questions: Question[];
  attempts: QuizAttempt[];
  encyclopedia: AircraftEntry[];
};

const initialStore: Store = {
  profiles: [
    {
      id: 'admin-1',
      email: 'admin@aircraftquiz.local',
      nickname: 'CaptainAtlas',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  questions: defaultQuestions,
  attempts: [],
  encyclopedia: defaultAircraftEntries
};

const AppContext = createContext<{
  profiles: Profile[];
  questions: Question[];
  attempts: QuizAttempt[];
  session: Profile | null;
  publishedQuestions: Question[];
  encyclopedia: AircraftEntry[];
  signUp: (payload: { email: string; nickname: string; password: string }) => Promise<void>;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  saveQuestion: (question: Omit<Question, 'id' | 'createdAt'> & { id?: string }) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addAttempt: (attempt: Omit<QuizAttempt, 'id' | 'createdAt'> & { id?: string }) => void;
  getUserAttempts: (userId: string) => QuizAttempt[];
  getLeaderboard: () => Array<{ rank: number; profile: Profile; totalScore: number; averageAccuracy: number; quizCount: number }>;
} | null>(null);

function readStore(): Store {
  if (typeof window === 'undefined') return initialStore;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
    return initialStore;
  }

  try {
    return JSON.parse(raw) as Store;
  } catch {
    return initialStore;
  }
}

function writeStore(next: Store) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(initialStore);
  const [session, setSession] = useState<Profile | null>(null);

  useEffect(() => {
    const saved = readStore();
    setStore(saved);

    const current = localStorage.getItem(SESSION_KEY);
    if (current) {
      try {
        setSession(JSON.parse(current) as Profile);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const syncStore = (next: Store) => {
    setStore(next);
    writeStore(next);
  };

  const signUp = async ({ email, nickname, password }: { email: string; nickname: string; password: string }) => {
    const normalized = email.trim();
    const cleanNickname = nickname.trim();

    if (!normalized || !cleanNickname || !password.trim()) {
      throw new Error('필수 정보를 모두 입력해 주세요.');
    }

    const nextStore = readStore();
    const existing = nextStore.profiles.some((profile) => profile.email.toLowerCase() === normalized.toLowerCase());
    if (existing) {
      throw new Error('이미 등록된 이메일입니다.');
    }

    const freshProfile: Profile = {
      id: `user-${Date.now()}`,
      email: normalized,
      nickname: cleanNickname,
      role: cleanNickname.toLowerCase().includes('captain') || email.toLowerCase().includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    const updated = {
      ...nextStore,
      profiles: [freshProfile, ...nextStore.profiles]
    };

    syncStore(updated);
    setSession(freshProfile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(freshProfile));
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const normalized = email.trim();
    if (!normalized || !password.trim()) {
      throw new Error('이메일과 비밀번호를 입력해 주세요.');
    }

    const nextStore = readStore();
    const candidate = nextStore.profiles.find((profile) => profile.email.toLowerCase() === normalized.toLowerCase());
    if (!candidate) {
      throw new Error('등록된 계정을 찾을 수 없습니다.');
    }

    if (password === 'admin123' && candidate.email === 'admin@aircraftquiz.local') {
      setSession(candidate);
      localStorage.setItem(SESSION_KEY, JSON.stringify(candidate));
      return;
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 6자리 이상이어야 합니다.');
    }

    setSession(candidate);
    localStorage.setItem(SESSION_KEY, JSON.stringify(candidate));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const saveQuestion = (question: Omit<Question, 'id' | 'createdAt'> & { id?: string }) => {
    const fresh: Question = {
      ...question,
      id: question.id || `question-${Date.now()}`,
      createdAt: new Date().toISOString(),
      options: question.options.length ? question.options : [question.optionA, question.optionB, question.optionC, question.optionD]
    };

    const nextStore = readStore();
    const index = nextStore.questions.findIndex((item) => item.id === fresh.id);
    if (index >= 0) {
      nextStore.questions[index] = { ...nextStore.questions[index], ...fresh };
    } else {
      nextStore.questions.unshift(fresh);
    }
    syncStore(nextStore);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const nextStore = readStore();
    nextStore.questions = nextStore.questions.map((question) => (question.id === id ? { ...question, ...updates } : question));
    syncStore(nextStore);
  };

  const deleteQuestion = (id: string) => {
    const nextStore = readStore();
    nextStore.questions = nextStore.questions.filter((question) => question.id !== id);
    syncStore(nextStore);
  };

  const addAttempt = (attempt: Omit<QuizAttempt, 'id' | 'createdAt'> & { id?: string }) => {
    const nextStore = readStore();
    const freshAttempt: QuizAttempt = {
      ...attempt,
      id: attempt.id || `attempt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    nextStore.attempts.unshift(freshAttempt);
    syncStore(nextStore);
  };

  const getUserAttempts = (userId: string) => {
    return store.attempts.filter((attempt) => attempt.userId === userId);
  };

  const getLeaderboard = () => {
    const leaderboard = store.profiles.map((profile) => {
      const attempts = store.attempts.filter((attempt) => attempt.userId === profile.id);
      const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const averageAccuracy = attempts.length > 0 ? attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / attempts.length : 0;
      const quizCount = attempts.length;

      return {
        rank: 0,
        profile,
        totalScore,
        averageAccuracy,
        quizCount
      };
    });

    return leaderboard.sort((a, b) => b.totalScore - a.totalScore || b.averageAccuracy - a.averageAccuracy).map((entry, index) => ({ ...entry, rank: index + 1 }));
  };

  const value = useMemo(
    () => ({
      profiles: store.profiles,
      questions: store.questions,
      attempts: store.attempts,
      session,
      publishedQuestions: store.questions.filter((item) => item.published),
      encyclopedia: store.encyclopedia,
      signUp,
      signIn,
      logout,
      saveQuestion,
      updateQuestion,
      deleteQuestion,
      addAttempt,
      getUserAttempts,
      getLeaderboard
    }),
    [store, session]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

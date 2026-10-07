export type Difficulty = 'easy' | 'medium' | 'hard';
export type Role = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  nickname: string;
  role: Role;
  createdAt: string;
}

export interface Question {
  id: string;
  imageUrl: string;
  aircraftType: string;
  airline: string;
  registration: string;
  difficulty: Difficulty;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
  published: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  createdAt: string;
}

export interface AircraftEntry {
  id: string;
  category: 'Airbus' | 'Boeing' | 'Embraer' | 'ATR' | 'Bombardier' | 'Other';
  name: string;
  manufacturer: string;
  firstFlight: string;
  typicalCapacity: string;
  range: string;
  facts: string[];
  imageUrl: string;
}

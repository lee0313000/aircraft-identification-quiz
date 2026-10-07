'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Clock3, Flag, HelpCircle, Trophy } from 'lucide-react';
import { useApp } from '@/components/app-provider';
import type { Question } from '@/lib/types';

export function QuizBoard() {
  const { questions, session, addAttempt, publishedQuestions } = useApp();
  const quizPool = useMemo(() => {
    const pool = publishedQuestions.length ? publishedQuestions : questions.filter((item) => item.published || item.id);
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [questions, publishedQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [allAttempts, setAllAttempts] = useState<{ score: number; correct: number; total: number; accuracy: number; timeTaken: number }[]>([]);

  const current = quizPool[currentIndex];

  if (!current) {
    return (
      <section className="aviation-panel p-8 text-center">
        <h2 className="text-2xl font-black text-white">No published questions available</h2>
        <p className="mt-3 text-slate-300">관리자에서 문제를 추가하고 공개 설정을 해주세요.</p>
      </section>
    );
  }

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    const isCorrect = selected === current.correctAnswer;
    const award = isCorrect ? 100 + (current.difficulty === 'hard' ? 40 : current.difficulty === 'medium' ? 20 : 0) : 0;
    setScore((prev) => prev + award);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex === quizPool.length - 1) {
      const finalScore = score + (selected === current.correctAnswer ? (100 + (current.difficulty === 'hard' ? 40 : current.difficulty === 'medium' ? 20 : 0)) : 0);
      const advanced = allAttempts.concat({
        score: finalScore,
        correct: correctCount + (selected === current.correctAnswer ? 1 : 0),
        total: quizPool.length,
        accuracy: ((correctCount + (selected === current.correctAnswer ? 1 : 0)) / quizPool.length) * 100,
        timeTaken: Math.round((Date.now() - startedAt) / 1000)
      });
      setAllAttempts(advanced);

      if (session) {
        addAttempt({
          userId: session.id,
          score: finalScore,
          correctCount: correctCount + (selected === current.correctAnswer ? 1 : 0),
          totalQuestions: quizPool.length,
          accuracy: ((correctCount + (selected === current.correctAnswer ? 1 : 0)) / quizPool.length) * 100,
          timeTaken: Math.round((Date.now() - startedAt) / 1000)
        });
      }

      const finalTotal = advanced.reduce((sum, item) => sum + item.score, 0);
      const finalCorrect = advanced.reduce((sum, item) => sum + item.correct, 0);
      const finalAccuracy = (finalCorrect / (quizPool.length * advanced.length || 1)) * 100;

      // Final results shown in another section below.
      setSubmitted(true);
      setShowResult(true);
      setScore(finalTotal);
      setCorrectCount(finalCorrect);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setSubmitted(false);
    setShowResult(false);
    setStartedAt(Date.now());
  };

  const currentDifficulty = current.difficulty === 'easy' ? '⭐ Easy' : current.difficulty === 'medium' ? '⭐⭐ Medium' : '⭐⭐⭐ Hard';
  const isCorrect = selected === current.correctAnswer;
  const activeScore = score + (showResult && selected === current.correctAnswer ? (100 + (current.difficulty === 'hard' ? 40 : current.difficulty === 'medium' ? 20 : 0)) : 0);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-sky-500/20 bg-slate-900/80 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Quiz mode</p>
          <h1 className="mt-2 text-2xl font-black text-white">Aircraft Identification</h1>
        </div>
        <div className="rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-sm text-sky-100">
          {currentIndex + 1} / {quizPool.length}
        </div>
      </div>

      <div className="rounded-[28px] border border-sky-500/20 bg-slate-900/80 p-4 shadow-panel sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-sky-300">Question</p>
            <h2 className="mt-2 text-2xl font-bold text-white">What aircraft is this?</h2>
          </div>
          <div className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-sm text-orange-200">{currentDifficulty}</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-950/60">
            <Image src={current.imageUrl} alt={current.aircraftType} width={900} height={600} className="h-[300px] w-full object-cover sm:h-[420px]" />
          </div>

          <div className="space-y-4 rounded-2xl border border-sky-500/20 bg-slate-950/60 p-4">
            <div className="grid gap-3 text-sm text-slate-200">
              <dl className="grid grid-cols-2 gap-2">
                <dt className="text-slate-400">Type</dt>
                <dd>{current.aircraftType}</dd>
                <dt className="text-slate-400">Airline</dt>
                <dd>{current.airline}</dd>
                <dt className="text-slate-400">Registration</dt>
                <dd>{current.registration}</dd>
                <dt className="text-slate-400">Difficulty</dt>
                <dd>{current.difficulty}</dd>
              </dl>
            </div>

            {current.hint && (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sm text-sky-100">
                <div className="mb-1 flex items-center gap-2 font-semibold"><HelpCircle size={16} /> Hint</div>
                {current.hint}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {current.options.map((option) => {
            const isSelected = selected === option;
            const isCorrectOption = current.correctAnswer === option;
            const reveal = submitted && isCorrectOption;
            const wrongSelection = submitted && isSelected && !isCorrectOption;

            return (
              <button
                key={option}
                type="button"
                onClick={() => !submitted && setSelected(option)}
                className={[
                  'flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-base transition',
                  reveal ? 'border-emerald-500 bg-emerald-500/15 text-emerald-100' : wrongSelection ? 'border-red-500 bg-red-500/15 text-red-100' : isSelected ? 'border-sky-400 bg-sky-500/10 text-sky-50' : 'border-sky-500/20 bg-slate-950/60 text-slate-200 hover:border-sky-400/50'
                ].join(' ')}
              >
                <span>{option}</span>
                {reveal && <CheckCircle2 size={18} />}
                {wrongSelection && <Flag size={18} />}
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-6 rounded-2xl border border-sky-500/20 bg-slate-950/60 p-4 text-sm text-slate-200">
            <p className="text-lg font-bold text-white">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
            <p className="mt-2">Correct answer: <span className="font-semibold text-sky-300">{current.correctAnswer}</span></p>
            {current.explanation && <p className="mt-3 text-slate-300">{current.explanation}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-300"><Clock3 size={16} /> {Math.round((Date.now() - startedAt) / 1000)}s</div>
          {!submitted ? (
            <button type="button" onClick={handleSubmit} disabled={!selected} className="primary-btn disabled:cursor-not-allowed disabled:opacity-60">
              Submit Answer
            </button>
          ) : (
            <button type="button" onClick={handleNext} className="primary-btn">
              {currentIndex === quizPool.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      </div>

      {currentIndex === quizPool.length - 1 && submitted && (
        <div className="aviation-panel p-6">
          <h3 className="text-2xl font-black text-white">QUIZ COMPLETE</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="grid-card"><p className="text-sm text-slate-400">Final score</p><p className="mt-2 text-3xl font-bold text-white">{activeScore}</p></div>
            <div className="grid-card"><p className="text-sm text-slate-400">Correct</p><p className="mt-2 text-3xl font-bold text-white">{correctCount + (isCorrect ? 1 : 0)}/{quizPool.length}</p></div>
            <div className="grid-card"><p className="text-sm text-slate-400">Accuracy</p><p className="mt-2 text-3xl font-bold text-white">{Math.round((((correctCount + (isCorrect ? 1 : 0)) / quizPool.length) * 100) || 0)}%</p></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => window.location.reload()} className="primary-btn">Try Again</button>
            <a href="/" className="secondary-btn">Return Home</a>
            <a href="/rankings" className="secondary-btn">View Ranking</a>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useApp } from '@/components/app-provider';

export function ProfilePanel() {
  const { session, getUserAttempts } = useApp();

  if (!session) {
    return (
      <section className="aviation-panel p-8 text-center">
        <h2 className="text-2xl font-black text-white">로그인이 필요합니다.</h2>
        <p className="mt-3 text-slate-300">로그인 후 프로필과 퀴즈 기록을 확인할 수 있습니다.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="primary-btn">Login</Link>
          <Link href="/signup" className="secondary-btn">Sign Up</Link>
        </div>
      </section>
    );
  }

  const attempts = getUserAttempts(session.id);
  const totalQuizzes = attempts.length;
  const averageAccuracy = totalQuizzes ? attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / totalQuizzes : 0;
  const highestScore = attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : 0;

  return (
    <section className="space-y-6">
      <div className="aviation-panel p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-300">My Profile</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">{session.nickname}</h1>
            <p className="mt-2 text-slate-300">{session.email}</p>
          </div>
          <div className="rounded-full border border-sky-500/25 bg-sky-500/10 px-4 py-2 text-sm text-sky-100">{session.role === 'admin' ? 'Administrator' : 'Pilot'}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="aviation-panel p-5"><p className="text-sm text-slate-400">Total Quizzes</p><p className="mt-3 text-3xl font-black text-white">{totalQuizzes}</p></div>
        <div className="aviation-panel p-5"><p className="text-sm text-slate-400">Average Accuracy</p><p className="mt-3 text-3xl font-black text-white">{Math.round(averageAccuracy)}%</p></div>
        <div className="aviation-panel p-5"><p className="text-sm text-slate-400">Highest Score</p><p className="mt-3 text-3xl font-black text-white">{highestScore}</p></div>
        <div className="aviation-panel p-5"><p className="text-sm text-slate-400">Joined</p><p className="mt-3 text-lg font-black text-white">{new Date(session.createdAt).toLocaleDateString('ko-KR')}</p></div>
      </div>

      <div className="aviation-panel p-6">
        <h2 className="text-2xl font-black text-white">Quiz History</h2>
        <div className="mt-5 space-y-3">
          {attempts.length === 0 ? (
            <p className="text-slate-300">아직 퀴즈 기록이 없습니다. 지금 시험을 시작해 보세요.</p>
          ) : (
            attempts.map((attempt) => (
              <div key={attempt.id} className="flex flex-col gap-2 rounded-xl border border-sky-500/20 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Score {attempt.score}</p>
                  <p className="text-sm text-slate-300">{attempt.correctCount}/{attempt.totalQuestions} correct • {attempt.accuracy}% accuracy</p>
                </div>
                <div className="text-sm text-slate-300">
                  {new Date(attempt.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useApp } from '@/components/app-provider';

export function RankingsPage() {
  const { getLeaderboard, session } = useApp();
  const leaderboard = getLeaderboard();
  const myRank = session ? leaderboard.findIndex((entry) => entry.profile.id === session.id) + 1 : 0;

  return (
    <section className="space-y-6">
      <div className="aviation-panel p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Leaderboard</p>
        <h1 className="mt-3 text-3xl font-black text-white">Global Rankings</h1>
      </div>

      {session && (
        <div className="aviation-panel p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">My Ranking</p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{myRank > 0 ? '#' + myRank : 'Unranked'}</p>
              <p className="text-slate-300">{session.nickname}</p>
            </div>
            <div className="text-right">
              <p className="text-sky-200">Top score</p>
              <p className="text-2xl font-black text-white">{leaderboard.find((entry) => entry.profile.id === session.id)?.totalScore || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="aviation-panel overflow-hidden">
        <div className="grid grid-cols-[0.6fr_1.4fr_1fr_1fr_1fr] gap-3 border-b border-sky-500/20 bg-slate-950/70 p-4 text-sm font-semibold text-slate-300">
          <span>Rank</span>
          <span>Nickname</span>
          <span>Total Score</span>
          <span>Accuracy</span>
          <span>Quizzes</span>
        </div>
        {leaderboard.map((entry) => (
          <div key={entry.profile.id} className="grid grid-cols-[0.6fr_1.4fr_1fr_1fr_1fr] gap-3 border-b border-sky-500/10 p-4 text-sm text-slate-200 last:border-none">
            <span className="font-bold text-sky-300">#{entry.rank}</span>
            <span>{entry.profile.nickname}</span>
            <span>{entry.totalScore}</span>
            <span>{Math.round(entry.averageAccuracy)}%</span>
            <span>{entry.quizCount}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

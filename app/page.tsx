'use client';

import Link from 'next/link';
import { useApp } from '@/components/app-provider';
import { ArrowRight, PlaneTakeoff, Trophy, UserRound, ShieldCheck } from 'lucide-react';

export function HomePage() {
  const { session, logout, publishedQuestions } = useApp();

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[28px] border border-sky-500/20 bg-gradient-to-br from-aviation-navy via-sky-950 to-slate-900 p-6 shadow-panel sm:p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center rounded-full border border-sky-300/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
              항공기 맞추기 QUIZ
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Aircraft Identification <span className="text-sky-300">QUIZ</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              항공기 사진을 보고 기종, 항공사, 등록번호를 맞히는 실전형 비행 스튜디오입니다. 사용자 인증, 퀴즈 기록, 랭킹, 관리자 기능까지 실제 운영 가능한 구조로 설계되었습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quiz" className="primary-btn inline-flex items-center gap-2">
                Start Quiz <ArrowRight size={18} />
              </Link>
              <Link href="/quiz?mode=random" className="secondary-btn inline-flex items-center gap-2">
                Random Quiz
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="aviation-panel p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Questions</p>
                <p className="mt-3 text-3xl font-bold text-white">{publishedQuestions.length}</p>
              </div>
              <div className="aviation-panel p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Users</p>
                <p className="mt-3 text-3xl font-bold text-white">{session ? 'Active' : 'Guest'}</p>
              </div>
              <div className="aviation-panel p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Rank</p>
                <p className="mt-3 text-3xl font-bold text-white">Top</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-sky-300/20 bg-slate-900/50 p-4 shadow-panel">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-orange-500/10" />
            <div className="relative space-y-4">
              <div className="rounded-2xl border border-sky-300/20 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-sky-200">
                  <span>Live Ops</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-300">ONLINE</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Aircraft detected</p>
                    <p className="mt-2 text-4xl font-black text-white">A320</p>
                  </div>
                  <PlaneTakeoff className="h-12 w-12 text-sky-300" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="aviation-panel p-4">
                  <Trophy className="mb-3 h-6 w-6 text-orange-300" />
                  <p className="text-sm text-slate-400">Top score</p>
                  <p className="mt-2 text-2xl font-bold text-white">9800</p>
                </div>
                <div className="aviation-panel p-4">
                  <UserRound className="mb-3 h-6 w-6 text-sky-300" />
                  <p className="text-sm text-slate-400">My Profile</p>
                  <p className="mt-2 text-2xl font-bold text-white">{session ? session.nickname : 'Guest'}</p>
                </div>
              </div>

              <div className="aviation-panel p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-sky-200">
                  <ShieldCheck size={18} />
                  <span className="font-semibold">Secure platform</span>
                </div>
                <p className="mt-3 leading-6">
                  Supabase 인증, RLS 보안, 이미지 업로드, 관리자 승인을 지원하는 구조로 운영할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Aircraft Encyclopedia', href: '/encyclopedia', description: '기종별 항공기 정보 탐색', icon: '📘' },
          { title: 'Rankings', href: '/rankings', description: '전 세계 사용자 랭킹 확인', icon: '🏆' },
          { title: 'My Profile', href: '/profile', description: '점수, 정답률, 퀴즈 이력 확인', icon: '👤' },
          { title: 'Admin Panel', href: '/admin', description: '문제 생성 및 관리', icon: '🛠️' }
        ].map((item) => (
          <Link key={item.title} href={item.href} className="aviation-panel block p-5 transition hover:-translate-y-1 hover:border-sky-400/40">
            <div className="text-3xl">{item.icon}</div>
            <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </Link>
        ))}
      </section>

      {!session ? (
        <section className="aviation-panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Access</p>
              <h2 className="mt-2 text-2xl font-bold text-white">로그인 또는 회원가입 후 퀴즈를 시작하세요.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="secondary-btn">Login</Link>
              <Link href="/signup" className="primary-btn">Sign Up</Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="aviation-panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Session</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{session.nickname}님, 비행 준비가 완료되었습니다.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/quiz" className="primary-btn">Continue Quiz</Link>
              <button onClick={logout} className="secondary-btn">Logout</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;

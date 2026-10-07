'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/app-provider';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn, signUp } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (!nickname.trim()) {
          setError('닉네임을 입력해 주세요.');
          setLoading(false);
          return;
        }
        await signUp({ email, password, nickname });
      } else {
        await signIn({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-[28px] border border-sky-500/20 bg-slate-900/80 p-6 shadow-panel">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Authentication</p>
        <h1 className="mt-3 text-3xl font-black text-white">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="mb-2 block text-sm text-slate-200">Nickname</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3 text-white outline-none ring-0 transition focus:border-sky-400"
              placeholder="Pilot name"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm text-slate-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3 text-white outline-none ring-0 transition focus:border-sky-400"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3 text-white outline-none ring-0 transition focus:border-sky-400"
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

        <button type="submit" disabled={loading} className="primary-btn w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? '처리 중...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-300">
        {mode === 'login' ? '아직 계정이 없나요?' : '이미 계정이 있으신가요?'}{' '}
        <Link href={mode === 'login' ? '/signup' : '/login'} className="text-sky-300 hover:text-sky-200">
          {mode === 'login' ? '회원가입' : '로그인'}
        </Link>
      </p>
    </section>
  );
}

export default AuthPage;

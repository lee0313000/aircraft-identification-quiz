'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/components/app-provider';
import type { Question } from '@/lib/types';

const blankQuestion = {
  imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
  aircraftType: '',
  airline: '',
  registration: '',
  difficulty: 'easy' as const,
  options: ['', '', '', ''],
  correctAnswer: '',
  hint: '',
  explanation: '',
  published: false
};

export function AdminPanel() {
  const { session, questions, saveQuestion, deleteQuestion, updateQuestion } = useApp();
  const [form, setForm] = useState(blankQuestion);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      return;
    }
  }, [session]);

  if (!session || session.role !== 'admin') {
    return (
      <section className="aviation-panel p-8 text-center">
        <h2 className="text-2xl font-black text-white">관리자 권한이 필요합니다.</h2>
        <p className="mt-3 text-slate-300">운영자 계정으로 로그인해야 문제를 추가하거나 수정할 수 있습니다.</p>
      </section>
    );
  }

  const handleField = (key: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.aircraftType || !form.airline || !form.registration || !form.correctAnswer || form.options.some((option) => !option.trim())) {
      alert(' aircraft type, airline, registration, correct answer, and all answer options are required.');
      return;
    }

    const payload = {
      ...form,
      id: editingId || undefined,
      published: form.published,
      options: form.options,
      correctAnswer: form.correctAnswer
    };

    saveQuestion(payload as Question);
    setForm(blankQuestion);
    setEditingId(null);
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setForm({
      imageUrl: question.imageUrl,
      aircraftType: question.aircraftType,
      airline: question.airline,
      registration: question.registration,
      difficulty: question.difficulty,
      options: [question.optionA, question.optionB, question.optionC, question.optionD],
      correctAnswer: question.correctAnswer,
      hint: question.hint || '',
      explanation: question.explanation || '',
      published: question.published
    });
  };

  return (
    <section className="space-y-6">
      <div className="aviation-panel p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Admin</p>
        <h1 className="mt-3 text-3xl font-black text-white">Question Management</h1>
      </div>

      <form onSubmit={handleSubmit} className="aviation-panel space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-200">Aircraft Image URL</label>
            <input value={form.imageUrl} onChange={(e) => handleField('imageUrl', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => handleField('difficulty', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3">
              <option value="easy">⭐ Easy</option>
              <option value="medium">⭐⭐ Medium</option>
              <option value="hard">⭐⭐⭐ Hard</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Aircraft Type</label>
            <input value={form.aircraftType} onChange={(e) => handleField('aircraftType', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Airline</label>
            <input value={form.airline} onChange={(e) => handleField('airline', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Registration</label>
            <input value={form.registration} onChange={(e) => handleField('registration', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Correct Answer</label>
            <input value={form.correctAnswer} onChange={(e) => handleField('correctAnswer', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {form.options.map((option, index) => (
            <div key={index}>
              <label className="mb-2 block text-sm text-slate-200">Option {index + 1}</label>
              <input
                value={option}
                onChange={(e) => {
                  const nextOptions = [...form.options];
                  nextOptions[index] = e.target.value;
                  handleField('options', nextOptions);
                }}
                className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-200">Hint</label>
          <input value={form.hint} onChange={(e) => handleField('hint', e.target.value)} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-200">Explanation</label>
          <textarea value={form.explanation} onChange={(e) => handleField('explanation', e.target.value)} rows={4} className="w-full rounded-xl border border-sky-500/20 bg-slate-950/60 px-4 py-3" />
        </div>

        <label className="flex items-center gap-3 text-slate-200">
          <input type="checkbox" checked={form.published} onChange={(e) => handleField('published', e.target.checked)} className="h-4 w-4" />
          Publish immediately
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="primary-btn">{editingId ? 'Update Question' : 'Save Question'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(blankQuestion); }} className="secondary-btn">Cancel</button>}
        </div>
      </form>

      <div className="aviation-panel p-6">
        <h2 className="text-2xl font-black text-white">Published Questions</h2>
        <div className="mt-5 space-y-3">
          {questions.length === 0 ? (
            <p className="text-slate-300">아직 등록된 문제가 없습니다.</p>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="flex flex-col gap-3 rounded-xl border border-sky-500/20 bg-slate-950/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{question.aircraftType}</p>
                  <p className="text-sm text-slate-300">{question.airline} • {question.registration} • {question.difficulty}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => updateQuestion(question.id, { published: !question.published })} className="secondary-btn px-3 py-2 text-xs">
                    {question.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button type="button" onClick={() => handleEdit(question)} className="secondary-btn px-3 py-2 text-xs">Edit</button>
                  <button type="button" onClick={() => deleteQuestion(question.id)} className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useApp } from '@/components/app-provider';

const categories = ['Airbus', 'Boeing', 'Embraer', 'ATR', 'Bombardier', 'Other'];

export function EncyclopediaPage() {
  const { encyclopedia } = useApp();

  return (
    <section className="space-y-8">
      <div className="aviation-panel p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Aviation knowledge</p>
        <h1 className="mt-3 text-3xl font-black text-white">Aircraft Encyclopedia</h1>
      </div>

      {categories.map((category) => {
        const items = encyclopedia.filter((entry) => entry.category === category);
        if (!items.length) return null;

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((entry) => (
                <article key={entry.id} className="overflow-hidden rounded-[24px] border border-sky-500/20 bg-slate-900/80 shadow-panel">
                  <div className="relative h-52 w-full">
                    <Image src={entry.imageUrl} alt={entry.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-white">{entry.name}</h3>
                      <span className="rounded-full bg-sky-500/10 px-2 py-1 text-xs text-sky-200">{entry.manufacturer}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li><span className="text-slate-400">First flight:</span> {entry.firstFlight}</li>
                      <li><span className="text-slate-400">Capacity:</span> {entry.typicalCapacity}</li>
                      <li><span className="text-slate-400">Range:</span> {entry.range}</li>
                    </ul>
                    <div className="space-y-2 text-sm text-slate-300">
                      {entry.facts.map((fact) => (
                        <p key={fact}>• {fact}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

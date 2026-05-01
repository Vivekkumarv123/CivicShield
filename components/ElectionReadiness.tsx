"use client";

import React, { useState, useMemo } from "react";
import { 
  CheckSquare, 
  Square, 
  Trophy, 
  Zap,
  Target,
  ArrowRight
} from "lucide-react";
import { Locale, CONTENT } from "@/constants/content";

interface ElectionReadinessProps {
  locale: Locale;
}

export function ElectionReadiness({ locale }: ElectionReadinessProps) {
  const t = CONTENT[locale].readiness;
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const score = useMemo(() => {
    return Math.round((checkedItems.length / t.checklist.length) * 100);
  }, [checkedItems, t.checklist.length]);

  return (
    <section id="readiness" className="py-24 max-w-7xl mx-auto px-6">
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 blur-[100px] -ml-48 -mb-48" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
              <Target className="w-4 h-4 text-blue-400" />
              Check your status
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{t.title}</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md">
              Complete this checklist to ensure you are fully prepared to exercise your democratic right on voting day.
            </p>

            <div className="space-y-4">
              {t.checklist.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleItem(idx)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                    checkedItems.includes(idx) 
                      ? "bg-white/10 border-blue-500/50 text-white" 
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  {checkedItems.includes(idx) ? (
                    <CheckSquare className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Square className="w-6 h-6" />
                  )}
                  <span className="font-bold text-sm md:text-base">{item}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              {/* Progress Circle SVG */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-white/5 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-blue-500 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}%`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}%`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-6xl md:text-8xl font-black mb-2">{score}%</span>
                <span className="text-blue-400 font-black uppercase tracking-widest text-xs">Prepared</span>
              </div>
            </div>

            <div className="mt-12 w-full max-w-sm">
              <div className={`p-6 rounded-3xl text-center transition-all duration-500 ${
                score === 100 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border border-white/10"
              }`}>
                {score === 100 ? (
                  <div className="flex items-center justify-center gap-3">
                    <Trophy className="w-6 h-6" />
                    <span className="font-black uppercase tracking-tight">You're a Super Voter!</span>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-slate-400">
                    {t.result.replace("{score}", score.toString())}
                  </p>
                )}
              </div>
              
              <button className="w-full mt-6 flex items-center justify-center gap-2 py-5 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                Get Voter Assistance
                <Zap className="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

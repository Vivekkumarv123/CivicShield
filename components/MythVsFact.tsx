"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Locale, CONTENT } from "@/constants/content";

interface MythVsFactProps {
  locale: Locale;
}

export function MythVsFact({ locale }: MythVsFactProps) {
  const t = CONTENT[locale].mythVsFact;
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section id="myth-vs-fact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <ShieldAlert className="w-4 h-4" />
            Fighting Misinformation
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{t.title}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            In the age of digital information, knowing what's real is crucial for a healthy democracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((item, idx) => (
            <div 
              key={idx} 
              className="group h-[350px] cursor-pointer perspective-1000"
              onClick={() => setFlipped(flipped === idx ? null : idx)}
            >
              <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${flipped === idx ? "rotate-y-180" : ""}`}>
                {/* Front: Myth */}
                <div className="absolute inset-0 backface-hidden bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-sm group-hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <span className="text-amber-600 font-black uppercase tracking-widest text-xs mb-4">Common Myth</span>
                  <p className="text-xl font-bold text-slate-800 leading-tight">{item.myth}</p>
                  
                  <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                    Tap to reveal the truth
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Back: Fact */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-emerald-600 border border-emerald-500 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center text-white shadow-2xl">
                  <div className="w-16 h-16 bg-white/20 text-white rounded-3xl flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <span className="text-emerald-100 font-black uppercase tracking-widest text-xs mb-4">The Reality</span>
                  <p className="text-xl font-bold leading-relaxed">{item.fact}</p>
                  
                  <div className="mt-8 pt-6 border-t border-white/20 w-full">
                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-200">Verified by CivicShield AI</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

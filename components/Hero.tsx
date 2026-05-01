"use client";

import React from "react";
import { Sparkles, ShieldCheck, ArrowRight, MousePointer2 } from "lucide-react";
import { Locale, CONTENT } from "@/constants/content";

interface HeroProps {
  locale: Locale;
  onChatClick: () => void;
  onJourneyClick: () => void;
}

export function Hero({ locale, onChatClick, onJourneyClick }: HeroProps) {
  const t = CONTENT[locale].hero;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-4 h-4 fill-blue-600/20" />
          AI-Powered Civic Intelligence
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {t.title.split(' ').map((word, i) => (
            <span key={i} className={i > 2 ? "text-blue-600" : ""}>
              {word}{" "}
            </span>
          ))}
        </h1>
        
        <p className="text-slate-500 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {t.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <button 
            onClick={onChatClick}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 py-5 px-10 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95"
          >
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            {t.chatCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onJourneyClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 py-5 px-10 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            {t.cta}
          </button>
        </div>

        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-40 bottom-0" />
          <div className="rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="bg-slate-900 h-10 w-full rounded-t-[2rem] flex items-center px-6 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              <div className="flex-1 text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">civicshield-ai-agent.eci.gov</span>
              </div>
            </div>
            <div className="bg-slate-50 aspect-video md:aspect-[21/9] overflow-hidden">
               <img 
                 src="/hero-dashboard.png" 
                 alt="CivicShield Dashboard" 
                 className="w-full h-full object-cover animate-in fade-in duration-1000"
               />
            </div>
          </div>
          
          {/* Floating badge */}
          <div className="absolute -right-8 top-1/2 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden lg:block animate-bounce duration-[3000ms]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Status</p>
                <p className="font-black text-slate-900">EVM Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

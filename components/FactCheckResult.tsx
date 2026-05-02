"use client";

import React from "react";
import { FactCheckResponse } from "../types";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink, 
  ShieldCheck, 
  BarChart3, 
  MessageCircle,
  Share2,
  Sparkles
} from "lucide-react";

export const FactCheckResult = React.memo(({ result, query }: { result: FactCheckResponse, query?: string }) => {
  const isTrue = result.verdict === "True";
  const isFalse = result.verdict === "False";
  const isPartial = result.verdict === "Partially True";
  
  const confidencePercent = Math.min(Math.max((result.confidence || 0) * 100, 0), 100);

  return (
    <div className={`w-full max-w-full my-6 rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all animate-in zoom-in-95 duration-700 ${
      isTrue ? 'border-green-200 bg-green-50/10' :
      isFalse ? 'border-red-200 bg-red-50/10' :
      isPartial ? 'border-amber-200 bg-amber-50/10' :
      'border-slate-200 bg-slate-50/10'
    }`}>
      {/* Header Verdict Section */}
      <div className={`px-8 py-8 border-l-[6px] flex flex-col md:flex-row items-start gap-6 ${
        isTrue ? 'border-green-500 bg-green-50/30' :
        isFalse ? 'border-red-500 bg-red-50/30' :
        isPartial ? 'border-amber-500 bg-amber-50/30' :
        'border-slate-500 bg-slate-100/50'
      }`}>
        <div 
          aria-label={`Verdict: ${result.verdict}`}
          className={`p-4 rounded-3xl ${
             isTrue ? 'bg-green-100 text-green-600' :
             isFalse ? 'bg-red-100 text-red-600' :
             'bg-amber-100 text-amber-600'
          }`}
        >
          {isTrue && <CheckCircle className="w-10 h-10" />}
          {isFalse && <XCircle className="w-10 h-10" />}
          {isPartial && <AlertCircle className="w-10 h-10" />}
          {!isTrue && !isFalse && !isPartial && <HelpCircle className="w-10 h-10" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 block mb-1">Fact-Check Analysis</span>
               <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${
                 isTrue ? 'text-green-900' : isFalse ? 'text-red-900' : isPartial ? 'text-amber-900' : 'text-slate-900'
               }`}>
                 {result.verdict}
               </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm">
                 <ShieldCheck className="w-4 h-4 text-blue-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Verified Verdict</span>
              </div>
            </div>
          </div>
          <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Confidence & Sources Section */}
      <div className="bg-white/90 backdrop-blur-xl p-8 border-t border-slate-100 space-y-8">
        {/* Confidence Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end text-xs font-black uppercase tracking-[0.1em] text-slate-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              AI Reasoning Confidence
            </span>
            <span className="text-slate-900 text-lg">{confidencePercent.toFixed(0)}%</span>
          </div>
          <div 
            aria-label={`AI Confidence Score: ${confidencePercent.toFixed(0)} percent`}
            className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner"
          >
            <div 
              className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-lg ${
                isTrue ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                isFalse ? 'bg-gradient-to-r from-red-400 to-red-600' : 
                'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Sources Pills */}
        {result.sources && result.sources.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <BarChart3 className="w-3.5 h-3.5" />
               Citations & Live Verification
            </h4>
            <div className="flex flex-wrap gap-3">
              {result.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Source: ${source.title}`}
                  className="group flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-xl transition-all"
                >
                  <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <span className="max-w-[200px] truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Combat Misinformation</p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              '🚨 *CivicShield Fact-Check* 🚨\n\n*Verdict:* ' + result.verdict + '\n\nVerify here: ' + (process.env.NEXT_PUBLIC_APP_URL || 'https://civicshield.io')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share this fact-check on WhatsApp"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-green-600/20 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            Share Truth on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
});

FactCheckResult.displayName = "FactCheckResult";

FactCheckResult.displayName = "FactCheckResult";

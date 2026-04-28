"use client";

import React from "react";
import { FactCheckResponse } from "../types";
import { CheckCircle, XCircle, AlertCircle, HelpCircle, ExternalLink, ShieldCheck, BarChart3, Share2, MessageCircle } from "lucide-react";

export const FactCheckResult = React.memo(({ result, query }: { result: FactCheckResponse, query?: string }) => {
  const isTrue = result.verdict === "True";
  const isFalse = result.verdict === "False";
  const isPartial = result.verdict === "Partially True";
  
  const confidencePercent = Math.min(Math.max((result.confidence || 0) * 100, 0), 100);

  const handleWhatsAppShare = () => {
    const shareText = `🚨 *CivicShield Fact-Check* 🚨\n\n*Verdict:* ${result.verdict}\n\nVerify here: ${process.env.NEXT_PUBLIC_APP_URL || 'https://civicshield.app'}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className={`w-full max-w-full my-4 rounded-2xl border overflow-hidden shadow-lg transition-all animate-in zoom-in-95 duration-500 ${
      isTrue ? 'border-green-200 bg-green-50/20' :
      isFalse ? 'border-red-200 bg-red-50/20' :
      isPartial ? 'border-amber-200 bg-amber-50/20' :
      'border-slate-200 bg-slate-50/20'
    }`}>
      {/* Header Verdict Section */}
      <div className={`px-6 py-5 border-l-4 flex items-start gap-4 ${
        isTrue ? 'border-green-500 bg-green-50/50' :
        isFalse ? 'border-red-500 bg-red-50/50' :
        isPartial ? 'border-amber-500 bg-amber-50/50' :
        'border-slate-500 bg-slate-100'
      }`}>
        <div className="mt-1">
          {isTrue && <CheckCircle className="w-8 h-8 text-green-600" />}
          {isFalse && <XCircle className="w-8 h-8 text-red-600" />}
          {isPartial && <AlertCircle className="w-8 h-8 text-amber-600" />}
          {!isTrue && !isFalse && !isPartial && <HelpCircle className="w-8 h-8 text-slate-600" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4 mb-1">
            <h3 className={`text-xl font-black uppercase tracking-tight ${
              isTrue ? 'text-green-800' : isFalse ? 'text-red-800' : isPartial ? 'text-amber-800' : 'text-slate-800'
            }`}>
              Verdict: {result.verdict}
            </h3>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-current/20 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                 <ShieldCheck className="w-3 h-3" />
                 Verified
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Confidence & Sources Section */}
      <div className="bg-white/80 backdrop-blur-sm p-6 border-t border-slate-100 space-y-6">
        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              AI Confidence
            </span>
            <span>{confidencePercent.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                isTrue ? 'bg-green-500' : isFalse ? 'bg-red-500' : 'bg-blue-600'
              }`}
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Sources Pills */}
        {result.sources && result.sources.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Citations & Verification</h4>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={source.snippet} 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="max-w-[150px] truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp Viral Sharing */}
        <div className="mt-6 border-t pt-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              '🚨 *CivicShield Fact-Check* 🚨\n\n*Verdict:* ' + result.verdict + '\n\nVerify here: ' + (process.env.NEXT_PUBLIC_APP_URL || 'https://civicshield-242730164190.asia-south1.run.app')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Share on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
});

FactCheckResult.displayName = "FactCheckResult";

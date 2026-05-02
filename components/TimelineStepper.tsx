"use client";

import React from "react";
import { Step } from "../types";
import { Clock, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

export const TimelineStepper = React.memo(({ steps }: { steps: Step[] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative border-l-2 border-slate-200 ml-5 md:ml-8 space-y-12 py-6 my-6">
      {steps.map((step, index) => (
        <div key={step.id || index} className="relative pl-10 animate-in slide-in-from-left-4 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
          {/* Step Indicator */}
          <div 
            aria-label={`Step ${index + 1}`}
            className="absolute -left-[21px] top-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl bg-slate-900 text-white ring-8 ring-slate-50 z-10 group-hover:scale-110 transition-transform"
          >
            {index + 1}
          </div>

          {/* Card Content */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-6 md:p-8 hover:shadow-2xl hover:border-blue-100 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <CheckCircle2 className="w-24 h-24 text-blue-600" />
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-3 leading-tight">
                {step.title}
              </h3>
            </div>
            
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 font-medium relative z-10">
              {step.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100 relative z-10">
              {step.durationDays && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-100">
                  <Clock className="w-3.5 h-3.5" />
                  {step.durationDays} Days
                </div>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                ECI Verified Step
              </div>
              
              <button 
                aria-label={`View details for ${step.title}`}
                className="ml-auto flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
              >
                Details
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

TimelineStepper.displayName = "TimelineStepper";

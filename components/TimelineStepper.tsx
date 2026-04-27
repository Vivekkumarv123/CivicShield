"use client";

import React from "react";
import { Step } from "../types";
import { Calendar, Clock, MapPin, CheckCircle2, Info } from "lucide-react";

export const TimelineStepper = React.memo(({ steps }: { steps: Step[] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative border-l-2 border-blue-200 ml-4 md:ml-6 space-y-8 py-4 my-4">
      {steps.map((step, index) => (
        <div key={step.id || index} className="relative pl-8 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
          {/* Step Indicator */}
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm bg-blue-600 text-white ring-4 ring-blue-50 z-10">
            {index + 1}
          </div>

          {/* Card Content */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                <span className="text-xl opacity-80">{step.icon || "📍"}</span>
                {step.title}
              </h3>
            </div>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
              {step.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-50">
              {step.durationDays && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  {step.durationDays} Days approx.
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                <Info className="w-3.5 h-3.5" />
                ECI Verified
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

TimelineStepper.displayName = "TimelineStepper";

"use client";

import React from "react";
import { 
  History, 
  Search, 
  MapPin, 
  Globe2, 
  Clock, 
  TrendingUp, 
  Lightbulb,
  FileText,
  AlertTriangle,
  Languages,
  ArrowUpRight
} from "lucide-react";

interface LedgerEntry {
  title: string;
  category: string;
  region: string;
  language: string;
  timestamp: string;
  insight: string;
  severity: "low" | "medium" | "high";
}

const entries: LedgerEntry[] = [
  {
    title: "EVM Integrity Rumors",
    category: "Misinformation",
    region: "Western Districts",
    language: "Marathi",
    timestamp: "2h 45m ago",
    insight: "Resurgence of debunked chip-tampering narratives; clustering in local social channels.",
    severity: "high"
  },
  {
    title: "Form 6 Registration Gap",
    category: "Voter Education",
    region: "Urban Metro Hubs",
    language: "English / Hindi",
    timestamp: "5h 12m ago",
    insight: "Rising confusion among Gen-Z voters regarding online vs. physical document verification.",
    severity: "medium"
  },
  {
    title: "Polling Station Relocation",
    category: "Logistics",
    region: "Northern Rural Belt",
    language: "Hindi",
    timestamp: "8h 30m ago",
    insight: "Incomplete address strings in voter slips causing high query volume for station maps.",
    severity: "low"
  }
];

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${colors[severity as keyof typeof colors]}`}>
      {severity} Risk
    </span>
  );
};

export const CivicMemoryLedger = () => {
  return (
    <section className="relative py-24 px-6 bg-[#020617] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* 1) Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Institutional Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Civic <span className="text-blue-500">Memory Ledger</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-medium">
            Identifying emerging public signals across regions, languages, and misinformation themes 
            to drive proactive policy interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 2) Ledger Entries */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Recent Signal Archive</h3>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Filter signals..." 
                    className="bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-1.5 text-[10px] text-white/60 focus:outline-none focus:border-blue-500/50 transition-all w-40"
                  />
                </div>
              </div>
            </div>
            
            {entries.map((entry, i) => (
              <div key={i} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">
                        {entry.category}
                      </span>
                      <SeverityBadge severity={entry.severity} />
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20 uppercase tracking-widest ml-auto md:ml-0">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp}
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {entry.title}
                    </h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      {entry.insight}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 md:pl-8 md:border-l">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-white/30 uppercase tracking-widest">
                        <MapPin className="w-3 h-3" />
                        Region
                      </div>
                      <p className="text-xs font-bold text-white/70">{entry.region}</p>
                    </div>
                    <div className="space-y-1 ml-4">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-white/30 uppercase tracking-widest">
                        <Globe2 className="w-3 h-3" />
                        Language
                      </div>
                      <p className="text-xs font-bold text-white/70">{entry.language}</p>
                    </div>
                    <button className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-blue-600 transition-all ml-auto">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3) Trend Summary Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Live Trends
              </h3>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Top Concern Category</p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">Misinformation</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Most Queried Language</p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <Languages className="w-4 h-4 text-indigo-500" />
                    </div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">Marathi (MH)</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Highest Activity Region</p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">Western Districts</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Surge Indicator</p>
                    <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4) Policy Recommendation Strip */}
        <div className="mt-12 group relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-blue-500/30 rounded-[2.5rem] p-8 md:p-10">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Lightbulb className="w-32 h-32 text-blue-400" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
            <div className="p-4 rounded-3xl bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Proactive Intervention</span>
                <div className="h-px w-8 bg-blue-500/30" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Recommended Strategy</h3>
              <p className="text-slate-300 font-medium leading-relaxed max-w-4xl">
                Deploy targeted <span className="text-white underline decoration-blue-500 decoration-2 underline-offset-4">multilingual voter education campaigns</span> in Marathi and Hindi to counter surging EVM integrity misinformation narratives in the Western Districts.
              </p>
            </div>
            <button className="whitespace-nowrap px-8 py-4 rounded-2xl bg-white text-blue-900 text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all hover:shadow-xl active:scale-95">
              Draft Brief
            </button>
          </div>
        </div>

        {/* 5) Mini Activity Graph (Visual Placeholder) */}
        <div className="mt-12 flex items-center justify-between px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem]">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-end h-8">
              {[4,7,3,9,5,8,4,6,9,3,7].map((h, i) => (
                <div key={i} className="w-1.5 bg-blue-500/30 rounded-full" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Signal Frequency Index (72h)</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Verified Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Rumor Clusters</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

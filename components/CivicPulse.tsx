"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  ShieldCheck, 
  Globe, 
  Zap, 
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatCard = ({ label, value, icon, trend, color }: StatCardProps) => (
  <div className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10 hover:border-white/20">
    <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${color}`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 text-white/80 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
          {trend}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

export const CivicPulse = () => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 px-6 bg-[#020617] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex items-center justify-center">
                <div className={`absolute w-3 h-3 bg-emerald-500 rounded-full transition-all duration-1000 ${pulse ? 'scale-[2.5] opacity-0' : 'scale-100 opacity-100'}`} />
                <div className="relative w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Live Infrastructure Pulse</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Civic Intelligence <span className="text-blue-500">Infrastructure</span>
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-medium">
              Real-time monitoring of the Indian civic ecosystem. Scaling misinformation resilience through 
              hardened AI orchestration and multilingual grounding.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white/40">
                   {String.fromCharCode(64 + i)}
                 </div>
               ))}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white/60 pr-4">Node Capacity: <span className="text-emerald-500">98.4%</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="System Coverage" 
            value="92.4%" 
            icon={<ShieldCheck className="w-5 h-5" />} 
            trend="Stable"
            color="bg-blue-500"
          />
          <StatCard 
            label="Avg. TTFT Latency" 
            value="582ms" 
            icon={<Zap className="w-5 h-5" />} 
            trend="Fast"
            color="bg-amber-500"
          />
          <StatCard 
            label="Grounding Confidence" 
            value="98.5%" 
            icon={<CheckCircle2 className="w-5 h-5" />} 
            trend="Verified"
            color="bg-emerald-500"
          />
          <StatCard 
            label="Regional Parity" 
            value="14 Lang" 
            icon={<Globe className="w-5 h-5" />} 
            trend="Active"
            color="bg-indigo-500"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Alerts Feed */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-white uppercase tracking-widest">Misinformation Resilience Feed</h3>
              </div>
              <div className="h-px flex-1 mx-6 bg-white/10 hidden md:block" />
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">View All Logs</button>
            </div>
            
            <div className="space-y-6">
              {[
                { time: "2m ago", type: "RUMOR_DEBUNKED", msg: "EVM chip modification claims flagged in Marathi (MH Region)", color: "text-emerald-400" },
                { time: "14m ago", type: "CIVIC_GUIDANCE", msg: "Automated Form 6 registration walkthrough generated in Hindi", color: "text-blue-400" },
                { time: "1h ago", type: "SECURITY_EVENT", msg: "Rate-limiting activated: Sustained burst from IP 103.42.***.***", color: "text-amber-400" }
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest pt-1 shrink-0">{log.time}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${log.color}`}>{log.type}</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Grounding: Search_v2</span>
                    </div>
                    <p className="text-white/80 font-medium group-hover:text-white transition-colors leading-snug">{log.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Lock className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-widest mb-6">Security Moat</h3>
              <p className="text-blue-100 font-medium mb-8 leading-relaxed">
                Production-ready security featuring Upstash-backed rate limiting, Zod schema strict-typing, 
                and PII-guarded logging.
              </p>
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-white/30" />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                  <span>Upstash Connectivity</span>
                  <span>Operational</span>
                </div>
              </div>
              <button className="mt-10 w-full bg-white text-blue-600 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-colors">
                Audit Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

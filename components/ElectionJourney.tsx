"use client";

import React, { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Trophy,
  RotateCcw,
  Zap,
  UserPlus,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
  GraduationCap,
  Info
} from "lucide-react";
import { Locale, CONTENT } from "@/constants/content";
import quizBank from "../data/quizBank.json";
import flashcardsData from "../data/flashcards.json";

interface ElectionJourneyProps {
  locale: Locale;
}

const STAGES = [
  { id: "guide", icon: UserPlus, label: "Registration", color: "blue", theme: "from-blue-600 to-cyan-500" },
  { id: "timeline", icon: Compass, label: "Process", color: "indigo", theme: "from-indigo-600 to-blue-500" },
  { id: "flashcards", icon: Layers, label: "Concepts", color: "purple", theme: "from-purple-600 to-pink-500" },
  { id: "quiz", icon: GraduationCap, label: "Certification", color: "emerald", theme: "from-emerald-600 to-teal-500" },
] as const;

type StageId = typeof STAGES[number]["id"];

export function ElectionJourney({ locale }: ElectionJourneyProps) {
  const [activeStage, setActiveStage] = useState<StageId>("guide");
  const t = CONTENT[locale].journey;

  const currentStageIndex = STAGES.findIndex(s => s.id === activeStage);
  const nextStage = STAGES[currentStageIndex + 1];

  const handleNext = () => {
    if (nextStage) {
      setActiveStage(nextStage.id);
      const element = document.getElementById('journey-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const activeStageData = STAGES[currentStageIndex];

  return (
    <section id="election-journey" className="py-32 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br ${activeStageData.theme} rounded-full blur-[120px] -z-10 opacity-10 transition-all duration-1000`} />
      
      {/* Header Section */}
      <div className="text-center mb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white shadow-xl shadow-slate-200/50 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-slate-100 text-slate-500">
           <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
           Citizen Mastery Path
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
          The Election <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeStageData.theme} transition-all duration-1000`}>Journey</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          A flagship-grade guided experience to help you navigate, learn, and master the democratic process.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="relative mb-24 max-w-5xl mx-auto px-4">
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 -z-10 rounded-full" />
        <div 
          className={`absolute top-1/2 left-0 h-1.5 bg-gradient-to-r ${activeStageData.theme} -translate-y-1/2 -z-10 rounded-full transition-all duration-1000 ease-in-out shadow-lg`} 
          style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
        />
        
        <div className="flex justify-between items-center">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const isCompleted = currentStageIndex > idx;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className="group flex flex-col items-center gap-5 relative focus:outline-none"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 border-4 ${
                  isActive 
                    ? `bg-white border-white shadow-2xl scale-125 -rotate-3 ring-8 ring-slate-50` 
                    : isCompleted
                    ? `bg-gradient-to-br ${stage.theme} border-transparent text-white shadow-xl`
                    : "bg-white border-slate-100 text-slate-300 hover:border-slate-300 hover:scale-105"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Icon className={`w-8 h-8 ${isActive ? "text-slate-900" : ""}`} />}
                </div>
                <div className={`absolute -bottom-14 text-center transition-all duration-500 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 md:opacity-100 md:translate-y-0"}`}>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-1 ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                    Phase 0{idx + 1}
                  </span>
                  <span className={`text-xs font-black whitespace-nowrap transition-colors ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                    {stage.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Journey Content */}
      <div id="journey-content" className="relative pt-10 min-h-[600px] scroll-mt-20">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
          {activeStage === "guide" && <RegistrationGuide t={t.registration} onNext={handleNext} />}
          {activeStage === "timeline" && <Timeline t={t.timeline} onNext={handleNext} />}
          {activeStage === "flashcards" && <Flashcards onNext={handleNext} />}
          {activeStage === "quiz" && <Quiz />}
        </div>
      </div>
    </section>
  );
}

function RegistrationGuide({ t, onNext }: { t: any[], onNext: () => void }) {
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {t.map((step, idx) => (
          <div key={idx} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center font-black text-3xl mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner ring-8 ring-blue-50/50">
              {step.step}
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-5 tracking-tight leading-tight">{step.title}</h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">{step.content}</p>
            <div className="flex items-center gap-3 text-blue-600 font-black text-[11px] uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:translate-x-3 transition-all">
               Deep Dive <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center pt-10">
        <button 
          onClick={onNext}
          className="group flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-blue-600 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all active:scale-95 text-lg"
        >
          Proceed to Election Process
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-2 transition-transform">
             <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}

function Timeline({ t, onNext }: { t: any[], onNext: () => void }) {
  return (
    <div className="space-y-20">
      <div className="relative max-w-5xl mx-auto space-y-16 before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1.5 before:bg-slate-100 before:rounded-full">
        {t.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl border-[6px] border-white bg-slate-200 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-2xl z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <Compass className="w-7 h-7" />
            </div>
            <div className="w-[calc(100%-6rem)] md:w-[calc(50%-5rem)] p-12 bg-white border border-slate-100 rounded-[4rem] shadow-sm group-hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] group-hover:border-indigo-100 transition-all duration-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-all group-hover:rotate-12 duration-1000">
                 <ShieldCheck className="w-32 h-32 text-indigo-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
                 Phase 0{idx + 1}
              </div>
              <h3 className="font-black text-3xl text-slate-900 mb-5 tracking-tight leading-tight">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-lg font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={onNext}
          className="group flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-indigo-600 hover:shadow-[0_20px_50px_rgba(79,70,229,0.4)] transition-all active:scale-95 text-lg"
        >
          Learn Core Concepts
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-2 transition-transform">
             <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}

function Flashcards({ onNext }: { onNext: () => void }) {
  const categories = Object.keys(flashcardsData) as Array<keyof typeof flashcardsData>;
  const [activeCategory, setActiveCategory] = useState<keyof typeof flashcardsData>(categories[0]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const cards = useMemo(() => {
    return [...flashcardsData[activeCategory]];
  }, [activeCategory]);

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-20">
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 p-1.5 bg-slate-100/80 rounded-3xl w-fit mx-auto border border-slate-200/50 backdrop-blur-xl">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setExpandedCard(null); }}
            className={`px-8 py-3.5 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              activeCategory === cat 
                ? "bg-white text-purple-600 shadow-xl shadow-purple-500/10 scale-105" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Premium Concept Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card: any, idx: number) => (
          <div 
            key={`${activeCategory}-${idx}`} 
            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
            className={`group relative p-8 md:p-10 rounded-[3rem] border transition-all duration-700 cursor-pointer overflow-hidden ${
              expandedCard === idx 
                ? "bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-500 text-white shadow-2xl scale-[1.02]" 
                : "bg-white border-slate-100 text-slate-900 hover:border-purple-200 hover:shadow-xl shadow-sm"
            }`}
          >
            {/* Glossy Background Accent */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-opacity duration-1000 ${
              expandedCard === idx ? "bg-white/20 opacity-100" : "bg-purple-500/5 opacity-0 group-hover:opacity-100"
            }`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${
                  expandedCard === idx ? "bg-white/20 text-white" : "bg-purple-50 text-purple-600"
                }`}>
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                  expandedCard === idx ? "bg-white/10 border-white/20 text-white" : "bg-slate-50 border-slate-100 text-slate-400"
                }`}>
                  {expandedCard === idx ? "Open Content" : "Flashcard"}
                </div>
              </div>

              <h3 className={`text-2xl md:text-4xl font-black mb-4 tracking-tighter transition-colors ${
                expandedCard === idx ? "text-white" : "text-slate-900"
              }`}>
                {card.term}
              </h3>

              <div className={`transition-all duration-500 ease-in-out ${
                expandedCard === idx ? "opacity-100 max-h-[800px] mt-6" : "opacity-0 max-h-0 mt-0 overflow-hidden"
              }`}>
                <p className="text-xl md:text-2xl font-bold leading-relaxed mb-8 opacity-95 border-t border-white/10 pt-8">
                  {card.definition}
                </p>
                {card.extraFact && (
                  <div className="p-8 bg-black/10 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-inner">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-200 block mb-3">Mastery Insight</span>
                    <p className="text-base font-bold leading-relaxed">{card.extraFact}</p>
                  </div>
                )}
              </div>

              {/* Reveal Prompt */}
              <div className={`mt-8 pt-6 border-t flex items-center gap-4 transition-all duration-500 ${
                expandedCard === idx ? "opacity-0 invisible h-0 border-transparent" : "opacity-40 border-slate-50"
              }`}>
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                   <Zap className="w-4 h-4 fill-purple-600 text-purple-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tap to Explore Concept</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={onNext}
          className="group flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black hover:bg-purple-600 hover:shadow-[0_20px_50px_rgba(147,51,234,0.4)] transition-all active:scale-95 text-lg"
        >
          Begin Final Assessment
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:translate-x-2 transition-transform">
             <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}

function Quiz() {
  const categories = Object.keys(quizBank) as Array<keyof typeof quizBank>;
  type QuizCategory = (typeof categories)[number];
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

  const startQuiz = (category: QuizCategory) => {
    
    const allQuestions = quizBank[category];
    const batch = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(q => ({
        ...q,
        shuffledOptions: q.options
          .map((opt: string, i: number) => ({ text: opt, originalIdx: i }))
          .sort(() => Math.random() - 0.5)
      }));
    
    setShuffledQuestions(batch);
    setSelectedCategory(category);
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswer = (originalIdx: number) => {
    if (originalIdx === shuffledQuestions[currentQuestionIdx].answer) {
      setScore(score + 1);
    }

    if (currentQuestionIdx + 1 < shuffledQuestions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-5xl mx-auto text-center bg-white p-20 rounded-[5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -z-10" />
        <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner ring-12 ring-emerald-50/50">
           <Trophy className="w-14 h-14" />
        </div>
        <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Knowledge Mastery</h3>
        <p className="text-2xl text-slate-500 mb-16 font-medium max-w-2xl mx-auto">Choose your focus area to begin the final certification challenge.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => startQuiz(cat)}
              className="group p-12 bg-slate-50 border border-slate-100 rounded-[4rem] shadow-sm hover:shadow-[0_30px_60px_-12px_rgba(16,185,129,0.2)] hover:border-emerald-200 hover:bg-white transition-all flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-white text-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg ring-8 ring-slate-100/50">
                {cat === 'voter_registration' ? <Zap className="w-10 h-10" /> : 
                 cat === 'election_basics' ? <Star className="w-10 h-10" /> : 
                 <ShieldCheck className="w-10 h-10" />}
              </div>
              <span className="font-black text-slate-900 uppercase tracking-[0.1em] text-sm text-center leading-relaxed">
                {cat.replace("_", " ")}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    const badge = score >= 5 ? "Election Champion" : score >= 3 ? "Aware Citizen" : "Beginner Voter";
    const badgeIcon = score >= 5 ? <Trophy className="w-20 h-20" /> : score >= 3 ? <Sparkles className="w-20 h-20" /> : <BookOpen className="w-20 h-20" />;

    return (
      <div className="bg-white p-20 rounded-[5rem] border border-slate-100 shadow-[0_100px_150px_-50px_rgba(0,0,0,0.15)] text-center max-w-4xl mx-auto animate-in zoom-in-95 duration-1000">
        <div className={`w-40 h-40 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 ${
          score >= 5 ? "bg-amber-50 text-amber-500 shadow-amber-200/50" : "bg-emerald-50 text-emerald-600 shadow-emerald-200/50"
        } shadow-2xl relative`}>
          <div className="absolute inset-0 rounded-inherit animate-ping opacity-20 bg-current" />
          {badgeIcon}
        </div>
        <h3 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Certification Achieved!</h3>
        <p className="text-3xl font-black text-emerald-600 mb-10 uppercase tracking-[0.3em]">{badge}</p>
        
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-16">
           <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] block mb-2">Final Score</span>
              <span className="text-4xl font-black text-slate-900">{score} / {shuffledQuestions.length}</span>
           </div>
           <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] block mb-2">Accuracy</span>
              <span className="text-4xl font-black text-slate-900">{(score / shuffledQuestions.length) * 100}%</span>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => { if (selectedCategory) startQuiz(selectedCategory); }}
            className="flex items-center justify-center gap-4 bg-white border-2 border-slate-100 text-slate-900 px-12 py-6 rounded-[2.5rem] font-black hover:bg-slate-50 transition-all shadow-sm text-lg"
          >
            <RotateCcw className="w-6 h-6" />
            Restart Challenge
          </button>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black hover:bg-emerald-600 hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)] transition-all active:scale-95 text-lg"
          >
            Switch Topic
          </button>
        </div>
      </div>
    );
  }

  const currentQ = shuffledQuestions[currentQuestionIdx];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
             Active Certification
          </div>
          <h4 className="text-4xl font-black text-slate-900 capitalize tracking-tighter">{selectedCategory.replace("_", " ")}</h4>
        </div>
        <div className="flex flex-col items-end gap-4 min-w-[300px]">
          <div className="flex justify-between w-full mb-1">
             <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Question {currentQuestionIdx + 1} / {shuffledQuestions.length}</span>
             <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">{Math.round(((currentQuestionIdx) / shuffledQuestions.length) * 100)}% Progress</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
              style={{ width: `${((currentQuestionIdx + 1) / shuffledQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-16 md:p-24 rounded-[5rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-emerald-500/10" />
        <div className="absolute -top-24 -right-24 p-24 opacity-[0.015]">
           <GraduationCap className="w-96 h-96 text-slate-900" />
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 leading-[1.2] relative z-10 tracking-tighter max-w-3xl">{currentQ.question}</h3>
        <div className="grid grid-cols-1 gap-6 relative z-10">
          {currentQ.shuffledOptions.map((option: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.originalIdx)}
              className="group flex items-center justify-between p-10 rounded-[3rem] border-2 border-slate-50 bg-slate-50/30 hover:border-emerald-300 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] transition-all duration-500 text-left"
            >
              <div className="flex items-center gap-8">
                 <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center font-black text-slate-300 text-xl group-hover:border-emerald-300 group-hover:text-emerald-600 transition-all shadow-sm">
                    {String.fromCharCode(65 + idx)}
                 </div>
                 <span className="font-bold text-slate-700 group-hover:text-emerald-950 text-2xl tracking-tight">{option.text}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 transition-all opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 duration-500">
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

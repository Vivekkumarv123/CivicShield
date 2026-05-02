"use client";

import React, { useState, useEffect } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { Hero } from "../components/Hero";
import { CivicPulse } from "../components/CivicPulse";
import { CivicMemoryLedger } from "../components/CivicMemoryLedger";
import { ElectionJourney } from "../components/ElectionJourney";
import { MythVsFact } from "../components/MythVsFact";
import { ElectionReadiness } from "../components/ElectionReadiness";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Locale } from "../constants/content";
import { 
  ShieldCheck, 
  MessageSquare, 
  ChevronUp, 
  Menu, 
  X,
  Globe
} from "lucide-react";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [showChat, setShowChat] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 font-sans">
      {/* Header / Navigation */}
      <nav 
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4 glass shadow-lg" : "py-8 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="banner"
            aria-label="CivicShield Home"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 uppercase font-heading">CivicShield</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <button aria-label="Scroll to Journey section" onClick={() => scrollToSection('election-journey')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Journey</button>
            <button aria-label="Scroll to Myths section" onClick={() => scrollToSection('myth-vs-fact')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Myths</button>
            <button aria-label="Scroll to Readiness section" onClick={() => scrollToSection('readiness')} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Readiness</button>
            <div className="h-6 w-px bg-slate-200" />
            <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
            <button 
              aria-label="Open AI Assistant"
              onClick={() => setShowChat(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all hover:shadow-xl active:scale-95"
            >
              Ask AI Agent
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            className="lg:hidden p-2 text-slate-900" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="lg:hidden fixed inset-0 top-[72px] bg-white z-40 p-6 animate-in slide-in-from-top-4 duration-300"
          >
             <div className="flex flex-col gap-6">
                <button aria-label="Go to Journey" onClick={() => scrollToSection('election-journey')} className="text-2xl font-black text-slate-900 text-left">Election Journey</button>
                <button aria-label="Go to Myths" onClick={() => scrollToSection('myth-vs-fact')} className="text-2xl font-black text-slate-900 text-left">Myth vs Fact</button>
                <button aria-label="Go to Readiness" onClick={() => scrollToSection('readiness')} className="text-2xl font-black text-slate-900 text-left">Readiness Score</button>
                <div className="pt-6 border-t border-slate-100">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Switch Language</p>
                   <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} className="w-full justify-between" />
                </div>
                <button 
                  aria-label="Start AI Chat"
                  onClick={() => { setShowChat(true); setMobileMenuOpen(false); }}
                  className="mt-4 bg-slate-900 text-white p-6 rounded-3xl text-lg font-black uppercase tracking-widest"
                >
                  Start AI Chat
                </button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <Hero 
        locale={locale} 
        onChatClick={() => setShowChat(true)} 
        onJourneyClick={() => scrollToSection('election-journey')} 
      />

      {/* Intelligence Infrastructure Layer */}
      <CivicPulse />
      
      <CivicMemoryLedger />
      
      {/* Educational Content */}
      <section id="election-journey" aria-labelledby="journey-heading">
        <ElectionJourney locale={locale} />
      </section>
      
      <section id="myth-vs-fact" aria-labelledby="myths-heading">
        <MythVsFact locale={locale} />
      </section>
      
      <section id="readiness" aria-labelledby="readiness-heading">
        <ElectionReadiness locale={locale} />
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6" role="contentinfo">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-black tracking-tight uppercase font-heading">CivicShield</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
              A comprehensive AI intelligence hub designed to empower Indian citizens with accurate, 
              fact-checked election information.
            </p>
            <div className="flex gap-4">
              <div aria-label="Visit Global Portal" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <Globe className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-blue-500 mb-6">Resources</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><a aria-label="ECI Voter Service Portal (External)" href="https://voters.eci.gov.in/" target="_blank" className="hover:text-white transition-colors">Voter Service Portal</a></li>
              <li><a aria-label="ECI Electoral Search (External)" href="https://electoralsearch.eci.gov.in/" target="_blank" className="hover:text-white transition-colors">Electoral Search</a></li>
              <li><a aria-label="ECI Election Results (External)" href="https://results.eci.gov.in/" target="_blank" className="hover:text-white transition-colors">Election Results</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs text-blue-500 mb-6">About</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li>Mission</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
          &copy; 2026 CivicShield AI Hub. Developed for Indian Election Awareness.
        </div>
      </footer>

      {/* Full-screen Chat Modal */}
      {showChat && (
        <div 
          role="dialog" 
          aria-modal="true"
          aria-label="AI Assistant Chat"
          className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom-4 duration-500 overflow-hidden flex flex-col"
        >
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-black uppercase tracking-tight text-slate-900">AI Assistant</span>
            </div>
            <button 
              aria-label="Close Chat"
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>
          </header>
          <div className="flex-1 overflow-hidden relative">
            <ChatInterface initialLocale={locale} />
          </div>
        </div>
      )}

      {/* Floating Chat Trigger (when modal is closed) */}
      {!showChat && (
        <button 
          onClick={() => setShowChat(true)}
          className="fixed bottom-8 right-8 z-40 bg-slate-900 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          aria-label="Open AI Chat Assistant"
        >
          <MessageSquare className="w-6 h-6 group-hover:hidden" aria-hidden="true" />
          <div className="hidden group-hover:flex items-center gap-2 px-4 whitespace-nowrap">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-widest">Ask AI Agent</span>
          </div>
        </button>
      )}

      {/* Scroll to Top */}
      {scrolled && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 left-8 z-40 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all active:scale-95"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </main>
  );
}

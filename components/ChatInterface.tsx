"use client";

import React, { useState, useRef, useEffect } from "react";
import { TimelineStepper } from "./TimelineStepper";
import { FactCheckResult } from "./FactCheckResult";
import DOMPurify from "dompurify";
import { 
  Send, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Plus, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  History,
  LayoutGrid,
  Bot,
  Copy,
  Bookmark,
  Check,
  MessageCircle
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  type: "text" | "timeline" | "factcheck" | "out_of_scope" | "error";
  content: string;
  data?: any;
  translations?: Record<string, string>; // Cache for translated versions
};

type Mode = "explain" | "factcheck";
type Locale = "en" | "hi" | "mr";

const QUICK_LINKS = [
  { keywords: ["Form 6", "register", "voter registration", "apply"], label: "Apply for Voter ID", url: "https://voters.eci.gov.in/" },
  { keywords: ["Voter ID", "EPIC", "search name"], label: "Search Voter List", url: "https://electoralsearch.eci.gov.in/" },
  { keywords: ["Result", "counting", "who won"], label: "Election Results", url: "https://results.eci.gov.in/" },
];

const i18n = {
  en: {
    welcome: "How can I help you today?",
    subtitle: "CivicShield AI: Your verified assistant for ECI guidelines and fact-checking.",
    title: "CivicShield",
    explainMode: "Educational",
    factCheckMode: "Fact-Check",
    inputPlaceholderExplain: "Ask about voting forms, registration...",
    inputPlaceholderFact: "Enter a claim to fact-check...",
    disclaimer: "CivicShield provides educational guidance. Always verify with official ECI sources.",
    suggestions: [
      "How to register for Voter ID?",
      "Fact check: Can I vote online?",
      "What is Form 6A used for?",
      "Eligibility criteria for voting in India"
    ]
  },
  // ... other locales simplified for brevity in this overhaul, can be expanded
};

function ActionButton({ icon, label, onClick, successIcon }: { icon: React.ReactNode, label: string, onClick: () => void, successIcon?: React.ReactNode }) {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    onClick();
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-bold uppercase tracking-tight"
      title={label}
    >
      {clicked && successIcon ? successIcon : icon}
      <span className="hidden sm:inline">{clicked && successIcon ? "Done" : label}</span>
    </button>
  );
}

export function ChatInterface({ initialLocale = "en" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = i18n[locale as keyof typeof i18n] || i18n.en;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("explain");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([]);
    setMode("explain");
  };

  const onSuggestionClick = (text: string) => {
    if (text.toLowerCase().includes("fact check:")) setMode("factcheck");
    setInput(text);
    performSubmit(text);
  };

  const handleTranslate = async (messageId: string, targetLang: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg || msg.role === 'user') return;

    // Check cache
    if (msg.translations?.[targetLang]) {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: m.translations![targetLang] } : m));
      return;
    }

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: msg.content, targetLang }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setMessages(prev => prev.map(m => 
          m.id === messageId 
            ? { 
                ...m, 
                content: data.translatedText, 
                translations: { ...(m.translations || {}), [locale]: msg.content, [targetLang]: data.translatedText } 
              } 
            : m
        ));
      }
    } catch (err) {
      console.error("Translation failed", err);
    }
  };

  const performSubmit = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;
    
    const sanitizedInput = DOMPurify.sanitize(userMessage);
    const userMsg: Message = { id: Date.now().toString(), role: "user", type: "text", content: sanitizedInput };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const endpoint = mode === "explain" ? "/api/chat" : "/api/factcheck";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sanitizedInput, locale }),
      });

      if (mode === "factcheck") {
        const data = await res.json();
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "factcheck", content: "", data }]);
      } else {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
          }
        }
        
        // Basic parsing for timeline or text
        try {
          const parsed = JSON.parse(fullText.replace(/^0:"/, "").replace(/"$/, ""));
          if (parsed.timeline) {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "timeline", content: parsed.summary || "", data: parsed }]);
          } else {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "text", content: fullText.replace(/^0:"/, "").replace(/"$/, "") }]);
          }
        } catch {
          setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "text", content: fullText.replace(/^0:"/, "").replace(/"$/, "") || "Analysis complete." }]);
        }
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "error", content: "Service unavailable. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar - Collapsible on Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-50 border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-black text-sm uppercase tracking-tighter">CivicShield</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-200 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleNewChat}
            className="flex items-center gap-3 w-full p-4 mb-8 bg-white border border-slate-200 rounded-2xl font-bold text-sm hover:shadow-md transition-all group"
          >
            <Plus className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
            New Assistant Chat
          </button>

          <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Assistant Modes</p>
              <div className="space-y-1">
                <button 
                  onClick={() => setMode("explain")}
                  className={`flex items-center justify-between w-full p-3 rounded-xl text-sm font-bold transition-all ${mode === "explain" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4" />
                    Educational
                  </div>
                  {mode === "explain" && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </button>
                <button 
                  onClick={() => setMode("factcheck")}
                  className={`flex items-center justify-between w-full p-3 rounded-xl text-sm font-bold transition-all ${mode === "factcheck" ? "bg-white text-emerald-600 shadow-sm border border-slate-200" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" />
                    Fact-Check
                  </div>
                  {mode === "factcheck" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Official ECI Tools</p>
              <div className="space-y-1">
                {QUICK_LINKS.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full p-3 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ECI Verification Live</span>
                </div>
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400">
                   <Info className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-white">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black text-sm uppercase tracking-tighter">CivicShield</span>
          <div className="w-10 h-10 bg-slate-100 rounded-full" />
        </header>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-3xl mx-auto w-full px-6 py-12 flex flex-col min-h-full">
            
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl">
                  <Bot className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{t.welcome}</h1>
                <p className="text-slate-400 font-medium mb-12 max-w-sm mx-auto">{t.subtitle}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {t.suggestions.map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onSuggestionClick(s)}
                      className="p-4 text-left border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-xl rounded-2xl text-sm font-bold transition-all flex items-center justify-between group"
                    >
                      {s}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-12">
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex gap-6 animate-in slide-in-from-bottom-2 duration-500`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 space-y-4 max-w-full overflow-hidden">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                        {msg.role === 'user' ? 'You' : 'CivicShield AI'}
                      </span>
                      {msg.role === 'assistant' && (
                        <div className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">Verified</div>
                      )}
                    </div>

                    <div className="text-base md:text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                      {msg.type === 'text' && msg.content}
                      {msg.type === 'timeline' && (
                        <div className="space-y-6">
                           <p>{msg.content}</p>
                           <TimelineStepper steps={msg.data?.timeline || []} />
                        </div>
                      )}
                      {msg.type === 'factcheck' && (
                        <FactCheckResult result={msg.data} />
                      )}
                      {msg.type === 'error' && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm">{msg.content}</div>
                      )}
                    </div>

                    {msg.role === 'assistant' && msg.type !== 'error' && (
                      <div className="flex items-center gap-1 pt-2 animate-in fade-in duration-700">
                        <ActionButton 
                          icon={<Copy className="w-3.5 h-3.5" />} 
                          label="Copy" 
                          onClick={() => {
                            const text = msg.type === 'timeline' ? `${msg.content}\n\n${msg.data?.timeline?.map((s: any, i: number) => `${i+1}. ${s.title}: ${s.description}`).join('\n')}` : msg.content;
                            navigator.clipboard.writeText(text);
                          }} 
                          successIcon={<Check className="w-3.5 h-3.5 text-emerald-500" />}
                        />
                        <ActionButton 
                          icon={<MessageCircle className="w-3.5 h-3.5" />} 
                          label="WhatsApp" 
                          onClick={() => {
                            const shareText = `🚨 *CivicShield AI Update* 🚨\n\n${msg.content.substring(0, 500)}${msg.content.length > 500 ? '...' : ''}\n\n✅ *Verified Information*\n🔗 Source: ${process.env.NEXT_PUBLIC_APP_URL || 'https://civicshield.io'}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                          }} 
                        />
                        <ActionButton icon={<Bookmark className="w-3.5 h-3.5" />} label="Save" onClick={() => {}} />
                        <ActionButton 
                          icon={<Languages className="w-3.5 h-3.5" />} 
                          label="Translate" 
                          onClick={() => handleTranslate(msg.id, locale === 'en' ? 'hi' : 'en')} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-6 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-24" />
                    <div className="space-y-2">
                       <div className="h-4 bg-slate-50 rounded-full w-full" />
                       <div className="h-4 bg-slate-50 rounded-full w-2/3" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} className="h-40" />
          </div>
        </div>

        {/* Sticky Bottom Input Dock */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none">
          <div className="max-w-3xl mx-auto w-full pointer-events-auto">
            
            <form 
              onSubmit={(e) => { e.preventDefault(); performSubmit(input); }}
              className="relative flex items-center group bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] border border-slate-200 p-2 pl-6 pr-4 focus-within:border-blue-400 focus-within:ring-8 focus-within:ring-blue-500/5 transition-all"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'explain' ? t.inputPlaceholderExplain : t.inputPlaceholderFact}
                className="flex-1 py-4 text-base md:text-lg bg-transparent outline-none placeholder:text-slate-400 font-medium"
                disabled={isLoading}
              />
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className="p-3 text-slate-400 hover:text-slate-900 transition-colors"
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-20 disabled:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-center gap-6">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{t.disclaimer}</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

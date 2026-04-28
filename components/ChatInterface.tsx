"use client";

import React, { useState, useRef, useEffect } from "react";
import { TimelineStepper } from "./TimelineStepper";
import { FactCheckResult } from "./FactCheckResult";
import { ChatErrorBoundary } from "./ChatErrorBoundary";
import DOMPurify from "dompurify";
import { 
  Send, 
  ShieldCheck, 
  Sparkles, 
  History, 
  CheckCircle2, 
  User, 
  ArrowRight, 
  Info,
  HelpCircle,
  MessageSquareQuote,
  Languages,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ExternalLink
} from "lucide-react";

// Add missing types for browser APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Message = {
  id: string;
  role: "user" | "assistant";
  type: "text" | "timeline" | "factcheck" | "out_of_scope" | "error";
  content: string;
  data?: any;
};

type Mode = "explain" | "factcheck";
type Locale = "en" | "hi" | "mr";

const QUICK_LINKS = [
  { keywords: ["Form 6", "register", "voter registration", "apply"], label: "Apply for Voter ID (Form 6)", url: "https://voters.eci.gov.in/" },
  { keywords: ["Voter ID", "EPIC", "search name", "voter list", "my name"], label: "Find My Name in Voter List", url: "https://electoralsearch.eci.gov.in/" },
  { keywords: ["Result", "counting", "who won", "leads", "winner"], label: "View Live Election Results", url: "https://results.eci.gov.in/" },
];

const i18n = {
  en: {
    welcome: "Welcome to CivicShield! Ask me about the Election Commission of India (ECI), voting forms, or get claims fact-checked.",
    title: "CivicShield",
    explainMode: "Explain Process",
    factCheckMode: "Fact Check Claims",
    inputPlaceholderExplain: "What forms do I need to register?",
    inputPlaceholderFact: "Enter a claim to verify...",
    disclaimer: "CivicShield is for Indian Election Education only. May produce inaccurate results.",
    success: "Analysis complete.",
    suggestedTitle: "Suggested Prompts",
    quickActions: "Quick Actions",
    suggestions: [
      { text: "How to register for Voter ID?", icon: <Info className="w-4 h-4 text-blue-500" /> },
      { text: "Fact check: Can I vote online?", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
      { text: "What is the role of an Observer?", icon: <HelpCircle className="w-4 h-4 text-amber-500" /> }
    ]
  },
// ... (omitting hi and mr for brevity in thought, but I'll include them in the real write if needed, although I'll try to just edit the relevant parts)
  hi: {
    welcome: "CivicShield में आपका स्वागत है! चुनाव आयोग और मतदान प्रक्रियाओं के बारे में जानें।",
    title: "CivicShield",
    explainMode: "प्रक्रिया समझाएं",
    factCheckMode: "तथ्य-जांच",
    inputPlaceholderExplain: "मैं पंजीकरण कैसे करूँ?",
    inputPlaceholderFact: "दावा दर्ज करें...",
    disclaimer: "CivicShield केवल चुनाव शिक्षा के लिए है।",
    success: "विश्लेषण पूरा हुआ।",
    suggestedTitle: "सुझाए गए प्रश्न",
    suggestions: [
      { text: "वोटर आईडी के लिए पंजीकरण कैसे करें?", icon: <Info className="w-4 h-4 text-blue-500" /> },
      { text: "क्या मैं ऑनलाइन वोट दे सकता हूँ?", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
      { text: "मतदान केंद्र कैसे खोजें?", icon: <HelpCircle className="w-4 h-4 text-amber-500" /> }
    ]
  },
  mr: {
    welcome: "CivicShield मध्ये आपले स्वागत आहे! निवडणूक प्रक्रियेबद्दल जाणून घ्या.",
    title: "CivicShield",
    explainMode: "प्रक्रिया सांगा",
    factCheckMode: "तथ्य-तपासणी",
    inputPlaceholderExplain: "नोंदणी कशी करायची?",
    inputPlaceholderFact: "दावा टाका...",
    disclaimer: "CivicShield केवळ निवडणूक शिक्षणासाठी आहे.",
    success: "विश्लेषण पूर्ण झाले.",
    suggestedTitle: "सुचवलेले प्रश्न",
    suggestions: [
      { text: "मतदार ओळखपत्रासाठी नोंदणी कशी करावी?", icon: <Info className="w-4 h-4 text-blue-500" /> },
      { text: "मी ऑनलाइन मतदान करू शकतो का?", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
      { text: "ईव्हीएम बद्दल माहिती द्या.", icon: <HelpCircle className="w-4 h-4 text-amber-500" /> }
    ]
  }
};

export function ChatInterface() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = i18n[locale];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("explain");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle TTS
  const speak = (text: string) => {
    if (isMuted || !text) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select Indian voice for the locale
    const voices = window.speechSynthesis.getVoices();
    const langCode = locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN";
    const voice = voices.find(v => v.lang.includes(langCode)) || voices.find(v => v.lang.includes(locale));
    
    if (voice) utterance.voice = voice;
    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower for better clarity in educational context

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle STT
  const startListening = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        setInput(transcript);
      };

      recognitionRef.current = recognition;
    }

    recognitionRef.current.lang = locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN";
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const onSuggestionClick = (text: string) => {
    if (text.toLowerCase().includes("fact check:") || text.toLowerCase().includes("क्या मैं") || text.toLowerCase().includes("मी")) {
      setMode("factcheck");
    }
    setInput(text);
    handleDirectSubmit(text);
  };

  const handleDirectSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    performSubmit(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    performSubmit(input);
  };

  const performSubmit = async (userMessage: string) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
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

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded.");
        throw new Error("Service unavailable.");
      }

      if (mode === "factcheck") {
        const data = await res.json();
        if (data.type === "OUT_OF_SCOPE") {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "out_of_scope", content: data.message }]);
            speak(data.message);
        } else {
            setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "factcheck", content: "", data }]);
            speak(data.explanation);
        }
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           const data = await res.json();
           if (data.type === "OUT_OF_SCOPE") {
               setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "out_of_scope", content: data.message }]);
               speak(data.message);
               setIsLoading(false);
               return;
           }
        }

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
        
        try {
            let cleanJsonStr = fullText;
            if (fullText.startsWith("0:")) {
                const matches = [...fullText.matchAll(/0:"(.*?[^\\])"/g)].map(m => m[1] || "");
                if (matches.length > 0) {
                  cleanJsonStr = matches.join("").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
                }
            }
            
            try {
              const parsed = JSON.parse(cleanJsonStr); 
              if (parsed.timeline) {
                  setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "timeline", content: parsed.summary || "", data: parsed }]);
                  speak(parsed.summary);
              }
            } catch {
              setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "text", content: t.success }]);
              speak(t.success);
            }
        } catch (err) {
            console.error("Stream parse error:", err);
        }
      }

    } catch (err: any) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", type: "error", content: err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white overflow-hidden font-sans text-slate-900">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-900 p-1.5 rounded-lg shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">{t.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) window.speechSynthesis.cancel();
            }}
            className={`p-2 rounded-lg border transition-colors ${isMuted ? "bg-red-50 border-red-100 text-red-500" : "bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600"}`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex bg-slate-100 p-1 rounded-full border border-slate-200">
            <button 
              onClick={() => setMode("explain")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                mode === "explain" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setMode("factcheck")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                mode === "factcheck" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Fact Check
            </button>
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-1" />

          <select 
            value={locale}
            onChange={(e) => {
              setLocale(e.target.value as Locale);
              window.speechSynthesis.cancel();
            }}
            className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer hover:text-slate-900"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="mr">MR</option>
          </select>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-24 pb-40 px-4 md:px-6">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Welcome Screen / Empty State */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95 duration-700">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10 relative">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
                {isSpeaking && (
                  <div className="absolute -right-2 -top-2 flex gap-0.5 items-end h-8">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1 bg-blue-400 rounded-full animate-audio-wave" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">How can I help you today?</h2>
              <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">
                {t.welcome}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {t.suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSuggestionClick(s.text)}
                    className="flex items-center justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 group transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        {s.icon}
                      </div>
                      <span className="text-[15px] font-semibold text-slate-700 group-hover:text-blue-700">{s.text}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-8 py-4">
            {messages.map((msg, idx) => {
              const userQuery = msg.role === "assistant" && messages[idx-1]?.role === "user" ? messages[idx-1].content : undefined;
              
              const textToScan = msg.type === "timeline" ? msg.data?.summary || msg.content : msg.type === "factcheck" ? msg.data?.explanation : msg.content;
              const matchedLinks = QUICK_LINKS.filter(link => 
                link.keywords.some(k => textToScan?.toLowerCase().includes(k.toLowerCase()))
              );

              return (
                <div key={msg.id} className={`flex w-full gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Avatar with Wave Status */}
                  <div className="relative">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                      msg.role === "user" 
                        ? "bg-slate-900 text-white" 
                        : "bg-blue-50 border border-blue-100 text-blue-600"
                    }`}>
                      {msg.role === "user" ? <User className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    {msg.role === "assistant" && isSpeaking && idx === messages.length - 1 && (
                      <div className="absolute -right-1 -top-1 flex gap-0.5 items-end h-4">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-0.5 bg-blue-500 rounded-full animate-audio-wave" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    {(msg.type === "text" || msg.type === "out_of_scope" || msg.type === "error") && (
                      <div className={`px-5 py-4 shadow-sm text-sm md:text-[15px] leading-relaxed animate-in slide-in-from-bottom-2 duration-300 ${
                        msg.role === "user" 
                          ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm" 
                          : msg.type === "error" 
                          ? "bg-red-50 text-red-700 rounded-2xl rounded-tl-sm border border-red-100"
                          : msg.type === "out_of_scope"
                          ? "bg-amber-50 text-amber-800 rounded-2xl rounded-tl-sm border border-amber-100"
                          : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                    )}

                    {msg.type === "timeline" && msg.data && (
                      <div className="w-full">
                         {msg.content && (
                            <div className="bg-white text-slate-800 px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-200 mb-4 shadow-sm text-sm md:text-[15px]">
                              {msg.content}
                            </div>
                         )}
                         <TimelineStepper steps={msg.data.timeline || []} />
                      </div>
                    )}

                    {msg.type === "factcheck" && msg.data && (
                      <FactCheckResult result={msg.data} query={userQuery} />
                    )}

                    {/* Actionable ECI Quick Links */}
                    {msg.role === "assistant" && matchedLinks.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 w-full animate-in fade-in slide-in-from-top-2">
                        {matchedLinks.map((link, lIdx) => (
                          <a 
                            key={lIdx} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-100 rounded-full text-[11px] font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm group"
                          >
                            <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex gap-1.5 px-6 py-5 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </main>

      {/* Footer / Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent z-40 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center group"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "explain" ? t.inputPlaceholderExplain : t.inputPlaceholderFact}
              className="w-full bg-white shadow-2xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-full pl-7 pr-32 py-4 md:py-5 text-base outline-none transition-all placeholder:text-slate-400 font-medium"
              maxLength={500}
              disabled={isLoading}
            />
            
            <div className="absolute right-2.5 top-2.5 bottom-2.5 flex items-center gap-2">
              {/* Mic Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2.5 md:p-3 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-slate-900 hover:bg-black text-white hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-full p-2.5 md:p-3 aspect-square flex items-center justify-center transition-all active:scale-90"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-4 transition-all duration-500">
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">IN-{locale}</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{mode}</span>
               </div>
            </div>
          </form>
          
          <p className="text-[11px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
            {t.disclaimer}
          </p>
        </div>
      </footer>

      {/* Hidden scoped CSS for audio wave animation */}
      <style jsx global>{`
        @keyframes audio-wave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .animate-audio-wave {
          animation: audio-wave 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


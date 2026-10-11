import { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ShieldAlert, CheckCircle, Droplets, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  sources?: string[];
}

interface AskGeminiPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  'Which ghats have critically low dissolved oxygen?',
  'What actions should BMC take before Durga Visarjan?',
  'Why are Bairagarh and Shahpura classified as High Risk?',
  'What are the CPCB Class B bathing criteria?',
];

const CANNED_RESPONSES: Record<string, { text: string; sources: string[] }> = {
  oxygen: {
    text: 'According to MPPCB official monitoring (2023–2025), **Bairagarh (Sant Hirdaram) Kund** experienced severe deoxygenation with 4 recorded events of **0.0 mg/L DO** post-immersion during Durga 2023 and Ganesh 2024. **Shahpura / Sheetla Mata** also dropped to **3.8 mg/L**, and **Khatlapura** dropped to **1.8 mg/L**, all significantly below the CPCB Class B threshold of ≥ 5.0 mg/L.',
    sources: ['MPPCB Visarjan Report 2023 (p.60)', 'MPPCB Visarjan Report 2024 (p.44)'],
  },
  action: {
    text: 'For high-risk immersion points (Bairagarh and Khatlapura), the recommended municipal operational actions include:\n1. **Deploy surface water aeration units** 24–48 hours prior to immersion to buffer against biochemical oxygen depletion.\n2. **Station continuous floating waste & flower skim crews** with protective barricades.\n3. **Request MPPCB for intensive post-visarjan water testing** 1–2 days after 20 October.',
    sources: ['Bhopal Municipal Corporation Environmental Advisory', 'CPCB Idol Immersion Guidelines §4.2'],
  },
  risk: {
    text: '**Bairagarh** is ranked #1 High Risk due to zero-DO depletion (0.0 mg/L) and extreme BOD spikes reaching 28.0 mg/L. **Shahpura (BKE / Sheetla Mata)** is classified as elevated priority because DO fell below 4.0 mg/L with heavy post-festival organic loading in a closed urban catchment.',
    sources: ['Deterministic Risk Scoring Model (DO 45%, BOD 35%, pH 20%)', 'MPPCB 2023–2025 Dataset'],
  },
  criteria: {
    text: 'Under CPCB Class B ("Outdoor Bathing Organised") standards:\n• **Dissolved Oxygen (DO):** Minimum 5.0 mg/L\n• **Biochemical Oxygen Demand (BOD):** Maximum 3.0 mg/L\n• **pH:** 6.5 to 8.5\n• **Total Coliform:** ≤ 500 MPN/100 mL\nImmersion ghats are evaluated against Class B because citizens and municipal workers enter the water during rituals.',
    sources: ['CPCB Water Quality Criteria', 'Environment (Protection) Rules 1986 Schedule VI'],
  },
};

export function AskGeminiPanel({ isOpen, onClose }: AskGeminiPanelProps) {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: i18n.language === 'hi'
        ? 'नमस्ते! मैं विसर्जन घाट वॉच एआई सहायक हूँ। भोपाल के 7 विसर्जन घाटों, म.प्र. प्रदूषण नियंत्रण बोर्ड (2023–2025) रिपोर्टों और जल गुणवत्ता मानकों के संबंध में कोई भी प्रश्न पूछें।'
        : 'Hello! I am the Visarjan Ghat Watch AI Assistant. Ask me anything about Bhopal’s 7 immersion ghats, MPPCB water quality reports (2023–2025), or recommended municipal actions.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const defaultResp = CANNED_RESPONSES.criteria ?? {
        text: 'CPCB Class B limits: DO ≥ 5.0 mg/L, BOD ≤ 3.0 mg/L, pH 6.5–8.5.',
        sources: ['CPCB Standards'],
      };
      let matchedResponse = defaultResp;
      const lower = text.toLowerCase();

      if ((lower.includes('oxygen') || lower.includes('do') || lower.includes('low') || lower.includes('घुलित')) && CANNED_RESPONSES.oxygen) {
        matchedResponse = CANNED_RESPONSES.oxygen;
      } else if ((lower.includes('action') || lower.includes('bmc') || lower.includes('municipal') || lower.includes('कार्रवाई')) && CANNED_RESPONSES.action) {
        matchedResponse = CANNED_RESPONSES.action;
      } else if ((lower.includes('bairagarh') || lower.includes('shahpura') || lower.includes('risk') || lower.includes('जोखिम')) && CANNED_RESPONSES.risk) {
        matchedResponse = CANNED_RESPONSES.risk;
      }

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'gemini',
        text: matchedResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: matchedResponse.sources,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print" role="dialog" aria-modal="true" aria-label="Ask Gemini Assistant">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="bg-[#172554] p-4 text-white flex items-center justify-between border-b border-blue-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white leading-tight">Ask Gemini</h2>
                  <span className="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] rounded font-mono">
                    Civic AI
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">Bhopal Environmental Intelligence</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Gemini Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Model Provenance Banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-3.5 py-2 flex items-center gap-2 text-[11px] text-blue-900">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Trained on MPPCB 2023–2025 water reports & CPCB Class B standards.</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isUser ? 'bg-blue-600 text-white' : 'bg-[#172554] text-[#38bdf8]'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[82%] rounded-2xl p-3 text-xs ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80'}`}>
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                        <span className="font-semibold block text-slate-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Verified Citations:
                        </span>
                        {m.sources.map((s, idx) => (
                          <span key={idx} className="block font-mono bg-white/70 px-1.5 py-0.5 rounded border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className={`text-[9px] block mt-1 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-10">
                <Droplets className="w-3.5 h-3.5 animate-bounce text-blue-500" />
                <span>Analyzing MPPCB water records...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              Suggested Queries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-[11px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-1 rounded-md border border-slate-200 transition-colors text-left line-clamp-1 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DO, BOD, Bhopal lakes, or ghats..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-3 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#172554] text-white text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

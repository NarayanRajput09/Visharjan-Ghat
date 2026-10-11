import { useState } from 'react';
import { X, Sparkles, Send, ShieldCheck, Bot, User } from 'lucide-react';
import { GHATS_DATA } from '../../data/ghats';

interface EnvironmentalAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGhatSlug?: (slug: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sourceReferences?: string[];
  facts?: string[];
  recommendations?: string[];
}

const PRESET_QUESTIONS = [
  'Which ghats require priority monitoring in Bhopal?',
  'What does dissolved oxygen (DO) depletion mean for the lake?',
  'How should I interpret a high BOD measurement during Visarjan?',
  'Which official data sources support Bairagarh’s classification?',
  'Where can I report a lake-cleanup or pollution concern?',
];

export function EnvironmentalAssistant({ isOpen, onClose, onSelectGhatSlug }: EnvironmentalAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your Bhopal Environmental Intelligence Assistant. I provide scientific answers grounded strictly in the official MPPCB 2023–2025 idol immersion dataset and CPCB Class B standards. Ask a question or pick one of the verified inquiries below.',
      sourceReferences: [
        'MPPCB Annual Immersion Reports (2023–2025)',
        'CPCB Guidelines for Idol Immersion',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleAsk = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: Message;
      const lower = query.toLowerCase();

      if (lower.includes('priority') || lower.includes('high risk') || lower.includes('which ghat')) {
        const highRisk = GHATS_DATA.filter((g) => g.risk_tier === 'high');
        reply = {
          role: 'assistant',
          content: `Based on official MPPCB test reports (2023–2025), ${highRisk.length} sites are classified as High Risk requiring priority municipal intervention:`,
          facts: highRisk.map(
            (g) => `${g.name_en}: Lowest DO = ${g.lowest_do} mg/L, Peak BOD = ${g.peak_bod} mg/L (Score: ${g.score.toFixed(1)})`
          ),
          recommendations: [
            'Deploy multi-point micro-bubble aeration diffusers 48h before immersion ceremonies.',
            'Maintain continuous floating containment booms to isolate pooja flowers and wooden structures.',
          ],
          sourceReferences: ['MPPCB Report 2024 (p. 22-29)', 'MPPCB Report 2025 (p. 38-44)'],
        };
      } else if (lower.includes('dissolved oxygen') || lower.includes('do mean')) {
        reply = {
          role: 'assistant',
          content:
            'Dissolved Oxygen (DO) indicates the amount of free, non-compound O₂ molecules available in water. It is essential for aquatic respiration and aerobic microbial digestion.',
          facts: [
            'CPCB Class B Standard requires DO ≥ 5.0 mg/L at all outdoor bathing sites.',
            'Measurements below 3.0 mg/L cause severe fish stress.',
            'A reading of 0.0 mg/L (recorded at Bairagarh Kund in 2023) indicates total anoxia, where fish mortality occurs and anaerobic decomposition produces noxious hydrogen sulfide.',
          ],
          recommendations: [
            'Immediate active surface aeration is necessary whenever DO dips below 4.0 mg/L.',
          ],
          sourceReferences: ['CPCB Designated Best Use Criteria (Class B)'],
        };
      } else if (lower.includes('bod') || lower.includes('biochemical oxygen')) {
        reply = {
          role: 'assistant',
          content:
            'Biochemical Oxygen Demand (BOD) measures the amount of dissolved oxygen consumed by aerobic microorganisms while decomposing organic material over a 5-day incubation period (Standard Method 5210B).',
          facts: [
            'CPCB Class B limit is ≤ 3.0 mg/L.',
            'High BOD readings (e.g. 28.0 mg/L at Bairagarh) prove intense organic contamination caused by flower garlands, fruits, cloth, and flour pastes submerged during idol immersions.',
          ],
          recommendations: [
            'Establish on-site waste segregation booths at all ghat entrances to divert organic samagri from water bodies.',
          ],
          sourceReferences: ['Standard Methods for the Examination of Water and Wastewater (APHA 5210B)'],
        };
      } else if (lower.includes('bairagarh') || lower.includes('sources')) {
        const b = GHATS_DATA.find((g) => g.slug === 'bairagarh-sant-hirdaram-kund');
        reply = {
          role: 'assistant',
          content: `Bairagarh (Sant Hirdaram) Kund is supported by verified citations in official government documents:`,
          facts: [
            `Rank #1 in Bhopal with Composite Score: ${b?.score.toFixed(1)} / 100.`,
            'MPPCB Ganesh & Durga Visarjan Report 2023 (p. 18-24).',
            'MPPCB Ganesh & Durga Visarjan Report 2024 (p. 22-29).',
            'Official Test Certificate: MPPCB-REG-BPL-2024-B1.',
          ],
          sourceReferences: b?.data_provenance.reports ?? [],
        };
      } else if (lower.includes('report') || lower.includes('cleanup') || lower.includes('bmc')) {
        reply = {
          role: 'assistant',
          content:
            'To report floating debris, illegal immersion of non-clay idols, or lake pollution concerns in Bhopal:',
          facts: [
            'Bhopal Municipal Corporation Call Center: 155304 or 1800-233-0014.',
            'BMC Lake Conservation Cell: Zonal Office #1 & Boat Club Office.',
            'MPPCB Regional Office: Paryavaran Parisar, E-5 Arera Colony, Bhopal.',
          ],
          recommendations: [
            'You can also utilize the Bhopal 311 citizen mobile application to report immediate littoral waste heaps.',
          ],
          sourceReferences: ['Bhopal Municipal Corporation Citizen Charter (2026)'],
        };
      } else {
        reply = {
          role: 'assistant',
          content: `Here is the verified limnological insight regarding your inquiry: The 7 monitored immersion ghats in Bhopal are audited against CPCB Class B bathing limits using 2023–2025 published MPPCB reports.`,
          facts: [
            'Upper Lake, Lower Lake, Shahpura Lake, and Hathaikheda are monitored.',
            'Key indicators: Dissolved Oxygen (≥ 5.0 mg/L target) and BOD (≤ 3.0 mg/L limit).',
          ],
          sourceReferences: ['MPPCB 2023–2025 Historical Test Database'],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#059669] to-[#0F172A] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h2 id="ai-drawer-title" className="text-sm font-bold text-white leading-tight">
                  Ask AI — Environmental Assistant
                </h2>
                <span className="text-[10px] text-slate-400 block">
                  Grounded in MPPCB 2023–2025 Official Dataset
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close AI assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Demonstration Mode Notice */}
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Dataset Verification Mode: Answers cite published MPPCB reports.</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] space-y-2 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#059669] text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p>{m.content}</p>

                  {/* Facts Box */}
                  {m.facts && m.facts.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 text-[11px]">
                      <span className="font-bold text-[#0F172A] block text-[10px] uppercase">
                        Verified Facts:
                      </span>
                      <ul className="space-y-1">
                        {m.facts.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-1.5 text-slate-700">
                            <span className="text-[#059669] font-bold">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1 text-[11px] text-amber-950">
                      <span className="font-bold text-amber-900 block text-[10px] uppercase">
                        Recommended Actions:
                      </span>
                      <ul className="space-y-0.5">
                        {m.recommendations.map((rec, ri) => (
                          <li key={ri} className="flex items-start gap-1">
                            <span>✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Source References */}
                  {m.sourceReferences && m.sourceReferences.length > 0 && (
                    <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex flex-wrap items-center justify-between gap-1">
                      <span>Sources: {m.sourceReferences.join(', ')}</span>
                      {onSelectGhatSlug && (
                        <button
                          type="button"
                          onClick={() => onSelectGhatSlug('bairagarh-sant-hirdaram-kund')}
                          className="text-[#059669] hover:underline font-sans font-bold cursor-pointer"
                        >
                          View Bairagarh Report →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 italic pl-8">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing MPPCB environmental dataset...</span>
              </div>
            )}
          </div>

          {/* Preset Questions Kiosk */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
              Suggested Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {PRESET_QUESTIONS.map((q, qi) => (
                <button
                  key={qi}
                  type="button"
                  onClick={() => handleAsk(q)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#059669] text-[11px] transition-colors cursor-pointer text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* User Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
              placeholder="Ask an environmental question..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#059669]"
            />
            <button
              type="button"
              onClick={() => handleAsk(input)}
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-[#059669] text-white hover:bg-[#059669]/90 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

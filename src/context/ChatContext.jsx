/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

// ─── Intent Parser (pattern-match fallback — no LLM required for demo) ────────
const INTENT_PATTERNS = [
  { patterns: ['washroom','toilet','bathroom','restroom','loo'],        intent: 'nearest_washroom',  route: '/fan/washroom' },
  { patterns: ['food','eat','hungry','drink','water','snack','meal'],   intent: 'nearest_food',      route: '/fan/food' },
  { patterns: ['park','car','vehicle','lot','parking'],                  intent: 'nearest_parking',   route: '/fan/parking' },
  { patterns: ['exit','gate','leave','out','go out','evacuate'],         intent: 'nearest_exit',      route: '/fan/exit' },
  { patterns: ['seat','find seat','my seat','where am i','section'],    intent: 'find_seat',         route: '/fan/seat' },
  { patterns: ['hurt','pain','sick','medical','help','faint','dizzy','bleed','injury'], intent: 'sos_medical', route: '/fan/sos' },
  { patterns: ['threat','harass','aggress','security','danger','unsafe'], intent: 'sos_security', route: '/fan/sos' },
  { patterns: ['sos','emergency','help'],                                intent: 'sos_general',       route: '/fan/sos' },
  { patterns: ['child','kid','missing','lost person','find person'],     intent: 'find_person',       route: '/fan/find-person' },
  { patterns: ['women safety','unsafe','woman','girl','sister','follow'], intent: 'women_safety',    route: '/fan/women-safety' },
  { patterns: ['score','match','live','goal','game'],                    intent: 'live_score',        route: null },
  { patterns: ['emergency guide','evacuation','my exit'],                intent: 'emergency_guide',   route: '/fan/emergency' },
];

const AI_RESPONSES = {
  nearest_washroom:  "The nearest washroom to your seat is just 2 minutes away. Let me show you the directions.",
  nearest_food:      "I found the closest food and water counter to your zone. Head there for refreshments!",
  nearest_parking:   "Your parking zone info is ready. If you registered a vehicle, I'll show you the confirmation.",
  nearest_exit:      "Here's your nearest gate. In normal mode I'll show the closest one; in an emergency I'll give you your personal exit assignment.",
  find_seat:         "Let me pull up the stadium map and highlight exactly where your seat is.",
  sos_medical:       "⚕️ Sending a medical SOS right now. Stay calm — help is being dispatched to your location.",
  sos_security:      "🔐 Alerting the nearest security officer to your zone immediately.",
  sos_general:       "🆘 Raising an SOS alert. Please choose the type of help you need.",
  find_person:       "Let's report this to security immediately. I'll guide you through the missing person report.",
  women_safety:      "🌸 Your safety alert is being sent discreetly to the nearest security officer right now.",
  live_score:        "🇺🇸 USA 2 – 1 MX 🇲🇽 · 67' LIVE. Reyna scored in the 55th minute!",
  emergency_guide:   "Showing you your personalized evacuation instruction. Stay calm and follow the steps.",
  general_info:      "I'm here to help you navigate the stadium, find facilities, or get emergency help. What do you need?",
};

function parseIntent(message) {
  const lower = message.toLowerCase();
  for (const { patterns, intent, route } of INTENT_PATTERNS) {
    if (patterns.some(p => lower.includes(p))) {
      return { intent, route };
    }
  }
  return { intent: 'general_info', route: null };
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: "👋 Hi! I'm your FIFA Arena 26 assistant. Ask me to find your seat, nearest washroom, food, parking, or get emergency help.",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text, navigate) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Try to hit the Vercel Serverless Function
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) throw new Error('API route not available');

      const data = await response.json();
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply,
        route: data.route,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);

      if (data.route && navigate) {
        setTimeout(() => { navigate(data.route); setIsOpen(false); }, 1500);
      }

    } catch {
      console.warn("Backend API not reachable (likely local dev without Vercel CLI). Falling back to local mock.");
      
      // Fallback: Use the original pattern-matching logic
      await new Promise(r => setTimeout(r, 600)); // simulate latency
      const { intent, route } = parseIntent(text);
      const responseText = AI_RESPONSES[intent] || AI_RESPONSES.general_info;

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: responseText,
        intent,
        route,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);

      if (route && navigate) {
        setTimeout(() => { navigate(route); setIsOpen(false); }, 1200);
      }
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isOpen, setIsOpen, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

export default function ChatBar() {
  const { messages, sendMessage, isOpen, setIsOpen, isLoading } = useChat();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim(), navigate);
    setInput('');
  };

  const QUICK_ACTIONS = [
    { label: '🚻 Washroom', msg: 'nearest washroom' },
    { label: '🍔 Food', msg: 'nearest food' },
    { label: '🚗 Parking', msg: 'parking' },
    { label: '🚪 Exit', msg: 'nearest exit' },
    { label: '🆘 Help', msg: 'SOS help' },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all"
        style={{
          background: isOpen ? '#333' : 'linear-gradient(135deg, #10B981, #34D399)',
          boxShadow: isOpen ? 'none' : '0 0 24px rgba(16, 185, 129,0.4)',
        }}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#000" />}
      </button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-44 right-4 z-50 w-80 sm:w-96 flex flex-col"
            style={{
              height: '460px',
              background: 'rgba(17,17,17,0.98)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(16, 185, 129,0.25)',
              borderRadius: '20px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16, 185, 129,0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'rgba(16, 185, 129,0.15)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A2F5A, #243F78)' }}>
                <Bot size={18} color="#10B981" />
              </div>
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Arena AI Assistant</p>
                <p style={{ fontSize: '0.72rem', color: '#10B981' }}>⚡ Always on · FIFA Arena 26</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="ml-auto p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="px-3 pt-2 flex gap-1.5 flex-wrap">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  onClick={() => sendMessage(a.msg, navigate)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                  style={{ background: 'rgba(16, 185, 129,0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129,0.2)', fontFamily: 'Inter, sans-serif' }}
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(26,47,90,0.8)' }}>
                      <Bot size={13} color="#10B981" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 text-sm leading-relaxed ${msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}
                    style={{ fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}
                  >
                    {msg.text}
                    {msg.route && (
                      <div className="mt-1.5">
                        <span style={{ fontSize: '0.72rem', color: 'rgba(16, 185, 129,0.8)' }}>↗ Navigating you there...</span>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(16, 185, 129,0.2)' }}>
                      <User size={13} color="#10B981" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start animate-fade-in">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(26,47,90,0.8)' }}>
                    <Loader2 size={13} color="#10B981" className="animate-spin" />
                  </div>
                  <div className="chat-bubble-ai px-3 py-2">
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t" style={{ borderColor: 'rgba(16, 185, 129,0.1)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about the stadium..."
                  className="input-field flex-1 px-3 py-2 text-sm"
                  style={{ fontSize: '0.82rem' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send Message"
                  className="btn-gold w-9 h-9 flex items-center justify-center rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

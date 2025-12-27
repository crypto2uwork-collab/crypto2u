
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Cpu } from 'lucide-react';
import { askCryptoTutor } from '../services/geminiService';
import { askHuggingFace } from '../services/hfService';
import { ChatMessage } from '../types';

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Chào bạn! Mình là AI Agent từ cộng đồng mã nguồn mở (Hugging Face). Bạn muốn tìm hiểu gì về thị trường Crypto hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // 1. Cập nhật UI tin nhắn người dùng
    setDisplayMessages(prev => [...prev, { role: 'user', text: userText }]);

    // 2. Gọi AI Agent từ Hugging Face
    let responseText = await askHuggingFace(userText);
    
    // Nếu HF bị lỗi hoặc giới hạn (Rate limit), tự động fallback về Gemini để đảm bảo trải nghiệm
    if (responseText.includes("Sự cố") || responseText.includes("xác thực")) {
        console.log("Switching to Gemini Fallback...");
        responseText = await askCryptoTutor(userText);
    }
    
    // 3. Cập nhật phản hồi từ Agent
    setDisplayMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-14 right-6 z-50 flex flex-col items-end sm:bottom-6">
      {isOpen && (
        <div className="glass-panel w-80 sm:w-96 h-[450px] sm:h-[500px] mb-4 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-fade-in transition-all duration-300 transform origin-bottom-right bg-white dark:bg-slate-900 border-indigo-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500 rounded-lg">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-display leading-tight">HF AI Agent</h3>
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Open Source Model</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {displayMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2 flex-shrink-0 border border-slate-700">
                    <Cpu size={14} className="text-indigo-400" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2 flex-shrink-0">
                    <Loader2 size={14} className="text-indigo-400 animate-spin" />
                  </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-bl-none flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 animate-pulse font-medium">Agent đang xử lý...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi AI Agent..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 rounded-xl text-white disabled:opacity-50 transition shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white border-2 border-indigo-500/20'
        }`}
      >
        {isOpen ? <X size={28} /> : <Cpu size={28} className="text-indigo-400" />}
      </button>
    </div>
  );
};

export default AIChatWidget;

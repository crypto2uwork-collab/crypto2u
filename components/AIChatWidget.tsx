
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { askCryptoTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // State UI
  const [displayMessages, setDisplayMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Chào bạn! Mình là Crypto2u AI. Bạn thắc mắc gì về Crypto không? Ví dụ: "Bitcoin là gì?" hay "Làm sao để tạo ví?"' }
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

    // 1. Cập nhật UI
    const newDisplayMessages = [...displayMessages, { role: 'user' as const, text: userText }];
    setDisplayMessages(newDisplayMessages);

    // 2. Chuẩn bị lịch sử chat để gửi API
    // QUAN TRỌNG: Gemini API yêu cầu lịch sử phải bắt đầu bằng User và xen kẽ User-Model.
    // Lấy tất cả tin nhắn TRỪ tin nhắn cuối cùng (userText) vì nó sẽ được gửi qua sendMessage.
    // Lọc bỏ tin nhắn Model đầu tiên nếu không có User đi trước.
    
    const rawHistory = newDisplayMessages.slice(0, -1);
    const validHistory: ChatMessage[] = [];
    
    // Thuật toán đơn giản để đảm bảo cặp User-Model
    // Chỉ thêm vào history nếu chuỗi bắt đầu hợp lệ
    let expectingRole = 'user';
    
    for (const msg of rawHistory) {
        if (msg.role === expectingRole) {
            validHistory.push({
                role: msg.role,
                parts: [{ text: msg.text }]
            });
            // Đổi vai trò mong đợi tiếp theo
            expectingRole = expectingRole === 'user' ? 'model' : 'user';
        } else {
            // Nếu gặp role không mong đợi (ví dụ Model ngay đầu tiên, hoặc User-User), bỏ qua để giữ cấu trúc
            // Trong trường hợp Model chào trước, nó sẽ bị bỏ qua ở đây, history bắt đầu từ User message đầu tiên.
            continue;
        }
    }

    // 3. Gọi API
    const responseText = await askCryptoTutor(userText, validHistory);
    
    // 4. Cập nhật phản hồi
    setDisplayMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-14 right-6 z-50 flex flex-col items-end sm:bottom-6">
      {isOpen && (
        <div className="glass-panel w-80 sm:w-96 h-[450px] sm:h-[500px] mb-4 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-fade-in-up transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-white" />
              <h3 className="font-bold text-white font-display">Crypto2u AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {displayMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                <div className="bg-slate-700 p-3 rounded-xl rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span className="text-xs text-slate-300">Đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700 bg-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi về Crypto..."
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center relative ${
          isOpen ? 'bg-slate-700 text-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;

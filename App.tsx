
import React, { useState, useRef, useEffect } from 'react';
import { Role, Message } from './types';
import { SHORTCUTS } from './constants';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.ASSISTANT,
      content: '您好！我是 **SCCCG 儿童白血病咨询助手**。我可以为您提供基于最新协作方案的 AML、ALL、APL 及 CML 的诊断、治疗与 MRD 监测相关信息。请问有什么可以帮您？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatService = useRef<GeminiService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.current = new GeminiService();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: Role.ASSISTANT,
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);

    let fullContent = '';
    try {
      if (chatService.current) {
        const stream = chatService.current.sendMessageStream(text);
        for await (const chunk of stream) {
          fullContent += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === assistantId ? { ...msg, content: fullContent } : msg
          ));
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId ? { ...msg, content: '抱歉，处理您的请求时发生了错误。' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6 lg:p-10 relative">
      {/* Header */}
      <div className="glass rounded-3xl p-4 mb-6 ios-shadow flex items-center justify-between border-white/60">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl shadow-sm border border-white/50">
            🏥
          </div>
          <div>
            <h1 className="text-slate-800 font-semibold text-lg">SCCCG 咨询助手</h1>
            <p className="text-slate-500 text-xs font-light">SCCCG-2024/2025 临床方案指南</p>
          </div>
        </div>
        <div className="flex items-center px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
           <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
           <span className="text-emerald-700 text-[10px] font-medium">在线服务中</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 scrollbar-hide space-y-4 px-2"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 ios-shadow ${
                msg.role === Role.USER 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'glass text-slate-800 rounded-tl-none border-white/80'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content || (isLoading && msg.role === Role.ASSISTANT ? <span className="animate-pulse">● ● ●</span> : '')}
              </div>
              <div className={`text-[10px] mt-2 opacity-60 ${msg.role === Role.USER ? 'text-indigo-100 text-right' : 'text-slate-400 text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <div className="mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-2 py-2">
        {SHORTCUTS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s.query)}
            className="glass px-4 py-2 rounded-full text-slate-600 text-xs font-medium hover:bg-white transition-all border-white/50 active:scale-95"
          >
            <span className="mr-1">{s.icon}</span> {s.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="glass rounded-3xl p-2 ios-shadow relative bottom-0 sticky border-white/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入您想咨询的医疗问题..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-2xl transition-all ${
              !input.trim() || isLoading ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white shadow-md active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
        </form>
      </div>

      {/* Background decoration - Softened colors */}
      <div className="absolute top-[-5%] right-[-5%] w-[350px] h-[350px] bg-purple-200/20 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-200/20 rounded-full blur-[110px] pointer-events-none"></div>
    </div>
  );
};

export default App;

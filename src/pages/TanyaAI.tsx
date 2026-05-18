import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { askTutor } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  topics?: string[];
  isLoading?: boolean;
}

export default function TanyaAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Halo! Aku Tutor AI Lentera. Ada yang bisa aku bantu hari ini? Kamu bisa tanya tentang materi sekolah apa saja!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock bot thinking message
    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: "bot", content: "", isLoading: true }]);

    const response = await askTutor(input);
    
    setMessages(prev => prev.map(m => m.id === botMsgId ? {
      ...m,
      content: response.jawaban,
      topics: response.saran_topik_terkait,
      isLoading: false
    } : m));
    
    setIsTyping(false);
  };

  const handleSuggest = (topic: string) => {
    setInput(`Bisa jelaskan lebih lanjut tentang ${topic}?`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">Tutor AI Lentera</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online & Siap Membantu</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Reset Percakapan"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-slate-50/30"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "bot" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
                  {msg.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl shadow-sm ${msg.role === "bot" ? "bg-white border border-slate-100 text-slate-800" : "bg-blue-600 text-white"}`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2 text-slate-400 font-medium italic py-1">
                         <Loader2 size={16} className="animate-spin text-blue-600" />
                         Sedang berpikir...
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                    )}
                  </div>
                  
                  {msg.topics && msg.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.topics.map((topic, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggest(topic)}
                          className="bg-white border border-slate-200 text-xs font-bold text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tanyakan apa saja tentang pelajaranmu..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent outline-none transition-all resize-none min-h-[56px] max-h-32 text-slate-800"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`
                absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all
                ${!input.trim() || isTyping 
                  ? "bg-slate-100 text-slate-300 pointer-events-none" 
                  : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95"}
              `}
            >
              {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400">
             <div className="flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                <span>POWERED BY GEMINI AI</span>
             </div>
             <div className="flex items-center gap-1">
                <Bot size={12} className="text-blue-400" />
                <span>TUTOR SEBAYA STYLE</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

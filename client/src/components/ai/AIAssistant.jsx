import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

const SUGGESTIONS = [
  "Where is my laptop?",
  "Book meeting room",
  "Raise maintenance",
  "Show booking history",
  "View my assets",
  "When should I return my laptop?"
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your AssetFlow AI Assistant. How can I help you manage your resources today?", time: "Just now" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);
  const { myAssets, bookings } = useStore();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = "";
      const lower = text.toLowerCase();

      if (lower.includes("laptop")) {
        const laptop = myAssets.find(a => a.name.toLowerCase().includes("laptop"));
        if (laptop) {
          if (lower.includes("return") || lower.includes("when")) {
            aiText = `Your ${laptop.name} (${laptop.code}) is assigned to you until ${laptop.expectedReturnDate}. You should return it on or before that date.`;
          } else {
            aiText = `You currently have a ${laptop.name} (${laptop.code}, ${laptop.serial}) in ${laptop.condition} condition. It was allocated to you on ${laptop.allocationDate}.`;
          }
        } else {
          aiText = "I couldn't find a laptop assigned to your account in our database.";
        }
      } else if (lower.includes("book") || lower.includes("meeting") || lower.includes("room")) {
        aiText = "To book a resource, head to the 'Resource Booking' page. You can choose from available meeting rooms, select a date and time slot, and confirm the booking immediately.";
      } else if (lower.includes("maintenance") || lower.includes("repair")) {
        aiText = "You can raise a maintenance request by visiting the 'Maintenance' page and clicking 'Raise New Request'. Or, you can click the 'Raise Maintenance' quick action in the profile dropdown or on individual asset cards.";
      } else if (lower.includes("history") || lower.includes("bookings")) {
        const activeBookings = bookings.map(b => `${b.resourceName} on ${b.date} (${b.timeStart}) [${b.status}]`).join("\n• ");
        aiText = `Here are your current bookings:\n• ${activeBookings || "No active bookings found."}`;
      } else if (lower.includes("asset")) {
        const assetsList = myAssets.map(a => `${a.name} (${a.code})`).join("\n• ");
        aiText = `You have ${myAssets.length} assigned assets:\n• ${assetsList}`;
      } else {
        aiText = "I'm sorry, I'm a specialized AssetFlow assistant. I can help you check your assigned assets, active bookings, request status, or guide you on how to raise maintenance requests and make bookings. Could you try rephrasing your request?";
      }

      const aiMsg = { sender: 'ai', text: aiText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-card/95 border border-border shadow-2xl rounded-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                    AssetFlow Assistant
                    <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-primary-foreground/75 mt-0.5 inline-block">Online • Ready to assist</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Bot size={14} className="text-primary" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className={`p-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted text-foreground rounded-tl-none border border-border/50'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-muted-foreground mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 max-w-[80%]">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-muted text-foreground rounded-2xl rounded-tl-none p-3 border border-border/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-foreground/45 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/45 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/45 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Chips */}
            <div className="px-4 py-2 bg-muted/30 border-t border-border/50 flex gap-1.5 overflow-x-auto scrollbar-hide shrink-0">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 text-xs bg-card hover:bg-accent border rounded-full whitespace-nowrap text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="p-3 border-t bg-card flex gap-2 items-center shrink-0"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask assistant something..."
                className="flex-1 h-9 rounded-lg border-border"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0 rounded-lg">
                <Send size={14} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-primary/95 transition-colors relative group"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}

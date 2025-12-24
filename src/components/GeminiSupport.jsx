import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';

export function GeminiSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your QSR AI Assistant. How can I help you manage your restaurant today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "I can help you with that! To manage inventory, go to the 'Manage Stock' section.",
                "That's a great question. You can configure updated prices in the 'Raw Materials' tab.",
                "For sales reports, check the 'Reports' section in the sidebar.",
                "I'm currently running in demo mode, but I will be fully integrated with real-time data soon!",
                "Check the closing stock page to update your daily figures."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const aiMsg = { id: Date.now() + 1, text: randomResponse, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Gemini AI Assistant</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-tl-sm shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-gray-400">Powered by Google Gemini</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

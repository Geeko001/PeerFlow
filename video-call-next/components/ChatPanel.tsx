"use client";
import React, { useState, useEffect, useRef } from "react";
import Sentiment from "sentiment";
import { Send, Download, Sparkles, Smile, Frown, Meh, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FluidButton } from "./ui/FluidButton";
import { GlassCard } from "./ui/GlassCard";

interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
}

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isOpen: boolean;
}

export default function ChatPanel({ messages, onSendMessage, isOpen }: ChatPanelProps) {
    const [inputText, setInputText] = useState("");
    const [vibe, setVibe] = useState<{ score: number; emoji: React.ReactNode }>({ score: 0, emoji: <Meh className="w-5 h-5" /> });
    const [showDownloadAnim, setShowDownloadAnim] = useState(false);
    const sentiment = useRef(new Sentiment());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputText(text);

        // Live Sentiment Analysis
        const result = sentiment.current.analyze(text);
        if (result.score > 2) setVibe({ score: result.score, emoji: <Smile className="w-5 h-5 text-green-400" /> });
        else if (result.score < -2) setVibe({ score: result.score, emoji: <Frown className="w-5 h-5 text-red-400" /> });
        else setVibe({ score: result.score, emoji: <Meh className="w-5 h-5 text-yellow-400" /> });
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText("");
        setVibe({ score: 0, emoji: <Meh className="w-5 h-5 text-yellow-400" /> });
    };

    const downloadChat = () => {
        setShowDownloadAnim(true);

        // Create text file
        const content = messages.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender}: ${m.text}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-log-${new Date().toISOString()}.txt`;
        a.click();

        setTimeout(() => setShowDownloadAnim(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Full screen download animation */}
            <AnimatePresence>
                {showDownloadAnim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="p-6 rounded-full bg-emerald-500/20 border border-emerald-500/50">
                                <Download className="w-12 h-12 text-emerald-400 animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Chat Saved!</h2>
                            <p className="text-zinc-400">Your conversation has been downloaded.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <GlassCard className="fixed right-4 bottom-24 top-24 w-80 flex flex-col p-4 shadow-2xl z-40 !backdrop-blur-3xl !bg-black/40">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        Chat
                        <span className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-full border border-white/5">
                            Vibe: {vibe.emoji}
                        </span>
                    </h3>
                    <button onClick={downloadChat} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Save Chat">
                        <Download className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-hide">
                    {messages.length === 0 && (
                        <div className="text-center text-zinc-500 text-sm mt-10">
                            No messages yet.<br />Start the conversation!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'Me'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-zinc-600 mt-1 px-1">
                                {msg.sender === 'Me' ? '' : msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="absolute right-1 top-1 p-2 bg-indigo-600 rounded-full text-white disabled:opacity-50 disabled:bg-transparent transition-all hover:scale-105"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </GlassCard>
        </>
    );
}

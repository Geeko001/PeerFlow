"use client";

import React, { useState, useEffect } from "react";

interface Message {
    text: string;
    sender: "me" | "them";
    timestamp: string;
}

export default function ChatBox({ roomId }: { roomId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            text: inputText,
            sender: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);
        // TODO: Send via signaling/data channel
        setInputText("");
    };

    return (
        <div className="flex flex-col w-full max-w-sm h-64 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Chat</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-none">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.sender === "me"
                            ? "bg-indigo-600 self-end text-white"
                            : "bg-zinc-800 self-start text-zinc-200"
                            }`}
                    >
                        <p>{msg.text}</p>
                        <span className="text-[10px] opacity-50 mt-1 block">{msg.timestamp}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-2 bg-black/20 flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 p-1.5 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

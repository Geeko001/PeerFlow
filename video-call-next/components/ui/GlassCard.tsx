"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={cn(
                "glass-panel p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

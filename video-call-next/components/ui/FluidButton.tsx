"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FluidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    href?: string;
    variant?: "primary" | "secondary";
    containerClassName?: string;
}

export function FluidButton({
    children,
    href,
    className,
    variant = "primary",
    containerClassName,
    ...props
}: FluidButtonProps) {
    const isPrimary = variant === "primary";

    const content = (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative rounded-full px-8 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden",
                isPrimary
                    ? "bg-white text-black hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
                className
            )}
        >
            {/* Shine effect for primary button */}
            {isPrimary && (
                <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            )}
            {children}
        </motion.div>
    );

    if (href) {
        return (
            <Link href={href} className={cn("block", containerClassName)}>
                {content}
            </Link>
        );
    }

    return (
        <button className={cn("block", containerClassName)} {...props}>
            {content}
        </button>
    );
}

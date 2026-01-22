"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { FluidButton } from "@/components/ui/FluidButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { Video, RefreshCw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateCall() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const generateMeetingId = () => {
    // Generate a 9-digit numeric meeting code for simplicity and reliability
    const digits = "0123456789";
    const segment = () => Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * digits.length)]).join("");
    // 3 segments of 3 digits each, concatenated to form 9 digits
    return segment() + segment() + segment();
  };

  useEffect(() => {
    setMeetingId(generateMeetingId());
  }, []);

  const handleRefreshId = () => {
    setMeetingId(generateMeetingId());
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(meetingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId) return;
    router.push(`/room?id=${meetingId}&name=${encodeURIComponent(meetingName || "Meeting")}&host=true`);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#09090b] text-white relative overflow-hidden bg-grid-white/[0.02]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="indigo" />

      <main className="z-10 w-full max-w-md p-4 animate-in fade-in zoom-in-95 duration-500">
        <GlassCard>
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Video className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                Create New Room
              </h1>
              <p className="text-zinc-400 text-sm mt-2">
                Customize your meeting details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

              {/* Meeting Name Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-medium text-zinc-400 ml-2">Meeting Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Standup"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* Meeting ID Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-medium text-zinc-400 ml-2">Meeting ID</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={meetingId}
                    readOnly
                    className="w-full rounded-full border border-white/10 bg-black/20 px-6 py-3 text-zinc-300 font-mono tracking-wider focus:outline-none cursor-default"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                      title="Copy ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleRefreshId}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                      title="Generate New ID"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 ml-2">
                  Share this ID with others to let them join.
                </p>
              </div>

              <FluidButton type="submit" className="w-full mt-2" variant="primary">
                Start Meeting
              </FluidButton>
            </form>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

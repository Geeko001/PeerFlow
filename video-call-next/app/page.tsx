import Link from "next/link";
import { Spotlight } from "@/components/ui/Spotlight";
import { FluidButton } from "@/components/ui/FluidButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, Shield, Sparkles, Video, Globe, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white flex flex-col relative overflow-hidden bg-grid-white/[0.02] antialiased selection:bg-indigo-500/30">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Navbar decoration */}
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-50" />

      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-20 z-10">

        {/* Hero Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="inline-flex gap-2 items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors cursor-default mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            WebRTC Powered High-Performance Meetings
          </div>
        </div>

        {/* Hero Content */}
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-center max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-4 animate-in fade-in zoom-in-95 duration-1000 delay-100">
          Meet without limits. <br />
          <span className="text-indigo-400 font-serif italic">Naturally.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-zinc-400 text-center max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          PeerFlow delivers ultra-low latency, secure peer-to-peer video calls directly in your browser. No downloads, no sign-ups, just pure connection.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <FluidButton href="/create-call" variant="primary">
            Create Instant Meeting
            <Video className="w-4 h-4" />
          </FluidButton>
          <FluidButton href="/join-call" variant="secondary">
            Join with Code
          </FluidButton>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
          <GlassCard delay={0.4}>
            <Zap className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-zinc-500 text-sm">
              Direct P2P connection means zero server latency. Your video travels the shortest path possible.
            </p>
          </GlassCard>

          <GlassCard delay={0.5}>
            <Shield className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">End-to-End Secure</h3>
            <p className="text-zinc-500 text-sm">
              Your calls are encrypted directly between peers. We can't see or hear your conversations.
            </p>
          </GlassCard>

          <GlassCard delay={0.6}>
            <Sparkles className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Crystal Clear</h3>
            <p className="text-zinc-500 text-sm">
              Adaptive bitrate ensures the best possible quality for your connection, up to 4K support.
            </p>
          </GlassCard>
        </div>

        {/* Stats / Social Proof (Mock) */}
        <div className="mt-24 pt-8 border-t border-white/5 w-full max-w-5xl flex flex-wrap justify-center gap-12 sm:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400 font-mono text-sm">GLOBAL EDGE NETWORK</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400 font-mono text-sm">UNLIMITED PARTICIPANTS</span>
          </div>
        </div>

      </main>

      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#09090b] text-white">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-widest animate-pulse">
            Next Generation Video Calls
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Meet without <br /> any limits.
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-lg mx-auto">
            A premium, high-performance video calling experience built with WebRTC.
            No sign-ups, no tracking, just instant connection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <Link
            href="/create-call"
            className="rounded-full bg-white text-black px-8 py-4 font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
          >
            Create a Meeting
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/join-call"
            className="rounded-full bg-white/5 border border-white/10 px-8 py-4 font-semibold hover:bg-white/10 transition-all flex items-center justify-center"
          >
            Join with Link
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
          {[
            { title: "Ultra Low Latency", desc: "Peer-to-peer WebRTC", icon: "⚡" },
            { title: "Secure & Private", desc: "E2E Encrypted signalling", icon: "🔒" },
            { title: "Glass UI", desc: "Premium aesthetic", icon: "✨" },
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-4 rounded-2xl flex flex-col items-center gap-2">
              <span className="text-2xl">{feature.icon}</span>
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-zinc-500 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

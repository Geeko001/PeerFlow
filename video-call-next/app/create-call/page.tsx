"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { GlassCard } from "@/components/ui/GlassCard";
import { FluidButton } from "@/components/ui/FluidButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { Video } from "lucide-react";

export default function CreateCall() {
  const [meetingName, setMeetingName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomId = uuidv4();
    router.push(`/room?id=${roomId}&name=${encodeURIComponent(meetingName)}`);
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
                Start an instant high-quality video call
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <input
                type="text"
                placeholder="Room Name (Optional)"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors text-center"
              />
              <FluidButton type="submit" className="w-full" variant="primary">
                Start Meeting
              </FluidButton>
            </form>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

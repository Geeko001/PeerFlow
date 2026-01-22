"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { FluidButton } from "@/components/ui/FluidButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { Link2 } from "lucide-react";

export default function JoinCall() {
    const [roomUrl, setRoomUrl] = useState("");
    const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Accept either a 9-digit numeric code, a direct URL with id=, or a direct /room/ URL
      let targetId = roomUrl;

      // If a plain 9-digit numeric code is entered, use it directly
      if (/^\d{9}$/.test(roomUrl)) {
          targetId = roomUrl;
      } else if (roomUrl.includes("id=")) {
          // Extract ID if full URL is pasted
          targetId = roomUrl.split("id=")[1].split("&")[0];
      } else if (roomUrl.includes("/room/")) {
          // Extract ID from path if the user pasted a direct /room/ID URL
          targetId = roomUrl.split("/room/")[1].split("?")[0];
      }

        if (targetId) {
            router.push(`/room?id=${targetId}`);
        } else {
            alert("Please enter a valid meeting URL or ID.");
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#09090b] text-white relative overflow-hidden bg-grid-white/[0.02]">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="gray" />

            <main className="z-10 w-full max-w-md p-4 animate-in fade-in zoom-in-95 duration-500">
                <GlassCard>
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Link2 className="w-8 h-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                                Join a Meeting
                            </h1>
                            <p className="text-zinc-400 text-sm mt-2">
                                Enter the meeting code or link below
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="e.g. 550e8400-e29b..."
                                value={roomUrl}
                                onChange={(e) => setRoomUrl(e.target.value)}
                                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-center"
                            />
                            <FluidButton type="submit" className="w-full">
                                Join Now
                            </FluidButton>
                        </form>
                    </div>
                </GlassCard>
            </main>
        </div>
    );
}

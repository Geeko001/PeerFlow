"use client";

import VideoRoom from "@/components/VideoRoom";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RoomContent() {
    const searchParams = useSearchParams();
    // Support both 'id' (new) and 'roomId' (legacy/fallback) if needed, but 'id' is standard now.
    // User asked to convert to /room?id=...
    const roomId = searchParams?.get("id");
    const meetingName = searchParams?.get("name") ?? "Meeting";

    if (!roomId) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Invalid Room</h2>
                    <p className="text-zinc-400">No meeting ID provided.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
            <header className="p-4 text-center text-2xl font-semibold bg-white/10 backdrop-blur-lg">
                {meetingName}
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <VideoRoom roomId={roomId} />
            </main>
        </div>
    );
}

export default function RoomPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">Loading meeting room...</div>}>
            <RoomContent />
        </Suspense>
    );
}

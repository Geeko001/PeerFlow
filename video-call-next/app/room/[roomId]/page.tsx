"use client";

import VideoRoom from "@/components/VideoRoom";
import { useSearchParams } from "next/navigation";

import { Suspense, use } from "react";

function RoomContent({ roomId }: { roomId: string }) {
    const searchParams = useSearchParams();
    const meetingName = searchParams?.get("name") ?? "Meeting";

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

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const resolvedParams = use(params);
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white">Loading meeting room...</div>}>
            <RoomContent roomId={resolvedParams.roomId} />
        </Suspense>
    );
}

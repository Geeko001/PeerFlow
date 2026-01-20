"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinCall() {
    const [roomUrl, setRoomUrl] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let targetId = roomUrl;

        // Extract ID if full URL is pasted
        if (roomUrl.includes("id=")) {
            targetId = roomUrl.split("id=")[1].split("&")[0];
        } else if (roomUrl.includes("/room/")) {
            targetId = roomUrl.split("/room/")[1].split("?")[0];
        }

        if (targetId) {
            router.push(`/room?id=${targetId}`);
        } else {
            alert("Please enter a valid meeting URL or ID.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg bg-white/10 p-8 backdrop-blur-lg">
                <h1 className="text-2xl font-semibold text-center">Join a Call</h1>
                <input
                    type="text"
                    placeholder="Enter meeting URL"
                    value={roomUrl}
                    onChange={(e) => setRoomUrl(e.target.value)}
                    className="rounded border border-gray-300 bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:outline-none"
                />
                <button
                    type="submit"
                    className="rounded bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500"
                >
                    Join Call
                </button>
            </form>
        </div>
    );
}

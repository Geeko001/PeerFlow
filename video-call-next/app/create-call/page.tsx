"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateCall() {
  const [meetingName, setMeetingName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomId = uuidv4();
    // Optionally store meeting name in query or state
    router.push(`/room/${roomId}?name=${encodeURIComponent(meetingName)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg bg-white/10 p-8 backdrop-blur-lg"
      >
        <h1 className="text-2xl font-semibold text-center">Create a New Call</h1>
        <input
          type="text"
          placeholder="Meeting name (optional)"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          className="rounded border border-gray-300 bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500"
        >
          Create Call
        </button>
      </form>
    </div>
  );
}

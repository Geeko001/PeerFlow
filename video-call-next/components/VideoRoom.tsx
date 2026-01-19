"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { initWebRTC, toggleAudio, toggleVideo, getLocalStream } from "@/lib/webrtc";
import DeviceSelector from "@/components/DeviceSelector";
import ChatBox from "@/components/ChatBox";

interface VideoRoomProps {
    roomId: string;
}

export default function VideoRoom({ roomId }: VideoRoomProps) {
    const router = useRouter();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);

    useEffect(() => {
        async function start() {
            try {
                const localStream = await getLocalStream();
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream;
                }
                initWebRTC(roomId, localStream, remoteVideoRef.current);
            } catch (err) {
                console.error("Failed to get local stream", err);
            }
        }
        start();
    }, [roomId]);

    const handleAudioToggle = () => {
        toggleAudio();
        setAudioEnabled(!audioEnabled);
    };

    const handleVideoToggle = () => {
        toggleVideo();
        setVideoEnabled(!videoEnabled);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl items-start animate-fade-in">
            <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="video-container relative group">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 glass-panel px-3 py-1 rounded-full text-xs font-medium">
                            You (Local)
                        </div>
                    </div>
                    <div className="video-container relative group">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 glass-panel px-3 py-1 rounded-full text-xs font-medium">
                            Remote Peer
                        </div>
                        {!remoteVideoRef.current?.srcObject && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <span className="text-zinc-500 animate-pulse">Waiting for peer...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-4 py-4 glass-panel rounded-2xl">
                    <button
                        onClick={handleAudioToggle}
                        className={`control-btn ${!audioEnabled ? "active" : ""}`}
                        title={audioEnabled ? "Mute Mic" : "Unmute Mic"}
                    >
                        {audioEnabled ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                        )}
                    </button>
                    <button
                        onClick={handleVideoToggle}
                        className={`control-btn ${!videoEnabled ? "active" : ""}`}
                        title={videoEnabled ? "Stop Video" : "Start Video"}
                    >
                        {videoEnabled ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        )}
                    </button>
                    <button onClick={() => router.push("/")} className="control-btn bg-red-600/20 text-red-500 hover:bg-red-600 border-red-500/20" title="Leave Call">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            <div className="w-full lg:w-80 flex flex-col gap-4">
                <DeviceSelector />
                <ChatBox roomId={roomId} />
            </div>
        </div>
    );
}

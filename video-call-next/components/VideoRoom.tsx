"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initPeer, getLocalStream, toggleAudio, toggleVideo, sendPeerData } from "@/lib/webrtc";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, BatteryLow, Zap, Smile, Crown, Disc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import ChatPanel from "./ChatPanel";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";

interface VideoRoomProps {
    roomId: string;
}

interface Reaction {
    id: string;
    emoji: string;
    x: number;
    y: number;
}

export default function VideoRoom({ roomId }: VideoRoomProps) {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const pannerRef = useRef<PannerNode | null>(null);
    const searchParams = useSearchParams();

    const isHost = searchParams?.get("host") === "true";

    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isLowPower, setIsLowPower] = useState(false);
    const [hasCrown, setHasCrown] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [peerStatus, setPeerStatus] = useState(isHost ? "Creating Room..." : "Connecting to Host...");
    const [messages, setMessages] = useState<{ id: string; sender: string; text: string; timestamp: number }[]>([]);

    const router = useRouter();
    const { isRecording, startRecording, stopRecording } = useMediaRecorder();
    // Skin smoothing toggle for the local user's view
    const [skinSmooth, setSkinSmooth] = useState(false);

    const addReaction = useCallback((emoji: string, isRemote = false) => {
        const id = Math.random().toString(36).substr(2, 9);
        const x = Math.random() * 80 + 10;
        setReactions(prev => [...prev, { id, emoji, x, y: 100 }]);

        if (!isRemote) {
            sendPeerData({ type: "reaction", emoji });
        }

        setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== id));
        }, 2000);
    }, []);

    // Video frame style: fixed aspect ratio framed video (1:1 by default)
    const localVideoStyle: any = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: 'scaleX(-1)',
        filter: skinSmooth ? 'blur(0.6px) brightness(1.05) saturate(1.05)' : 'none',
    };
    const remoteVideoStyle: any = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: skinSmooth ? 'blur(0.6px) brightness(1.05) saturate(1.05)' : 'none',
    };

    const handleIncomingMessage = useCallback((data: any) => {
        if (data.type === "chat") {
            setMessages(prev => [...prev, {
                id: Date.now().toString() + Math.random(),
                sender: 'Peer',
                text: data.text,
                timestamp: Date.now()
            }]);
        } else if (data.type === "reaction") {
            addReaction(data.emoji, true);
        }
    }, [addReaction]);

    useEffect(() => {
        let mounted = true;

        async function startCall() {
            try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioCtx) {
                    audioContextRef.current = new AudioCtx();
                    pannerRef.current = audioContextRef.current.createPanner();
                    pannerRef.current.panningModel = 'HRTF';
                    pannerRef.current.distanceModel = 'inverse';
                    pannerRef.current.setPosition(1, 0, 1);
                }

                const stream = await getLocalStream();
                if (localVideoRef.current && mounted) {
                    localVideoRef.current.srcObject = stream;
                }

                if (isHost) {
                    setPeerStatus("Waiting for peer to join...");
                } else {
                    setPeerStatus("Dialing host...");
                }

                initPeer(roomId, stream, isHost, (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        setPeerStatus("Connected");

                        if (audioContextRef.current && pannerRef.current) {
                            const source = audioContextRef.current.createMediaStreamSource(remoteStream);
                            source.connect(pannerRef.current).connect(audioContextRef.current.destination);
                        }
                    }
                }, handleIncomingMessage);

            } catch (error) {
                console.error("Error accessing media devices:", error);
                setPeerStatus("Error accessing camera/mic");
            }
        }

        startCall();
        return () => { mounted = false; };
    }, [roomId, isHost, handleIncomingMessage]);

    const handleToggleAudio = () => {
        toggleAudio();
        setAudioEnabled(!audioEnabled);
    };

    const handleToggleVideo = () => {
        toggleVideo();
        setVideoEnabled(!videoEnabled);
    };

    const handleEndCall = () => {
        if (isRecording) stopRecording();
        router.push("/");
    };

    const handleLowPower = () => {
        const stream = localVideoRef.current?.srcObject as MediaStream;
        if (!stream) return;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            if (!isLowPower) { videoTrack.applyConstraints({ frameRate: 15, width: 480 }); }
            else { videoTrack.applyConstraints({ frameRate: 30, width: 1280 }); }
            setIsLowPower(!isLowPower);
        }
    };

    const handleSendMessage = (text: string) => {
        const newMsg = { id: Date.now().toString(), sender: 'Me', text, timestamp: Date.now() };
        setMessages(prev => [...prev, newMsg]);
        sendPeerData({ type: "chat", text });
    };

    const handleToggleRecording = () => {
        if (isRecording) { stopRecording(); }
        else {
            const targetStream = (remoteVideoRef.current?.srcObject as MediaStream) || (localVideoRef.current?.srcObject as MediaStream);
            if (targetStream) { startRecording(targetStream); }
            else { alert("No video stream to record yet."); }
        }
    };

    return (
        <div className="relative w-full h-full max-w-6xl flex flex-col items-center gap-4">
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <AnimatePresence>
                    {reactions.map(r => (
                        <motion.div
                            key={r.id}
                            initial={{ y: "100%", opacity: 1, x: `${r.x}%` }}
                            animate={{ y: "20%", opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute bottom-0 text-5xl"
                        >
                            {r.emoji}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full h-[70vh]">
                <div className="relative flex-1 video-container bg-black group" style={{ aspectRatio: '1 / 1' }}>
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={localVideoStyle} />
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-xs font-mono">
                        You {isLowPower && "(Eco Mode)"}
                    </div>
                    {hasCrown && <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-[170%] text-6xl pointer-events-none animate-bounce">👑</div>}
                </div>

                <div className="relative flex-1 video-container bg-black" style={{ aspectRatio: '1 / 1' }}>
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" style={remoteVideoStyle} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-xl font-medium animate-pulse -z-10 text-center">
                        {peerStatus}<br />
                        <span className="text-sm opacity-50">{isHost ? "(Share ID to user)" : ""}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-xs font-mono">Remote Peer</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl glass-panel fixed bottom-8 md:relative md:bottom-auto z-50">
                <button onClick={handleToggleAudio} className={cn("control-btn", !audioEnabled && "active")} title={audioEnabled ? "Mute" : "Unmute"}>
                    {audioEnabled ? <Mic /> : <MicOff />}
                </button>
                <button onClick={handleToggleVideo} className={cn("control-btn", !videoEnabled && "active")} title={videoEnabled ? "Turn Off Video" : "Turn On Video"}>
                    {videoEnabled ? <Video /> : <VideoOff />}
                </button>
                <button onClick={handleToggleRecording} className={cn("control-btn relative", isRecording && "border-red-500 bg-red-500/10")} title="Record Call">
                    {isRecording && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
                    <Disc className={cn(isRecording && "text-red-500")} />
                </button>
                <button onClick={handleEndCall} className="control-btn bg-red-600 hover:bg-red-700 border-red-600" title="End Call">
                    <PhoneOff />
                </button>
                {/* Skin smoothing toggle (per-user effect) */}
                <button onClick={() => setSkinSmooth(!skinSmooth)} className={cn("control-btn", skinSmooth && "bg-green-600")} title="Skin Smoothing">
                    Skin
                </button>
                <div className="w-px h-8 bg-white/20 mx-2 hidden sm:block" />
                <button onClick={() => setShowChat(!showChat)} className={cn("control-btn", showChat && "bg-indigo-500 border-indigo-500")} title="Chat">
                    <MessageSquare />
                </button>
                <button onClick={handleLowPower} className={cn("control-btn", isLowPower && "bg-green-600 border-green-600")} title="Low Power Mode">
                    {isLowPower ? <BatteryLow /> : <Zap />}
                </button>
                <button onClick={() => addReaction("❤️")} className="control-btn hover:text-red-400" title="Send Love">
                    <Smile />
                </button>
                <button onClick={() => setHasCrown(!hasCrown)} className={cn("control-btn", hasCrown && "bg-amber-500/20 border-amber-500 text-amber-400")} title="Toggle Crown">
                    <Crown />
                </button>
            </div>
            <ChatPanel isOpen={showChat} messages={messages} onSendMessage={handleSendMessage} />
        </div>
    );
}

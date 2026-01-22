import Peer, { MediaConnection, DataConnection } from "peerjs";

let localStream: MediaStream | null = null;
let peer: Peer | null = null;
let currentCall: MediaConnection | null = null;
let currentConn: DataConnection | null = null;

export async function getLocalStream(): Promise<MediaStream> {
    if (localStream) return localStream;
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    return localStream;
}

export function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
        }
    }
}

export function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
        }
    }
}

export function initPeer(
    roomId: string,
    stream: MediaStream,
    isHost: boolean,
    onRemoteStream: (stream: MediaStream) => void,
    onMessage: (msg: any) => void
) {
    // Resolve signaling host/port/path from environment (Render/free hosts) or fallbacks
    const hasWindow = typeof window !== 'undefined';
    const envHost = (typeof process !== 'undefined' && (process as any).env && (process as any).env.NEXT_PUBLIC_PEERJS_HOST) || undefined;
    const envPort = (typeof process !== 'undefined' && (process as any).env && (process as any).env.NEXT_PUBLIC_PEERJS_PORT) || undefined;
    const envPath = (typeof process !== 'undefined' && (process as any).env && (process as any).env.NEXT_PUBLIC_PEERJS_PATH) || undefined;

    let host = envHost ?? (hasWindow ? (window as any).location.hostname : 'localhost');
    let port = envPort ? Number(envPort) : (hasWindow && (window as any).location.protocol === 'https:' ? 443 : 9000);
    let path = envPath ?? '/peerjs';
    let secure = hasWindow ? (window as any).location.protocol === 'https:' : false;

    // If port is not a number (undefined) fallback safely
    if (typeof port !== 'number' || Number.isNaN(port)) port = hasWindow && (window as any).location.protocol === 'https:' ? 443 : 9000;

    const peerConfig = {
        debug: 2,
        host,
        port,
        path,
        secure,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        }
    };

    peer = isHost ? new Peer(roomId, peerConfig) : new Peer(peerConfig);

    peer.on('open', (id) => {
        console.log('My Peer ID is: ' + id);
        if (!isHost) {
            console.log(`Dialing host: ${roomId}...`);
            const call = peer?.call(roomId, stream);
            if (call) setupCallEventHandlers(call, onRemoteStream);

            const conn = peer?.connect(roomId);
            if (conn) setupDataHandlers(conn, onMessage);
        }
    });

    peer.on('call', (call) => {
        console.log("Receiving call...");
        call.answer(stream);
        setupCallEventHandlers(call, onRemoteStream);
    });

    peer.on('connection', (conn) => {
        console.log("Receiving data connection...");
        setupDataHandlers(conn, onMessage);
    });

    peer.on('error', (err) => {
        console.error("PeerJS Error:", err);
        if (err.type === 'unavailable-id') {
            alert(`Room ${roomId} is likely already taken. Choose another ID.`);
        }
    });
}

function setupCallEventHandlers(call: MediaConnection, onRemoteStream: (stream: MediaStream) => void) {
    currentCall = call;
    call.on('stream', onRemoteStream);
    call.on('close', () => console.log("Call ended"));
}

function setupDataHandlers(conn: DataConnection, onMessage: (msg: any) => void) {
    currentConn = conn;
    conn.on('data', (data) => {
        console.log("Received data:", data);
        onMessage(data);
    });
    conn.on('open', () => console.log("Data connection open"));
}

export function sendPeerData(data: any) {
    if (currentConn && currentConn.open) {
        currentConn.send(data);
    } else {
        console.warn("Cannot send data: No active connection");
    }
}

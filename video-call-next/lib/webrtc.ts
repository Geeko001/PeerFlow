let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let socket: WebSocket | null = null;

const configuration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

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

export function initWebRTC(
    roomId: string,
    stream: MediaStream,
    remoteVideoElement: HTMLVideoElement | null
) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    socket = new WebSocket(`${protocol}//${host}/api/signal/${roomId}`);

    peerConnection = new RTCPeerConnection(configuration);

    // Add local tracks to peer connection
    stream.getTracks().forEach((track) => {
        peerConnection?.addTrack(track, stream);
    });

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
        if (remoteVideoElement) {
            remoteVideoElement.srcObject = event.streams[0];
        }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket?.send(
                JSON.stringify({ type: "candidate", candidate: event.candidate })
            );
        }
    };

    socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "offer") {
            await peerConnection?.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection?.createAnswer();
            await peerConnection?.setLocalDescription(answer!);
            socket?.send(JSON.stringify({ type: "answer", answer }));
        } else if (data.type === "answer") {
            await peerConnection?.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === "candidate") {
            await peerConnection?.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    };

    socket.onopen = async () => {
        // The first one to join becomes the caller
        // In a real app, you'd handle "who is the caller" more robustly
        const offer = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offer!);
        socket?.send(JSON.stringify({ type: "offer", offer }));
    };
}

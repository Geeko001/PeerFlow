import { useState, useRef, useCallback } from 'react';

export const useMediaRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback((stream: MediaStream) => {
        if (!stream) return;

        const options = { mimeType: 'video/webm; codecs=vp9' };
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `recording-${new Date().toISOString()}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
        };

        mediaRecorder.start();
        setIsRecording(true);
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    return { isRecording, startRecording, stopRecording };
};

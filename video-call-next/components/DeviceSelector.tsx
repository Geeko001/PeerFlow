"use client";

import React, { useEffect, useState } from "react";

export default function DeviceSelector() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoInput, setVideoInput] = useState("");
    const [audioInput, setAudioInput] = useState("");

    useEffect(() => {
        async function getDevices() {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            setDevices(allDevices);

            const defaultVideo = allDevices.find(d => d.kind === 'videoinput');
            const defaultAudio = allDevices.find(d => d.kind === 'audioinput');

            if (defaultVideo) setVideoInput(defaultVideo.deviceId);
            if (defaultAudio) setAudioInput(defaultAudio.deviceId);
        }
        getDevices();
    }, []);

    const handleVideoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVideoInput(e.target.value);
        // In a real app, you'd re-init the stream with the new deviceId
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAudioInput(e.target.value);
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-white/10 rounded-lg backdrop-blur-md w-full max-w-sm">
            <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Devices</h3>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Camera</label>
                <select
                    value={videoInput}
                    onChange={handleVideoChange}
                    className="bg-zinc-800 text-sm p-2 rounded border border-zinc-700 focus:outline-none"
                >
                    {devices.filter(d => d.kind === 'videoinput').map(d => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 5)}`}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Microphone</label>
                <select
                    value={audioInput}
                    onChange={handleAudioChange}
                    className="bg-zinc-800 text-sm p-2 rounded border border-zinc-700 focus:outline-none"
                >
                    {devices.filter(d => d.kind === 'audioinput').map(d => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${d.deviceId.slice(0, 5)}`}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

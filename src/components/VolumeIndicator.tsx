"use client";
import { createSoundDetector, Icon, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const VolumeIndicator = () => {
    const {useMicrophoneState} = useCallStateHooks();
    const {isEnabled, mediaStream} = useMicrophoneState();
    const [audioLevel, setAudioLevel] = useState<number>(0);

    useEffect(() => {
        if(!isEnabled || !mediaStream) return;
        const disposeAudioDetector = createSoundDetector(mediaStream,
            ({audioLevel: level}) => setAudioLevel(level),
            {detectionFrequencyInMs: 80, destroyStreamOnStop: false}
        );
        return () => {
            disposeAudioDetector().catch(console.error);
        }
    },[isEnabled , mediaStream]);

    if(!isEnabled) return null;

    return (<div className="flex w-72 items-center gap-4 rounded-md bg-slate-900 p-4"> 
    <Icon icon="mic" />
    <div className="h-1.5 flex-1 bg-white rounded-md ">
        <div
            className="h-full w-full origin-left bg-blue-500"
            style={{transform: `scaleX(${audioLevel/100})`}}
         />
    </div>
    </div>)
}
export default VolumeIndicator;
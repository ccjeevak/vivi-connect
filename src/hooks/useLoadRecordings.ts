import { useUser } from "@clerk/nextjs";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const useLoadRecordings = (call: Call) => {
    const { user } = useUser();
    const [recording, setRecording] = useState<CallRecording[]>();
    const [recordingsLoading, setRecordingsLoading] = useState<boolean>(true);
    useEffect(()=> {
        if(!user?.id) return;
        const loadRecordings = async () => {
            setRecordingsLoading(true);
            const response = await call.queryRecordings();
            setRecording(response.recordings);
            setRecordingsLoading(false);
        }
       
        loadRecordings();
    }, [call, user?.id]);
    
    return {recording, recordingsLoading};
}

export default useLoadRecordings;
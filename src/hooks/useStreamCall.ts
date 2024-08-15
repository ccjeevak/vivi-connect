import { useCall } from "@stream-io/video-react-sdk"

const useStreamCall = () => {
    const call= useCall();
    if(!call) {
        throw new Error("useStreamCall must be used inside a StreamCall component");
    }

    return call;
}

export default useStreamCall;
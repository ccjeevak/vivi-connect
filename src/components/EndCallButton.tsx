import useStreamCall from "@/hooks/useStreamCall";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

const EndCallButton = () => {
    const {useLocalParticipant} = useCallStateHooks();
    const call = useStreamCall();
    const localParitcipant = useLocalParticipant();
    const participantIsChannelOwner = localParitcipant &&
    call.state.createdBy &&
    call.state.createdBy.id === localParitcipant.userId;

    if(!participantIsChannelOwner) return null;

    return (
        <button 
        className="text-red-500 mx-auto font-medium hover:underline"
        onClick={call.endCall}>
            End call for everyone
        </button>
    )
}
export default EndCallButton;
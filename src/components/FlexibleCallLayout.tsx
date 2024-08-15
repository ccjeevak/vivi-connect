import useStreamCall from "@/hooks/useStreamCall";
import { CallControls, PaginatedGridLayout, SpeakerLayout } from "@stream-io/video-react-sdk";
import { BetweenHorizonalEnd, BetweenVerticalEnd, LayoutGrid } from "lucide-react";
import { useState } from "react";
import EndCallButton from "./EndCallButton";
import { useRouter } from "next/navigation";
 type CallLayout = "speaker-vertical" | "speaker-horizontal" | "grid";
const FlexibleCallLayout = () => {
    const call = useStreamCall();
    const [callLayout, setCallLayout] = useState<CallLayout>("speaker-vertical");
    const router = useRouter();
    return (
      <div className="space-y-6">
        <CallLayoutButtonView layout={callLayout} setLayout={setCallLayout} />
        <CallLayoutView layout={callLayout} />
        <CallControls onLeave={()=> {
            router.push(`/meeting/${call.id}/left`)
        }} />
        <EndCallButton />
      </div>
    );
}

interface CallLayoutButtonViewProps {
    layout: CallLayout,
    setLayout: (layout: CallLayout) => void
}
const CallLayoutButtonView = ({layout, setLayout}:CallLayoutButtonViewProps) => {
    return (<div className="mx-auto w-fit space-x-6">
        <button onClick={()=>setLayout("speaker-vertical")}>
            <BetweenVerticalEnd className={layout != "speaker-vertical" ? "text-gray-400" : ""} />
        </button>
        <button onClick={()=>setLayout("speaker-horizontal")}>
            <BetweenHorizonalEnd className={layout != "speaker-horizontal" ? "text-gray-400" : ""} />
        </button>
        <button onClick={()=>setLayout("grid")}>
            <LayoutGrid className={layout != "grid" ? "text-gray-400" : ""} />
        </button>
    </div>);
}
interface CallLayoutViewProps {
    layout: CallLayout
}
const CallLayoutView = ({ layout }: CallLayoutViewProps) => {
    const layoutView = {
        "speaker-vertical": <SpeakerLayout />,
        "speaker-horizontal": <SpeakerLayout participantsBarPosition="right" />,
        "grid": <PaginatedGridLayout />
    }
    return layoutView[layout] || null;
}

export default FlexibleCallLayout;
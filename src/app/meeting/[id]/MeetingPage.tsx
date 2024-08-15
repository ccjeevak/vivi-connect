"use client";
import Button, { buttonClassNames } from "@/components/Button";
import PermissionPrompt from "@/components/PremissionPrompt";
import RecordingList from "@/components/RecordingList";
import VolumeIndicator from "@/components/VolumeIndicator";
import useLoadCall from "@/hooks/useLoadCall";
import useStreamCall from "@/hooks/useStreamCall";
import { useUser } from "@clerk/nextjs";
import { Call, CallControls, CallingState, DeviceSettings, SpeakerLayout, StreamCall, StreamTheme, useCall, useCallStateHooks, useStreamVideoClient, VideoPreview } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MeetingPageProps {
    id: string
}
const MeetingPage = ({id}:MeetingPageProps) => {
    const {call, callLoading} = useLoadCall(id);
    const {user , isLoaded} = useUser();    

    if(callLoading || !isLoaded) return <Loader2 className="mx-auto animate-spin"/>
    if(!call) return <p className="text-center font-semibold"> Call not found </p>

    const notAllowedToJoin = call.type ==='private-meeting' && (!user || !call.state.members.find( m => m.user_id === user.id));

    if(notAllowedToJoin) return <p className="text-center font-semibold"> You are not allowed to join this call </p>

   
    
   return (
     <StreamCall call={call}>
       <StreamTheme>
        <MeetingScreen />
       </StreamTheme>
     </StreamCall>
   );
}

const MeetingScreen = () => {
  const {useCallStartsAt, useCallEndedAt} = useCallStateHooks();
  const call = useStreamCall();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);
  const callEnded = !!callEndedAt;
  const description = call.state.custom.description;
  
  const handleSetupComplete = () => {
    call.join();
    setIsSetupComplete(true);
  }

  if(callEnded) return <MeetingEndedScreen />
  const callInFuture = callStartsAt && new Date(callStartsAt) > new Date();
  if(callInFuture) return <UpcommingMeetingScreen />
  return (<div className="space-y-6">
    {
    description && <p className="text-center">
      Meeting description: <span className="font-bold">{description}</span>
      </p>
      }
      {isSetupComplete ? (<CallUI />) : <SetupUI  onSetupComplete={handleSetupComplete} />}
  </div>)
}


const CallUI = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if(callingState !== CallingState.JOINED) return <Loader2 className="mx-auto animate-spin"/>
  return(<div />)
}

interface SetupUIProps {
  onSetupComplete: () => void;
}
const SetupUI = ({onSetupComplete}:SetupUIProps ) => {
  const call = useStreamCall();
  const {useMicrophoneState, useCameraState} = useCallStateHooks();
  const micState = useMicrophoneState();
  const camState = useCameraState();

  const [micCamDisabled, setMicCamDisabled] = useState<boolean>(false);

  useEffect(() => {
    if(micCamDisabled) {
      call.microphone.disable();
      call.camera.disable();
    } else {
      call.microphone.enable();
      call.camera.enable();
    }
  },[call, micCamDisabled]);

  if(!camState.hasBrowserPermission || !micState.hasBrowserPermission) 
    return <PermissionPrompt />;

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center gap-3">
        <VolumeIndicator />
        <DeviceSettings />
      </div>
      <label className="font-medium flex items-center gap-2">
        <input type="checkbox" checked={micCamDisabled} onChange={(e) => setMicCamDisabled(e.target.checked)} />
        Join with mic and camera off
      </label>
      <Button onClick={onSetupComplete}>Join meeting</Button>
    </div>
  );
};

const UpcommingMeetingScreen = () => {
  const call = useStreamCall();
  return (
    <div className="flex flex-col items-center gap-6">
      {call.state.startsAt && <p>
        This meeting is not started yet. It will start at 
        <span className="font-semibold">{call.state.startsAt.toLocaleString()}</span>
      </p> }
      {call.state.custom.description && <p> Description: 
        <span className="font-semibold">{call.state.custom.description} </span>
      </p> }
      <Link href={"/"} className={buttonClassNames}>Go Home</Link>
    </div>
  )
}
const MeetingEndedScreen = () => {
  return(
    <div className="flex gap-6 flex-col items-center">
      <p className="font-bold">This meeting has ended</p>
      <Link href={"/"} className={buttonClassNames}>Go Home</Link>
      <div className="space-y-3">
        <h2 className="text-center text-xl font-bold"> Recordings </h2>
        <RecordingList />
       </div>
    </div>
  )
}
export default MeetingPage;
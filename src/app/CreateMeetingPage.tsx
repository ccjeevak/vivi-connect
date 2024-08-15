"use client"

import { useUser } from "@clerk/nextjs";
import { Call, MemberRequest, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import getUserIds from "./actions";
import Button from "@/components/Button";
import Link from "next/link";
import { Copy } from "lucide-react";

const CreateMeetingPage = () => {
    const {user} = useUser();
    const [description, setDescription] = useState<string>("");
    const [startTimeInput, setStartTimeInput] = useState<string>("");
    const [participants, setParticipants] = useState<string>("");
    const [call, setCall] = useState<Call>();

    const client = useStreamVideoClient();

    const createMeeting = async () => {
        if(!client || !user) return;
        try {
            const id = crypto.randomUUID();
            const callType = participants ? "private-meeting" : "default";

            const newCall = client.call(callType, id);

            const memberEmails = participants
              .split(",")
              .map((email) => email.trim())
              .filter((v, i, a) => a.findIndex((v2) => v2 === v) === i);

            const memberIds = await getUserIds(memberEmails);

            const members: MemberRequest[] = memberIds
              .map((memberId) => ({ user_id: memberId, role: "call_member" }))
              .concat({ user_id: user.id, role: "call_member" });
            
            const starts_at = new Date(startTimeInput || Date.now()).toISOString();

            await newCall.getOrCreate({
              data: {
                members,
                starts_at,
                custom: { description },
              },
            });

            setCall(newCall);

        } catch (error) {
            console.error("Error creating meeting", error);
            alert("Error creating meeting. Please try again later");
        }
    }

    return(
        <div className="flex flex-col items-center space-y-6">
            <h1 className="font-bold text-2xl"> Welcome {user?.username}</h1>
            <div className="w-80 rounded-md bg-slate-100 p-5 space-y-6">
                <h2 className="text-xl font-bold">Create new meeting</h2>
                <DescriptionInput onChange={setDescription} value={description} />
                <StartTimeInput value={startTimeInput}  onChange={setStartTimeInput} />
                <ParticipantsInput value={participants} onChange={setParticipants} />
                <Button className="w-full" onClick={createMeeting}>Create new meeting</Button>
            </div>
            {call && <MeetingLink call={call} /> }
        </div>
    )
}
interface DescriptionInputProps {
    value: string,
    onChange: (value: string) => void
}

const DescriptionInput = ({onChange, value}: DescriptionInputProps) => {
    const [active, setActive] = useState<boolean>(false);
    const handleDescriptionChange = (value: boolean) => {
        setActive(value);
        onChange("");
    }
    return (
      <div className="space-y-2">
        <h4 className="font-medium">Meeting info:</h4>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => handleDescriptionChange(e.target.checked)}
          />
          Add description
        </label>
        {active && (
          <label className="block space-y-1">
            <span className="font-medium">Description </span>
            <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-md border-gray-300 border p-2" maxLength={500} />
          </label>
        )}
      </div>
    );
}

interface StartTimeInputProps { 
    value: string,
    onChange: (value: string) => void
}

const StartTimeInput = ({ value, onChange }: StartTimeInputProps) => {
  const [active, setActive] = useState<boolean>(false);
  const starTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Meeting start:</h4>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={(e) => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting immediately
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(starTimeLocalNow);
          }}
        />
        Start meeting at date/time
      </label>
      {active && (
        <div className="block space-y-1">
          <h4 className="font-medium">Start time</h4>
          <input
            type="datetime-local"
            title="Choose start time"
            value={value}
            min={starTimeLocalNow}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      )}
    </div>
  );
};

interface ParticipantsInputProps {
    value: string,
    onChange: (value:string) => void
}
const ParticipantsInput = ({value, onChange}:ParticipantsInputProps) => {
    const [active, setActive] = useState<boolean>(false);
    return (
      <div className="space-y-2">
        <h4 className="font-medium">Participants:</h4>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={!active}
            onChange={() => {
              setActive(false);
              onChange("");
            }}
          />
          Everyone with link can join
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={active}
            onChange={() => setActive(true)}
          />
          Private meeting
        </label>
        {active && (
          <label className="block space-y-1">
            <span className="font-medium">Participants</span>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter email addresses separated by comma"
            />
          </label>
        )}
      </div>
    );
};

interface MeetingLinkProps {
    call: Call;
}
const MeetingLink = ({call}: MeetingLinkProps) => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`
    return (
      <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 text-center">
        <span className="font-semibold">
          Invitation link:{" "}
          <Link target="_blank" className="font-normal" href={link}>
            {link}
          </Link>
        </span>
        <button
          title="Copy meeting link"
          onClick={() => {
            navigator.clipboard.writeText(link);
            alert("Link copied to clipboard");
          }}
        >
          <Copy />
        </button>
        </div>
        <a href={getMailToLink(link, call.state.startsAt, call.state.custom.description)} className="text-blue-500 hover:underline">Send email invitation</a>
      </div>
    );
}

const getMailToLink = (link: string, startAt?: Date, description?: string ) => {
  const startDateFormatted = startAt ? new Date(startAt).toLocaleString("en-US",{
    dateStyle: "full",
    timeStyle: 'short'
  }) : undefined;

  const subject = `Join in my meeting ${startDateFormatted ? `at ${startDateFormatted}` : ''}`;

  const body = `Join my meeting at ${link}. ${startDateFormatted ? `\n\n The meeting starts at ${startDateFormatted}.` : ''} ${description ? `\n\n Description: ${description}` : ''}`;
  
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export default CreateMeetingPage;
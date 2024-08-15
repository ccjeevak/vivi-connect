"use client";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MyMeetingPage = () => {
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [callList, setCallList] = useState<Call[]>();
    useEffect(()=>{
        const loadCalls = async() => {
            const response = await client?.queryCalls({
                sort: [{field: "starts_at", direction: -1}],
                filter_conditions: {
                    starts_at: {$exists: true},
                    $or : [{ created_by_user_id: user?.id},
                        {members: {$in: [user?.id]}}
                    ]
                }
            });
            setCallList(response?.calls);
        }
        if(!client || !user?.id) return;
        loadCalls();
    },[client, user?.id]);

    return(<div className="space-y-3">
        <h1 className="text-2xl font-bold text-center">My Meetings</h1>
        {!callList && <Loader2 className="mx-auto animate-spin"/>}
        {callList?.length === 0 && <p className="text-center font-medium">No meetings found</p>}
        <ul className="list-disc list-inside space-y-2">
            {callList?.map(item => <MeetingItem key={item.id} call={item} />)}
        </ul>
         </div>);
}

const MeetingItem = ({call}: {call: Call}) => { 
    const meetingLink = `/meeting/${call.id}`;
    const isInFeature = call.state.startsAt && new Date(call.state.startsAt) > new Date();
    const hasEnded = !!call.state.endedAt;
    return (
      <li>
        <Link href={meetingLink} className="hover:underline">
          {call.state.startsAt?.toLocaleString()}
          {isInFeature && " (Upcoming)" }
          {hasEnded && " (Ended)"}
        </Link>
        <p className="text-gray-500 ml-6">{call.state.custom.dscription}</p>
      </li>
    );
}
export default MyMeetingPage;
import useLoadRecordings from "@/hooks/useLoadRecordings";
import useStreamCall from "@/hooks/useStreamCall";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const RecordingList = () => {
  const call = useStreamCall();
  const { recording, recordingsLoading } = useLoadRecordings(call);
  const { user, isLoaded } = useUser();
  if (isLoaded && !user)
    return (
      <p className="text-center font-semibold">
        {" "}
        Please login to view recordings{" "}
      </p>
    );
  if (recordingsLoading) return <Loader2 className="mx-auto animate-spin" />;
  return (
    <div className="space-y-3 text-center">
      {recording?.length === 0 && (
        <p className="text-center font-medium">No recordings found</p>
      )}
      <ul className="list-inside list-disc space-y-2">
        {recording
          ?.sort((a, b) => b.end_time.localeCompare(a.end_time))
          .map((item) => (
            <li key={item.url}>
              <Link href={item.url} target="_blank" className="hover:underline">
                {new Date(item.end_time).toLocaleString()}
              </Link>
            </li>
          ))}
      </ul>
      <p className="text-sm text-gray-500">
          Note: It can take up to 1 minute before new recordings show up.
          <br/>
          You can refresh the page to see if new recordings are available.
      </p>
    </div>
  );
};

export default RecordingList;

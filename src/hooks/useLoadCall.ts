import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const useLoadCall = (id: string) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [callLoading, setCallLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadCall = async () => {
      if (!client || !id) return;
      setCallLoading(true);
      const { calls } = await client.queryCalls({
        filter_conditions: { id },
      });
      if (calls && calls.length > 0) {
        const call = calls[0];
        await call.get();
        setCall(call);
      }
      setCallLoading(false);
    };
    loadCall();
  }, [client, id]);
  return {call, callLoading};
};

export default useLoadCall;
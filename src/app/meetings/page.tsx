import { Metadata } from "next";
import MyMeetingPage from "./MyMeetingPage";

export const metadata: Metadata = {
    title: "Meetings",
    description: "Meetings",
}
const MeetingPage = () => {
    return(<MyMeetingPage />)
}
export default MeetingPage;
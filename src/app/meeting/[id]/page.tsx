import { Metadata } from "next";
import MeetingPage from "./MeetingPage";
import { currentUser } from "@clerk/nextjs/server";
import MeetingLoginPage from "./MeetingLoginPage";

interface PageProps {
    params: {id: string}
    searchParams: {guest: boolean}
}
export function generateMetadata({params: {id}, searchParams: {guest}}: PageProps): Metadata {
    return {
        title: guest ? `Meeting ${id} - guest` : `Meeting ${id}`,
    }
}
const Page = async ({params: {id}, searchParams: {guest}}: PageProps) => {
    const user = await currentUser();
    if(!user && !guest) return  <MeetingLoginPage />
    return(<MeetingPage id={id} />)
}
export default Page;
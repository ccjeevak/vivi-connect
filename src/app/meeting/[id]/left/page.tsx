import { buttonClassNames } from "@/components/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LeftPageProps {
    params: {id: string}
}
const LeftPage = ({params: {id}}:LeftPageProps) => {
    return(<div className="flex flex-col items-center gap-3">
        <p className="font-bold">You left this meeting.</p>
        <Link href={`/meeting/${id}`} className={cn(buttonClassNames, "bg-gray-500 hover:bg-gray-600")}>Join again</Link>
    </div>);
}
export default LeftPage;
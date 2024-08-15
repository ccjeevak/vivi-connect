import Button, { buttonClassNames } from "@/components/Button";
import { cn } from "@/lib/utils";
import { ClerkLoaded, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const MeetingLoginPage = () => {
    return (
      <div className="mx-auto w-fit space-y-3">
        <h1 className="text-center text-2xl font-bold"> Join Meeting </h1>
        <ClerkLoaded>
          <SignInButton>
            <Button className="w-44">Sign in</Button>
          </SignInButton>
          <Link
            href="?guest=true"
            className={cn(
              buttonClassNames,
              "w-44 bg-gray-500 hover:bg-gray-500",
            )}
          >
            Continue as guest
          </Link>
        </ClerkLoaded>
      </div>
    );
}
export default MeetingLoginPage;
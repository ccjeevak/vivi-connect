import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavBar = () => {
  return (
    <header className="shadow">
      <div className="max-w-5xl mx-auto p-3 flex items-center justify-between font-medium">
        <Link href="/">New Meeting</Link>
        <SignedIn>
            <div className="flex items-center gap-5">
                <Link href="/meetings">Meetings</Link>
                <UserButton />
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default NavBar;

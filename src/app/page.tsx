"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
    <SignedOut>
      <SignInButton/>
    </SignedOut>
    <SignedIn>
     <SignOutButton/>
    </SignedIn>
    </>
  );
}

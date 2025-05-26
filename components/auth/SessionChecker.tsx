// components/auth/SessionChecker.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SessionChecker() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isActive === false) {
      signOut({ callbackUrl: '/login?disabled=true' });
    }
  }, [session, status, router]);

  return null; // This component doesn't render anything
}
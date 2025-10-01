// File: components/layout/Header.tsx
// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import { ShieldUser } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // If not logged in or on login/register pages, don't show header
  if (status === "loading" || 
      !session || 
      pathname === "/login" || 
      pathname === "/register") {
    return null;
  }
  
  return (
    <header className="border-b fixed w-full bg-inherit">
      <div className="w-full px-10 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold text-xl">
            LoHo Admin
          </Link>
          {/* 
          <nav className="hidden md:flex items-center gap-6">
            
            
            // Only show admin link for superadmins 
            {session.user.role === "superadmin" && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                User Management
              </Link>
            )}
          </nav>
          */}
        </div>
      
        <div className="flex items-center gap-4">
          <ShieldUser />
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </span>
          </div>
          {/*<Link href={"/profile"}> <ShieldUser /> </Link>*/}
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
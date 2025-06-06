"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { UserIcon } from "lucide-react";

interface AuthStatusProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export function AuthStatus({ user }: AuthStatusProps) {
  const { data: session } = useSession();
  const sessionUser = session?.user || user;

  if (!sessionUser) {
    return null;
  }

  const initials = sessionUser.name
    ? sessionUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : sessionUser.email?.charAt(0) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {sessionUser.image ? (
              <AvatarImage
                src={sessionUser.image}
                alt={sessionUser.name || ""}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {sessionUser.name && (
              <p className="text-sm font-medium leading-none">
                {sessionUser.name}
              </p>
            )}
            {sessionUser.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {sessionUser.email}
              </p>
            )}
            {sessionUser.role && (
              <p className="text-xs leading-none text-muted-foreground mt-1">
                Role: {sessionUser.role}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

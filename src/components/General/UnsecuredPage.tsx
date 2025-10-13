"use client";
import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export function UnsecuredPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  // Wait until session is known before rendering children
  if (status === "loading") {
    return <div>Loading....</div>;
  }

  return <>{children}</>;
}

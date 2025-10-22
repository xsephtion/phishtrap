"use client";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PhishSimulator from "../PhishingSimulator/PhishSimulatorDialog";

export function UnsecuredPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, data } = useSession();
  const [isActive, setIsActive] = useState(false);

  function disableDialog() {
    setIsActive(false);
  }

  useEffect(() => {
    console.log("isactive: ", isActive);
  }, [isActive]);

  useEffect(() => {
    if (status === "authenticated") {
      setIsActive(true);
    }
  }, [status]);

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

  return (
    <>
      <PhishSimulator
        active={isActive}
        email={data?.user?.email ?? ""}
        fakeTargetPath="/facebook"
        callback={disableDialog}
      />
      {children}
    </>
  );
}

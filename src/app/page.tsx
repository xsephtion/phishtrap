"use client";
import { DashboardLayout } from "@/components/Admin/Dashboard";
import QuizTable from "@/components/Admin/QuizTable";
import { LandingPage } from "@/components/General/LandingPage";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    <div>Loading...</div>;
  }

  // console.log("session", session);
  if (status === "unauthenticated") {
    return <LandingPage />;
  }

  if (session) {
    if (session.user?.email == "admin@mico.com") {
      return (
        <DashboardLayout>
          <QuizTable />
        </DashboardLayout>
      );
    } else {
      return (
        <DashboardLayout>
          <LandingPage />
        </DashboardLayout>
      );
    }
  }
}

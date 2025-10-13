"use client";
import { DashboardLayout } from "@/components/Admin/Dashboard";
import QuizTable from "@/components/Admin/QuizTable";
import { LandingPage } from "@/components/General/LandingPage";
import { AuthForm } from "@/components/Login";
import { useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    <div>Loading....</div>;
  }

  if (status === "unauthenticated") {
    return <AuthForm />;
  }

  if (session) {
    if (session?.user?.email === "admin@mico.com") {
      return (
        <DashboardLayout>
          <QuizTable />
        </DashboardLayout>
      );
    } else {
      return <LandingPage />;
    }
  }
}

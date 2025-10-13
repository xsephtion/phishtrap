"use client";
import { DashboardLayout } from "@/components/Admin/Dashboard";
import QuizTable from "@/components/Admin/QuizTable";
import { LandingPage } from "@/components/General/LandingPage";
import StunningAiLoader from "@/components/General/Loading";
import { AuthForm } from "@/components/Login";
import { useSession } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    <StunningAiLoader />;
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

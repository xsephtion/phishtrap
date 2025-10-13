"use client";

import { DashboardLayout } from "@/components/Admin/Dashboard";
import LeaderboardPage from "@/components/General/Leaderboard";
import { UnsecuredPage } from "@/components/General/UnsecuredPage";

export default function Simulation() {
  return (
    <UnsecuredPage>
      <DashboardLayout>
        <LeaderboardPage />
      </DashboardLayout>
    </UnsecuredPage>
  );
}

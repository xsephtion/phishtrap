"use client";

import { DashboardLayout } from "@/components/Admin/Dashboard";
import { UnsecuredPage } from "@/components/General/UnsecuredPage";
import EmailSimulator from "@/components/Quiz/Simulator";

export default function Simulation() {
  return (
    <UnsecuredPage>
      <DashboardLayout>
        <EmailSimulator />
      </DashboardLayout>
    </UnsecuredPage>
  );
}

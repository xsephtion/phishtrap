"use client";

import { DashboardLayout } from "@/components/Admin/Dashboard";
import { UnsecuredPage } from "@/components/General/UnsecuredPage";
import { PhishingQuiz } from "@/components/Quiz/View";

export default function Simulation() {
  return (
    <UnsecuredPage>
      <DashboardLayout>
        <PhishingQuiz />
      </DashboardLayout>
    </UnsecuredPage>
  );
}

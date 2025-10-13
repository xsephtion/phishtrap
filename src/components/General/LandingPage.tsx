// app/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Phishing Test",
  description: "Choose a test type: Multiple Choice or Simulation Exam",
};

const ChoiceCard: React.FC<{
  title: string;
  description: string;
  href: string;
  cta?: string;
}> = ({ title, description, href, cta = "Start" }) => {
  const { data } = useSession();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-end">
        <Link href={data?.user?.email ? href : "/login"} passHref>
          <Button
            asChild
            aria-label={`${cta} ${title}`}
            className="flex items-center gap-2"
          >
            <div>
              {cta} <ArrowRight size={16} />
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export function LandingPage() {
  return (
    <main className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
      <section className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">Phishing Test</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Choose how you'd like to test your phishing awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChoiceCard
            title="Multiple Choice"
            description="Quick, knowledge-based questions to check recognition of phishing signs."
            href="/quiz"
            cta="Take Quiz"
          />

          <ChoiceCard
            title="Simulation Exam"
            description="Hands-on simulated phishing messages — identify and respond as you would in real life."
            href="/simulation"
            cta="Run Simulation"
          />
        </div>

        {/* <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            Tip: You can add analytics or a user-check before navigation if you
            want to gate access.
          </p>
        </div> */}
      </section>
    </main>
  );
}

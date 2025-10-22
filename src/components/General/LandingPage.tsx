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
import SplitText from "@/components/ReactBits/SplitText";

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
    <Card className="w-full max-w-md ">
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
    <main className="min-h-screen bg-surface-50 flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-500">
      <section className="w-full max-w-4xl">
        <div className="mb-15 text-center">
          <SplitText
            text="Phishing Test"
            className="text-9xl font-bold text-center p-2 text-white"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="100px"
            textAlign="center"
          />
          <p className="text-sm text-muted-foreground text-white">
            Choose how you&apos;d like to test your phishing awareness.
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

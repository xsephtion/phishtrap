"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";

/**
 * EmailSimulator
 *
 * Features:
 * - Presents a sequence of simulated emails (some phishing, some real)
 * - User selects "Fake" or "Real"
 * - Immediate feedback with score summary
 * - Highlights suspicious cues (when showing answer)
 * - Persists progress & scores in localStorage
 *
 * Uses shadcn/ui components (Button, Card, RadioGroup, Badge, Tooltip).
 */

/* ----------------------------- Types & Data ----------------------------- */

type ExampleEmail = {
  id: string;
  from: string;
  displayFrom?: string;
  to: string;
  subject: string;
  date?: string;
  body: string;
  // list of suspicious cues (positions are optional; we highlight by matching substring)
  cues?: { text: string; explanation: string }[];
  isPhishing: boolean;
  explanation?: string; // overall explanation shown after answer
};

const EXAMPLES: ExampleEmail[] = [
  {
    id: "e1",
    from: "security@micros0ft.com",
    displayFrom: "Microsoft Support",
    to: "you@example.com",
    subject: "Urgent: Verify your account now",
    date: "Oct 10, 2025",
    body: "Dear user,\n\nWe have detected unusual sign-in activity. Please verify your account immediately by clicking the link below:\n\nhttps://micros0ft.com/verify\n\nFailure to verify will result in suspension.\n\nRegards,\nMicrosoft Support",
    cues: [
      {
        text: "micros0ft.com",
        explanation: "Look-alike domain using '0' instead of 'o'.",
      },
      {
        text: "verify",
        explanation:
          "Unexpected verification request — legitimate services rarely ask for credentials in email links.",
      },
    ],
    isPhishing: true,
    explanation:
      "This is a phishing attempt: the sender domain is a lookalike (micros0ft.com) and there's an urgent call to action to click a link. Do not click links; verify via official site or contact support directly.",
  },
  {
    id: "e2",
    from: "billing@stripe.com",
    displayFrom: "Stripe Billing",
    to: "you@example.com",
    subject: "Your receipt from Stripe",
    date: "Oct 8, 2025",
    body: "Hello,\n\nThanks for your payment of $29.99. Attached is your receipt.\n\nTransaction ID: ch_1HJlx0...\n\nNeed help? Visit https://stripe.com/docs or contact support.\n\nBest,\nStripe",
    cues: [
      {
        text: "stripe.com/docs",
        explanation: "Legitimate domain reference and no urgent action.",
      },
    ],
    isPhishing: false,
    explanation:
      "Legitimate receipt-like email. Contains no urgent credential requests and the domain matches the brand.",
  },
  {
    id: "e3",
    from: "it-support@company.example",
    displayFrom: "IT Support",
    to: "you@example.com",
    subject: "Password Reset Required",
    date: "Oct 9, 2025",
    body: "Hi,\n\nDue to routine maintenance we require all staff to reset their passwords. Please follow this link to complete the reset:\n\nhttps://company.example.reset-now.com\n\nThanks,\nIT Team",
    cues: [
      {
        text: "company.example.reset-now.com",
        explanation:
          "Subdomain trick: attacker created a malicious domain that contains the real name but isn't the real company domain.",
      },
      {
        text: "reset-now.com",
        explanation:
          "The root domain is suspicious — verify via internal IT channels.",
      },
    ],
    isPhishing: true,
    explanation:
      "Phishing: looks like management/IT but the link points to a different root domain. Always verify password reset requests through your internal portal or helpdesk.",
  },
  {
    id: "e4",
    from: "no-reply@linkedin.com",
    displayFrom: "LinkedIn",
    to: "you@example.com",
    subject: "Someone viewed your profile",
    date: "Oct 1, 2025",
    body: "Hi,\n\nSomeone viewed your profile: John Doe\n\nSee who viewed you: https://www.linkedin.com/notifications/view\n\nRegards,\nLinkedIn",
    cues: [
      {
        text: "linkedin.com/notifications",
        explanation: "Legitimate-looking domain and non-urgent content.",
      },
    ],
    isPhishing: false,
    explanation:
      "Legitimate notification — non-urgent and uses the correct LinkedIn domain.",
  },
  {
    id: "e5",
    from: "support@apple.com",
    displayFrom: "Apple Support",
    to: "you@example.com",
    subject: "Your Apple ID has been locked",
    date: "Oct 11, 2025",
    body: "Dear Customer,\n\nYour Apple ID (you@example.com) has been locked for security reasons. Click here to unlock: https://appleid.apple.support-unlock.com\n\nSincerely,\nApple Support",
    cues: [
      {
        text: "support-unlock.com",
        explanation: "Non-official domain that tries to sound official.",
      },
      {
        text: "Your Apple ID has been locked",
        explanation: "Urgent account lock message — common phishing tactic.",
      },
    ],
    isPhishing: true,
    explanation:
      "Phishing: malicious domain and urgent account lock tactic. Official Apple emails link to apple.com/appleid or appleid.apple.com — verify via official site.",
  },
  {
    id: "e6",
    from: "hr@company.example",
    displayFrom: "HR Department",
    to: "you@example.com",
    subject: "Benefits enrollment — open enrollment closes soon",
    date: "Sep 25, 2025",
    body: "Dear Employee,\n\nOpen enrollment for benefits begins Nov 1. Please visit the internal HR portal to review options.\n\nPortal: https://intranet.company.example/hr/benefits\n\nRegards,\nHR",
    cues: [
      {
        text: "intranet.company.example",
        explanation: "Internal portal link with expected internal domain.",
      },
    ],
    isPhishing: false,
    explanation:
      "Legitimate internal HR message linking to the company intranet.",
  },
  {
    id: "e7",
    from: "accounts-payable@vendor-payments.com",
    displayFrom: "Vendor Payments",
    to: "you@example.com",
    subject: "Invoice overdue — immediate payment required",
    date: "Oct 6, 2025",
    body: "Hi,\n\nYour invoice #99321 is overdue. Pay now: https://vendor-payments.com/pay?inv=99321\n\nBank details attached.",
    cues: [
      {
        text: "immediate payment",
        explanation: "Pressure to pay right away — often used in BEC/phishing.",
      },
      {
        text: "vendor-payments.com",
        explanation:
          "Check if this matches the expected vendor domain; it may be spoofed.",
      },
    ],
    isPhishing: true,
    explanation:
      "Potential phishing / BEC: unexpected urgent payment requests are a major risk. Verify invoice numbers and vendor accounts via known contact details before paying.",
  },
  {
    id: "e8",
    from: "security-alerts@github.com",
    displayFrom: "GitHub Security",
    to: "you@example.com",
    subject: "New device signed into your account",
    date: "Oct 3, 2025",
    body: "We noticed a sign-in to your GitHub account from a new device. If this was you, no action needed. If not, please visit https://github.com/settings/security to review your sessions.",
    cues: [
      {
        text: "github.com/settings/security",
        explanation:
          "Legitimate domain and only informational/optional action.",
      },
    ],
    isPhishing: false,
    explanation:
      "Legitimate security notification from GitHub — no immediate credential request in the email body.",
  },
];

/* ----------------------------- Helpers ----------------------------- */

const LS_PROGRESS_KEY = "email-sim-progress-v1";
const LS_SCORE_KEY = "email-sim-score-v1";

/** Load preserved progress from localStorage */
function loadProgress(): { index?: number; answers?: Record<string, boolean> } {
  try {
    const raw = localStorage.getItem(LS_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** Load score object: { correct: number, totalAttempts: number } */
function loadScore(): { correct: number; attempts: number } {
  try {
    const raw = localStorage.getItem(LS_SCORE_KEY);
    if (!raw) return { correct: 0, attempts: 0 };
    return JSON.parse(raw);
  } catch {
    return { correct: 0, attempts: 0 };
  }
}

function saveProgress(index: number, answers: Record<string, boolean>) {
  try {
    localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify({ index, answers }));
  } catch {}
}

function saveScore(correct: number, attempts: number) {
  try {
    localStorage.setItem(LS_SCORE_KEY, JSON.stringify({ correct, attempts }));
  } catch {}
}

/* ----------------------------- Component ----------------------------- */

export function EmailSimulator() {
  const examples = useMemo(() => EXAMPLES, []);
  const exampleCount = examples.length;

  // Hydrated client state
  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<{ correct: number; attempts: number }>(
    () => loadScore()
  );
  const [selected, setSelected] = useState<"phishing" | "legit" | undefined>(
    undefined
  );
  const [revealed, setRevealed] = useState<boolean>(false); // whether we've revealed the answer for current email
  const [showAllExplanations, setShowAllExplanations] =
    useState<boolean>(false);

  // on mount, try to load progress
  useEffect(() => {
    try {
      const p = loadProgress();
      if (typeof p.index === "number") setIndex(p.index);
      if (p.answers) setAnswers(p.answers);
    } catch {
      /* ignore */
    }
  }, []);

  // persist progress when index or answers change
  useEffect(() => {
    saveProgress(index, answers);
  }, [index, answers]);

  // persist score when score changes
  useEffect(() => {
    saveScore(score.correct, score.attempts);
  }, [score]);

  const current = examples[index];

  function handleGuess(choice: "phishing" | "legit") {
    if (!current) return;
    // if already revealed for this item, allow re-guess? We'll ignore repeated attempts.
    if (answers[current.id] !== undefined) {
      // already answered this example; allow moving on
      setSelected(choice);
      setRevealed(true);
      return;
    }

    const guessedIsPhishing = choice === "phishing";
    const correct = guessedIsPhishing === current.isPhishing;

    // record answer
    setAnswers((prev) => ({ ...prev, [current.id]: correct }));
    // update score
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      attempts: s.attempts + 1,
    }));
    setSelected(choice);
    setRevealed(true);
  }

  function goNext() {
    setShowAllExplanations(false);
    setSelected(undefined);
    setRevealed(false);
    setIndex((i) => Math.min(i + 1, exampleCount - 1));
  }

  function goPrev() {
    setShowAllExplanations(false);
    setSelected(undefined);
    setRevealed(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function resetProgress() {
    setIndex(0);
    setAnswers({});
    setScore({ correct: 0, attempts: 0 });
    setSelected(undefined);
    setRevealed(false);
    try {
      localStorage.removeItem(LS_PROGRESS_KEY);
      localStorage.removeItem(LS_SCORE_KEY);
    } catch {}
  }

  // UI helpers: highlight body by wrapping cue occurrences with spans
  function renderBodyWithHighlights(body: string, cues?: ExampleEmail["cues"]) {
    if (!cues || cues.length === 0) {
      return <pre className="whitespace-pre-wrap text-sm">{body}</pre>;
    }

    // We'll do a naive approach: split by first matching cue occurrences and wrap them.
    // For simplicity, find all cue substrings and mark them (case-insensitive).
    let html = body;
    // Escape special markup - but since we'll render JSX elements, do splitting instead.

    // We'll build an array of parts using a simple loop that finds earliest next cue.
    type Part = { text: string; cue?: { text: string; explanation: string } };
    const parts: Part[] = [];

    let remaining = body;
    while (remaining.length > 0) {
      let earliestIndex = -1;
      let foundCue: NonNullable<ExampleEmail["cues"]>[number] | undefined;
      let foundPos = -1;

      // find earliest cue occurrence (case-insensitive)
      for (const cue of cues) {
        const pos = remaining.toLowerCase().indexOf(cue.text.toLowerCase());
        if (pos !== -1 && (earliestIndex === -1 || pos < earliestIndex)) {
          earliestIndex = pos;
          foundCue = cue;
          foundPos = pos;
        }
      }

      if (foundCue && earliestIndex !== -1) {
        // text before
        if (earliestIndex > 0) {
          parts.push({ text: remaining.slice(0, earliestIndex) });
        }
        // the cue text
        parts.push({
          text: remaining.slice(foundPos, foundPos + foundCue.text.length),
          cue: foundCue,
        });
        // advance remaining
        remaining = remaining.slice(foundPos + foundCue.text.length);
      } else {
        // no more cues
        parts.push({ text: remaining });
        break;
      }
    }

    return (
      <pre className="whitespace-pre-wrap text-sm">
        {parts.map((p, i) =>
          p.cue ? (
            <span
              key={i}
              className={
                "rounded px-1 " +
                (revealed
                  ? "bg-yellow-100 text-yellow-900 font-medium"
                  : "bg-yellow-50 text-yellow-800")
              }
              title={p.cue.explanation}
            >
              {p.text}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </pre>
    );
  }

  // Score summary
  const percent =
    score.attempts === 0
      ? 0
      : Math.round((score.correct / score.attempts) * 100);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Email Simulation — Fake vs Real</h1>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary">
            Progress: {index + 1}/{exampleCount}
          </Badge>
          <Badge variant="outline">
            Score: {score.correct} / {Math.max(1, score.attempts)} ({percent}%)
          </Badge>
          <Button size="sm" variant="ghost" onClick={resetProgress}>
            Reset
          </Button>
        </div>
      </header>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {current.displayFrom ?? current.from}
                </div>
                <div className="text-xs text-muted-foreground">
                  — {current.to}
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {current.date}
                </div>
              </div>

              <h2 className="mt-3 text-lg font-semibold">{current.subject}</h2>

              <Separator className="my-3" />

              <div className="mb-4">
                {renderBodyWithHighlights(current.body, current.cues)}
              </div>

              <div className="mt-2">
                <RadioGroup
                  value={selected ? selected : undefined}
                  onValueChange={(v) => setSelected(v as "phishing" | "legit")}
                  className="flex gap-3"
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="phishing" id="r-phish" />
                    <span>Fake / Phishing</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="legit" id="r-legit" />
                    <span>Real / Legitimate</span>
                  </label>
                </RadioGroup>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button
                  onClick={() => {
                    if (selected) handleGuess(selected);
                  }}
                  disabled={!selected}
                >
                  Submit
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    // reveal without answering; does not count toward score
                    setRevealed(true);
                    setShowAllExplanations(true);
                  }}
                >
                  Reveal Answer
                </Button>

                <div className="ml-auto text-sm text-muted-foreground">
                  {answers[current.id] !== undefined && (
                    <span>
                      {answers[current.id] ? (
                        <span className="text-green-600 font-medium">
                          You answered correctly
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Your answer was incorrect
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <aside className="w-48 pl-4 hidden md:block">
              <div className="text-sm font-medium mb-2">Quick facts</div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground">From</div>
                  <div className="text-sm">{current.from}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">To</div>
                  <div className="text-sm">{current.to}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="text-sm">
                    {current.isPhishing
                      ? "Suspicious / Phishing"
                      : "Legitimate"}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Cues</div>
                  <div className="flex flex-col gap-1">
                    {current.cues?.map((c, i) => (
                      <Tooltip key={i}>
                        <div className="text-xs px-2 py-1 rounded bg-slate-50 text-slate-700">
                          {c.text}
                        </div>
                      </Tooltip>
                    )) ?? (
                      <div className="text-xs text-muted-foreground">
                        No cues listed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={goPrev} disabled={index === 0}>
              Back
            </Button>
            <Button
              variant="ghost"
              onClick={goNext}
              disabled={index === exampleCount - 1}
            >
              Next
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIndex(0);
                setShowAllExplanations(true);
                setRevealed(true);
              }}
            >
              Review All (reveal)
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {score.attempts === 0
                ? "No attempts yet"
                : `Correct: ${score.correct} / ${score.attempts} (${percent}%)`}
            </div>
            <Button
              size="sm"
              onClick={() => {
                /* optional: export progress or show modal */
              }}
            >
              Export
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Explanation / Result area */}
      <div className="mt-4">
        {(revealed ||
          answers[current.id] !== undefined ||
          showAllExplanations) && (
          <Card>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Result</h3>
                    <div>
                      {current.isPhishing ? (
                        <Badge variant="destructive">Phishing</Badge>
                      ) : (
                        <Badge variant="secondary">Legitimate</Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <strong>Explanation:</strong>
                    <p className="mt-2 text-sm">{current.explanation}</p>
                  </div>

                  <div className="mt-4">
                    <strong>Detailed cues:</strong>
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                      {current.cues && current.cues.length > 0 ? (
                        current.cues.map((c, i) => (
                          <li key={i}>
                            <span className="font-medium">{c.text}</span> —{" "}
                            {c.explanation}
                          </li>
                        ))
                      ) : (
                        <li>No suspicious cues listed for this email.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="w-48 text-right">
                  <div className="text-sm text-muted-foreground mb-2">
                    Your answer
                  </div>
                  <div>
                    {answers[current.id] !== undefined ? (
                      answers[current.id] ? (
                        <div className="text-green-700 font-semibold">
                          Correct
                        </div>
                      ) : (
                        <div className="text-red-700 font-semibold">
                          Incorrect
                        </div>
                      )
                    ) : (
                      <div className="text-muted-foreground">
                        No answer recorded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAllExplanations(!showAllExplanations);
                }}
              >
                {showAllExplanations
                  ? "Hide Explanations"
                  : "Show Explanations"}
              </Button>
              <Button
                onClick={() => {
                  // Move to next after viewing explanation
                  if (index < exampleCount - 1) {
                    goNext();
                  } else {
                    // reached end — optionally reset or stay
                    setIndex(exampleCount - 1);
                  }
                }}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default EmailSimulator;

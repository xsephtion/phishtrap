// components/PhishSimulator.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";

/**
 * Props:
 * - active: boolean — start the simulation when true
 * - userId?: string — optional identifier to send to the result API (no PII)
 * - minDelayMs, maxDelayMs: range for random delay
 * - message: string
 * - fakeTargetPath: internal route to redirect to
 */
export default function PhishSimulator({
  active,
  email,
  minDelayMs = 2000,
  maxDelayMs = 8000,
  message = "Your account may be compromised. Click here to secure it.",
  fakeTargetPath = "/fake-login",
  callback,
}: {
  active: boolean;
  email?: string;
  minDelayMs?: number;
  maxDelayMs?: number;
  message?: string;
  fakeTargetPath?: string;
  callback?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    // choose a random delay
    const delay =
      Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;

    timerRef.current = window.setTimeout(() => setOpen(true), delay);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, minDelayMs, maxDelayMs]);

  function handleProceed() {
    setOpen(false);
    // navigate to internal fake page (no external URL)
    router.push(fakeTargetPath);
    callback?.();
  }

  function handleDismiss() {
    setOpen(false);
    callback?.();
    // Optionally record that user ignored the alert:
    fetch("/api/trap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, ignored: true }),
    })
      .then(() =>
        toast.success(
          "You avoided phishing by ignoring the security compromise"
        )
      )
      .catch(() => {});
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Security Alert</DialogTitle>
        </DialogHeader>
        <Toaster richColors />
        <p className="mb-4">{message}</p>

        <DialogFooter className="flex gap-2">
          <Button variant="secondary" onClick={handleDismiss}>
            Dismiss
          </Button>
          <Button onClick={handleProceed}>Secure account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

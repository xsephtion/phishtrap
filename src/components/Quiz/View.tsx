"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generatePhishingQuiz } from "./questions";

type Question = {
  id: string;
  prompt: string;
  choices: string[];
  correctChoiceIndex: number;
};

interface QuizProps {
  totalQuestions?: number;
  onComplete?: (answers: Record<string, number>) => void;
}

// --- Component ---
export function PhishingQuiz({ totalQuestions = 10, onComplete }: QuizProps) {
  const [questions] = useState<Question[]>(
    generatePhishingQuiz(totalQuestions)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQ = questions[currentIndex];

  function selectChoice(choiceIndex: number) {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choiceIndex,
    }));
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete?.(answers);
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function skip() {
    goNext();
  }

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <h2 className="text-lg font-semibold">{currentQ.prompt}</h2>

        <RadioGroup
          value={
            answers[currentQ.id] !== undefined
              ? String(answers[currentQ.id])
              : undefined
          }
          onValueChange={(val) => selectChoice(Number(val))}
          className="space-y-2"
        >
          {currentQ.choices.map((choice, ci) => (
            <div key={ci} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(ci)}
                id={`q-${currentQ.id}-${ci}`}
              />
              <label
                htmlFor={`q-${currentQ.id}-${ci}`}
                className="cursor-pointer"
              >
                {choice}
              </label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between space-x-2">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentIndex === 0}
        >
          Back
        </Button>
        <Button variant="secondary" onClick={skip}>
          Skip
        </Button>
        <Button onClick={goNext}>
          {currentIndex === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generatePhishingQuiz } from "./questions";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";
import axios from "axios";

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

export function PhishingQuiz({ totalQuestions = 10 }: QuizProps) {
  const { data } = useSession();

  const [questions, setQuestions] = useState<Question[]>(
    generatePhishingQuiz(totalQuestions)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scored, setScored] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);

  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ.id];

  function selectChoice(choiceIndex: number) {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choiceIndex,
    }));
  }

  function updateScoreForCurrentQuestion(answer: number | undefined) {
    const correctAnswer = currentQ.correctChoiceIndex;
    const wasScored = scored[currentQ.id] || false;
    const isCorrect = answer === correctAnswer;

    if (isCorrect && !wasScored) {
      setScore((s) => s + 1);
      setScored((prev) => ({ ...prev, [currentQ.id]: true }));
    } else if (!isCorrect && wasScored) {
      setScore((s) => s - 1);
      setScored((prev) => ({ ...prev, [currentQ.id]: false }));
    }
    // No change if already correctly/incorrectly scored and answer hasn't changed
  }

  function goNext() {
    updateScoreForCurrentQuestion(selectedAnswer);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onEnd();
    }
  }

  // function goBack() {
  //   setCurrentIndex((i) => Math.max(i - 1, 0));
  // }

  function skip() {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: -1,
    }));
    updateScoreForCurrentQuestion(-1); // skipped = wrong
    goNext();
  }

  function reset() {
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setScored({});
    setQuestions(generatePhishingQuiz(totalQuestions));
  }

  async function onEnd() {
    updateScoreForCurrentQuestion(selectedAnswer);

    const userData = {
      email: data?.user?.email,
      quiz: {
        quizType: "choices",
        score: score,
        date: new Date().toISOString(),
      },
    };

    try {
      await axios.post("/api/quiz/submit", userData);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      reset();
    }
  }

  return (
    <Card className="max-w-lg mx-auto mt-8">
      
      <CardContent className="space-y-4">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Discerning Phishing Emails</h1>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
            <Badge variant="outline">
              Score: {score} / {questions.length}
            </Badge>
            <Button size="sm" variant="ghost" onClick={reset}>
              Reset
            </Button>
          </div>
        </header>

        <div className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <h2 className="text-lg font-semibold">{currentQ.prompt}</h2>

        <RadioGroup
          value={
            selectedAnswer !== undefined ? String(selectedAnswer) : undefined
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
        {/* <Button
          variant="outline"
          onClick={goBack}
          disabled={currentIndex === 0}
        >
          Back
        </Button> */}
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

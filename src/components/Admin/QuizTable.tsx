"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import axios from "axios";
import { BoxIcon } from "lucide-react";

type QuizType = "simulation" | "choices";

interface QuizDetails {
  email: string;
  quizType: string;
  score: string;
}

export default function QuizTable() {
  const [simulationData, setSimulationData] = useState<QuizDetails[]>([]);
  const [choicesData, setChoicesData] = useState<QuizDetails[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const [simulationRes, choicesRes] = await Promise.all([
        axios.get("/api/quiz/view", { params: { simulation: true } }),
        axios.get("/api/quiz/view", { params: { simulation: false } }),
      ]);
      console.log("simulationRes: ", simulationRes);
      setSimulationData(
        simulationRes.data.result.quiz.length
          ? simulationRes.data.result.quiz
          : [simulationRes.data.result.quiz]
      );

      setChoicesData(
        choicesRes?.data?.result?.quiz?.length
          ? choicesRes.data.result.quiz
          : [choicesRes.data.result.quiz]
      );
    } catch (error) {
      console.error("Failed to fetch quiz data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = (data: QuizDetails[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Scores</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data
          .sort((a, b) => parseInt(b.score) - parseInt(a.score))
          .map((user, idx) => (
            <TableRow key={idx}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.score && user.email ? (
                  <span
                    key={`score-${idx}`}
                    className="inline-block mr-2 px-2 py-1 bg-muted rounded"
                  >
                    {user.score}
                  </span>
                ) : (
                  "No Score"
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );

  if (loading) return <div>Loading quiz data...</div>;

  return (
    <Tabs defaultValue="simulation" className="w-full">
      <TabsList>
        <TabsTrigger value="simulation">Simulation</TabsTrigger>
        <TabsTrigger value="choices">Choices</TabsTrigger>
      </TabsList>

      <TabsContent value="simulation">
        <h2 className="text-lg font-semibold mb-4">Simulation Quiz Scores</h2>
        {simulationData.length <= 0 ? (
          <EmptyTable />
        ) : (
          renderTable(simulationData)
        )}
      </TabsContent>

      <TabsContent value="choices">
        <h2 className="text-lg font-semibold mb-4">Choices Quiz Scores</h2>
        {choicesData.length <= 0 ? <EmptyTable /> : renderTable(choicesData)}
      </TabsContent>
    </Tabs>
  );
}

function EmptyTable() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BoxIcon />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent>
        <Button>Add data</Button>
      </EmptyContent> */}
    </Empty>
  );
}

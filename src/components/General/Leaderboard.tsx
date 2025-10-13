// app/leaderboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

// Example data structure
interface LeaderboardEntry {
  name: string;
  score: number;
  testType: "Multiple Choice" | "Simulation Exam";
  date: Date;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    name: "Alice Johnson",
    score: 95,
    testType: "Multiple Choice",
    date: new Date("2025-10-10"),
  },
  {
    name: "Bob Smith",
    score: 92,
    testType: "Simulation Exam",
    date: new Date("2025-10-11"),
  },
  {
    name: "Charlie Brown",
    score: 89,
    testType: "Multiple Choice",
    date: new Date("2025-10-12"),
  },
  {
    name: "Diana Prince",
    score: 87,
    testType: "Simulation Exam",
    date: new Date("2025-10-13"),
  },
  {
    name: "Evan Wright",
    score: 85,
    testType: "Multiple Choice",
    date: new Date("2025-10-14"),
  },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen py-10 px-4 md:px-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData
                  .sort((a, b) => b.score - a.score)
                  .map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.score}</TableCell>
                      <TableCell>{entry.testType}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {format(entry.date, "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
}

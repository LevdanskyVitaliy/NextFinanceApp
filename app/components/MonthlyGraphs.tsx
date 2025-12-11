"use client";
import { useMemo, useState } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MonthlyDiagramCard() {
  const { transactions } = useTransactions();

 
  // const monthlyData = useMemo(() => {

  //   const map: Record<string, { income: number; expense: number }> = {};

  //   transactions.forEach((t) => {
  //     const date = new Date(t.date);
  //     const monthKey = date.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "numeric",
  //     });

  //     if (!map[monthKey]) {
  //       map[monthKey] = { income: 0, expense: 0 };
  //     }

  //     if (t.type === "income") {
  //       map[monthKey].income += t.amount;
  //     } else if (t.type === "expense" || t.type === "expence") {
  //       map[monthKey].expense += t.amount;
  //     }
  //   });

  //   // await refreshData();

  //   return Object.entries(map).map(([month, values]) => ({
  //     month,
  //     income: Number(values.income.toFixed(2)),
  //     expense: Number(values.expense.toFixed(2)),
  //   }));

   
  // }, [transactions, refreshData]);

  // Slider state
  
  
  const monthlyData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
  
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
      });
  
      if (!map[monthKey]) {
        map[monthKey] = { income: 0, expense: 0 };
      }
  
      if (t.type === "income" || t.type === "income") {
        map[monthKey].income += t.amount;
      } else if (t.type === "expense" || t.type === "expence") {
        map[monthKey].expense += t.amount;
      }
    });
  
    return Object.entries(map).map(([month, values]) => ({
      month,
      income: Number(values.income.toFixed(2)),
      expense: Number(values.expense.toFixed(2)),
    }));
  }, [transactions]);

  const windowSize = 3; 
  const [startIndex, setStartIndex] = useState(0);


  const endIndex = startIndex + windowSize;
  const visibleData = monthlyData.slice(startIndex, endIndex);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, monthlyData.length - windowSize)
    );
  };

  const tooltipFormatter = (value: number, name: string) =>
    [`${value.toFixed(2)}`, name];

  return (
    <Card className="w-full h-full bg-muted/90 p-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">
          Monthly Transactions
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            ◀
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={endIndex >= monthlyData.length}
          >
            ▶
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-full ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visibleData} >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="income" fill="#16a34a" name="Income" color="bg-muted/90" />
            <Bar dataKey="expense" fill="#dc2626" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

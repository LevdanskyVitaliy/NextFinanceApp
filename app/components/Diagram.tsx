"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTransactions } from "../contexts/TransactionContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORY_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm">
          Amount: <strong>{data.value.toFixed(2)} BYN</strong>
        </p>
        <p className="text-sm">
          Percentage: <strong>{data.percentage.toFixed(1)}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function CircularDiagram() {
  const [diagramType, setDiagramType] = useState<"expense" | "income">(
    "expense"
  );
  const { transactions, categories } = useTransactions();

  const categoryData = useMemo<CategoryData[]>(() => {
    const filteredTransactions = transactions.filter((t) =>
      diagramType === "expense"
        ? t.type === "expense" || t.type === "expence"
        : t.type === "income"
    );

    const categoryMap = new Map<string, number>();

    filteredTransactions.forEach((transaction) => {
      const categoryId = transaction.category;
      const category = categories.find((c) => c.id === categoryId);
      const categoryName = category?.name || "Uncategorized";
      const amount = Math.abs(transaction.amount);

      categoryMap.set(
        categoryName,
        (categoryMap.get(categoryName) || 0) + amount
      );
    });

    const total = Array.from(categoryMap.values()).reduce(
      (sum, value) => sum + value,
      0
    );

    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories, diagramType]);

  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="overflow-hidden w-full h-full max-w-none border rounded-lg border-gray-300 dark:border-gray-600 shadow-md shadow-gray-500 dark:shadow-gray-800 bg-[#f5f6fb] dark:bg-[#0c1017] sm:p-3 p-1 pt-1  pt-2 sm:pt-3">
      <CardHeader className="flex md:flex-row flex-col items-center justify-between px-5 gap-2">
        <CardTitle className="text-md md:text-lg font-semibold flex items-center gap-2">
          {diagramType === "expense"
            ? "Expenses by Category"
            : "Income by Category"}
        </CardTitle>

        <Tabs
          value={diagramType}
          onValueChange={(value) =>
            setDiagramType(value as "expense" | "income")
          }
        >
          <TabsList className="h-7 pt-8 sm:pt-2 flex flex-col gap-2  sm:flex-row sm:items-center">
            <TabsTrigger value="expense" className="text-sm h-8 px-4">
              <TrendingDown className="h-4 w-4 mr-1" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="income" className="text-sm h-8 px-4">
              <TrendingUp className="h-4 w-4 mr-1" />
              Income
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="h-[450px]">
        {categoryData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center justify-between h-full lg:mb-0 mb-35">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="90%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-1/2 space-y-2 md:space-y-4">
              <div className="text-center lg:text-left">
                <div className="text-md sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {totalAmount.toFixed(2)} BYN
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Total {diagramType}
                </div>
              </div>
              <div className="space-y-2 max-h-60 sm:max-h-40 overflow-y-auto">
                {categoryData.map((category, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 gap-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium border-b border-white overflow-auto max-w-25 ">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {category.value.toFixed(2)} BYN
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center lg:text-left text-sm text-gray-600 dark:text-gray-400">
                <strong>{categoryData.length}</strong> categories •{" "}
                <strong>
                  {
                    transactions.filter((t) =>
                      diagramType === "expense"
                        ? t.type === "expense" || t.type === "expence"
                        : t.type === "income"
                    ).length
                  }
                </strong>{" "}
                transactions
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-base md:text-lg">
            No {diagramType} data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

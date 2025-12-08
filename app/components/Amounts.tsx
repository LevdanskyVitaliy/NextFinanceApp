"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTransactions } from "../contexts/TransactionContext";

export default function AmountsTable() {
  const { transactions } = useTransactions();

  function getCategoryType() {
    const expenses = transactions.filter(
      (t) => t.type === "expense" || t.type === "expence"
    );
    const incomes = transactions.filter((t) => t.type === "income");

    const expenseSum = expenses.reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0
    );
    const incomeSum = incomes.reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0
    );

    const totalAmount = incomeSum - expenseSum;

    return {
      expenseTotal: expenseSum,
      incomeTotal: incomeSum,
      total: totalAmount,
    };
  }

  const totals = getCategoryType();

  const incomeTransactions = transactions.filter(
    (t) => t.type === "income"
  ).length;
  const expenseTransactions = transactions.filter(
    (t) => t.type === "expense" || t.type === "expence"
  ).length;

  return (
    <div className=" overflow-y-auto max-h-[700px]">
      <div className="grid grid-cols-1 md:grid-row-3 gap-4 md:gap-8 ">
        <Card className="min-w-40 max-w-3xs bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 opacity-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              +{totals.incomeTotal.toFixed(1)} BYN
            </div>
            <p className="text-xs text-green-600 dark:text-green-300">
              From {expenseTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-40 max-w-3xs bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800  opacity-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              -{totals.expenseTotal.toFixed(1)} BYN
            </div>
            <p className="text-xs text-red-600 dark:text-red-300">
              From {incomeTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-40  bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800  opacity-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Net Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totals.total >= 0
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {totals.total.toFixed(1)} BYN
            </div>
            <p className="text-xs md:text-lg text-blue-600 dark:text-blue-300">
              {totals.total >= 0 ? "Positive" : "Negative"} balance
            </p>
          </CardContent>
        </Card>
      </div>
      <div></div>
    </div>
  );
}

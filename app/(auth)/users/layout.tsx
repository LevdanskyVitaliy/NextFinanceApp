"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useTransactions } from "@/app/contexts/TransactionContext";

export default function TransactionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { transactions, categories, loading } = useTransactions();

  const getCategoryName = (categoryId: string | number): string => {
    if (!categoryId || !categories.length) return "Uncategorized";

    const category = categories.find(
      (cat) =>
        cat.id == categoryId ||
        String(cat.id) === String(categoryId) ||
        Number(cat.id) === Number(categoryId)
    );
    return category?.name || "Uncategorized";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <div className="flex gap-30">
            <div className="lg:w-80 shrink-0 ml-4">
              <div className="sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">
                  Latest Transactions
                </h2>
                <div className="space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
                  {[...Array(5)].map((_, i) => (
                    <Card
                      key={i}
                      className="p-4 border shadow-md bg-[#f5f6fb] dark:bg-[#0c1017] border-gray-300 dark:border-gray-600"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                          </div>
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <main className="mt-11">
              <div className="justify-center items-center">{children}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="flex gap-30">
          <div className="lg:w-80 shrink-0 ml-4">
            <div className="sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Latest Transactions
              </h2>
              <div className="space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
                {transactions.length === 0 ? (
                  <Card className="p-4 text-center">
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </Card>
                ) : (
                  transactions.map((transaction) => (
                    <Card
                      key={transaction.id}
                      className="hover:bg-accent dark:hover:bg-accent transition-colors duration-200 border shadow-md bg-[#f5f6fb] dark:bg-[#0c1017] border-gray-300 dark:border-gray-600"
                    >
                      <CardContent className="p-4">
                        <Link
                          href={`/users/${transaction.id}`}
                          className="block hover:no-underline group"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-foreground group-hover:text-primary">
                                #{transaction.id}
                              </h3>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {getCategoryName(transaction.category)}
                              </span>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              <p className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {formatDate(transaction.date)}
                              </p>
                            </div>

                            {transaction.amount && (
                              <span
                                className={
                                  transaction.type === "expense" ||
                                  transaction.type === "expence"
                                    ? "text-red-600 opacity-90"
                                    : "text-green-600 opacity-90"
                                }
                              >
                                {transaction.type === "expense" ||
                                transaction.type === "expence"
                                  ? "-"
                                  : "+"}
                                {Math.abs(transaction.amount).toFixed(2)} BYN
                              </span>
                            )}

                            {transaction.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {transaction.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          <main className="mt-11">
            <div className="justify-center items-center">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransactions } from "../contexts/TransactionContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Search } from "lucide-react";
import { SortOptions } from "../services/logic";
import MiniSearch from "minisearch";

export default function TransactionsTable() {
  const {
    categories,
    tableData,
    fetchTableData,
    deleteTransaction,
    currentTableOptions,
  } = useTransactions();

  const router = useRouter();
  const [searchIndex, setSearchIndex] = useState<MiniSearch<any> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize MiniSearch index when transactions load
  useEffect(() => {
    if (tableData.transactions.length > 0) {
      const documents = tableData.transactions.map((transaction) => ({
        id: transaction.id,
        date: new Date(transaction.date).toLocaleDateString("ru-RU"),
        description: transaction.description.toLowerCase(),
        _transaction: transaction
      }));

      const index = new MiniSearch({
        fields: ["date", "description"],
        storeFields: ["date", "description", "_transaction"],
        searchOptions: {
          prefix: true,
          fuzzy: 0.3
        }
      });

      index.addAll(documents);
      setSearchIndex(index);
    }
  }, [tableData.transactions]);

  // Filter transactions based on search
  const filteredTransactions = useMemo(() => {
    if (!searchIndex || !searchQuery.trim()) {
      return tableData.transactions;
    }

    const results = searchIndex.search(searchQuery, { 
      prefix: true, 
      fuzzy: 0.2 
    });
    
    return results.map((result: any) => result._transaction);
  }, [searchIndex, searchQuery, tableData.transactions]);

  const updateTable = useCallback(async (options: any) => {
    await fetchTableData({
      page: options.page || currentTableOptions.page,
      limit: options.limit || currentTableOptions.limit,
      sort: options.sort || currentTableOptions.sort,
      filters: options.filters !== undefined ? options.filters : currentTableOptions.filters,
    });
  }, [fetchTableData, currentTableOptions]);

  const handleSort = (field: string) => {
    let direction: "desc" | "asc" | null = "desc";
    if (currentTableOptions.sort?.field === field) {
      if (currentTableOptions.sort.direction === "desc") direction = "asc";
      else if (currentTableOptions.sort.direction === "asc") direction = null;
      else direction = "asc";
    }
    updateTable({ 
      page: 1, 
      sort: { field: direction ? field : null, direction } 
    });
  };

  const getCategoryName = (id: string | number): string => {
    if (!categories.length) {
      return "Unknown";
    }

    let category = categories.find((cat) => cat.id == id);

    if (!category) {
      category = categories.find((cat) => String(cat.id) === String(id));
    }

    if (!category) {
      const numId = Number(id);
      if (!isNaN(numId)) {
        category = categories.find((cat) => Number(cat.id) === numId);
      }
    }

    if (!category) {
      return "Unknown";
    }

    return category.name;
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить операцию?")) return;
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const updateFilters = (newFilters: {
    category?: string;
    type?: string;
    description?: string;
  }) => {
    updateTable({ page: 1, filters: newFilters });
  };

  const goToPage = (newPage: number) => {
    updateTable({ page: newPage });
  };

  const setPageSize = (newSize: number) => {
    updateTable({ page: 1, limit: newSize });
  };

  return (
    <div className="max-h-[600px] overflow-scroll max-w-md lg:max-w-3xl md:max-w-2xl sm:max-w-xl  bg-[#f5f6fb] dark:bg-[#0c1017] py-0 p-5 md:ml-5  rounded-lg border border-gray-300 dark:border-gray-600 shadow-md shadow-gray-500 dark:shadow-gray-800 no-scrollbar">
      <div className="sticky top-0 z-20 flex items-center justify-between py-4 px-1 bg-[#f5f6fb] dark:bg-[#0c1017]">
        <span className="sm:flex items-start justify-between text-md sm:text-lg lg:text-xl hidden  font-bold">
          Transactions
        </span>
        <div className="flex items-center  gap-3 ">
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              value={currentTableOptions.filters?.type || ""}
              onChange={(e) =>
                updateFilters({ 
                  ...currentTableOptions.filters, 
                  type: e.target.value
                })
              }
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-xs md:text-sm"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={currentTableOptions.filters?.category || ""}
              onChange={(e) =>
                updateFilters({ 
                  ...currentTableOptions.filters, 
                  category: e.target.value 
                })
              }
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-xs md:text-sm w-30 md:w-40"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* MiniSearch Input */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search date/description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded pl-8 pr-3 py-1 text-xs md:text-sm w-24 md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 text-sm">
              Show:
            </label>
            <select
              id="pageSize"
              value={currentTableOptions.limit}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-xs md:text-sm"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Table className="max-w-md sm:max-w-lg md:max-w-xl">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer md:text-md sm:text-sm text-xs font-semibold"
              onClick={() => handleSort("date")}
            >
              Date{" "}
              {currentTableOptions.sort?.field === "date"
                ? currentTableOptions.sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </TableHead>
            <TableHead className="md:text-md sm:text-sm text-xs font-semibold">Category</TableHead>
            <TableHead className="md:text-md sm:text-sm text-xs font-semibold">Description</TableHead>
            <TableHead className="md:text-md sm:text-sm text-xs font-semibold">Type</TableHead>
            <TableHead
              className="text-left sm:text-center cursor-pointer md:text-md sm:text-sm text-xs font-semibold"
              onClick={() => handleSort("amount")}
            >
              Sum{" "}
              {currentTableOptions.sort?.field === "amount"
                ? currentTableOptions.sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </TableHead>
            <TableHead className="md:text-md sm:text-sm text-xs font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {searchQuery ? "No transactions match search" : "No operations found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions.map((op) => (
              <TableRow
                key={op.id}
                className="group hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer gap-0"
                onClick={() => router.push(`/users/${op.id}`)}
              >
                <TableCell className="text-left text-xs sm:text-sm md:text-md min-w-15 max-w-20 sm:min-w-20 sm:max-w-25 md:min-w-25 md:max-w-30">
                  {new Date(op.date).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell className="truncate text-xs sm:text-sm md:text-md min-w-15 max-w-20 sm:min-w-20 sm:max-w-25 md:min-w-25 md:max-w-30">{getCategoryName(op.category)}</TableCell>
                <TableCell className="truncate text-xs sm:text-sm md:text-md min-w-20 max-w-25 sm:min-w-25 sm:max-w-30 md:min-w-30 md:max-w-40">
                  {op.description}
                </TableCell>
                <TableCell className="md:text-md sm:text-sm text-xs font-semibold">
                  {op.type === "expense" || op.type === "expence"
                    ? "Expence"
                    : "Income"}
                </TableCell>
                <TableCell className="text-left text-xs sm:text-sm md:text-md min-w-20 max-w-25 sm:min-w-25 sm:max-w-30 md:min-w-30 md:max-w-35">
                  <span
                    className={
                      op.type === "expense" || op.type === "expence"
                        ? "text-red-600 opacity-90"
                        : "text-green-600 opacity-90"
                    }
                  >
                    {op.type === "expense" || op.type === "expence" ? "-" : "+"}
                    {Math.abs(op.amount).toFixed(2)} BYN
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center md:gap-2 sm:gap-1 gap-0.5">
                    <Link href={`/users/${op.id}/edit`} passHref>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Редактировать"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Удалить"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(op.id as number);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition"
                      disabled={tableData.loading}
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="sticky bottom-0 z-2 flex items-center justify-between mt-4 pt-2 pb-4 px-1 bg-[#f5f6fb] dark:bg-[#0c1017]">
        <div className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {tableData.totalItems}{" "}
          transactions
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={currentTableOptions.page === 1 || tableData.loading}
            onClick={() => goToPage(currentTableOptions.page - 1)}
            size="sm"
          >
            Prev
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from(
              { length: Math.min(tableData.totalPages, 5) },
              (_, i) => {
                let pageNum = i + 1;
                if (tableData.totalPages > 5) {
                  const startPage = Math.max(1, currentTableOptions.page - 2);
                  pageNum = startPage + i;
                  if (pageNum > tableData.totalPages) return null;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentTableOptions.page === pageNum ? "default" : "outline"}
                    onClick={() => goToPage(pageNum)}
                    className="hover:bg-gray-300 dark:hover:bg-gray-900 min-w-[40px]"
                    disabled={tableData.loading}
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}
          </div>
          <Button
            disabled={
              currentTableOptions.page === tableData.totalPages ||
              tableData.totalPages === 0 ||
              tableData.loading
            }
            onClick={() =>
              goToPage(currentTableOptions.page + 1)
            }
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

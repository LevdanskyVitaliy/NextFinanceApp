"use client";

import { useEffect, useState } from "react";
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
import { Edit, Trash } from "lucide-react";
import { SortOptions } from "../services/logic";

export default function TransactionsTable() {
  const {
    categories,
    tableData,
    fetchTableData,
    deleteTransaction,
    currentTableOptions,
  } = useTransactions();

  const [page, setPage] = useState(currentTableOptions.page);
  const [pageSize, setPageSize] = useState(currentTableOptions.limit);
  const [sort, setSort] = useState<SortOptions>(
    currentTableOptions.sort || { field: "date", direction: "desc" }
  );
  const [filters, setFilters] = useState<{
    category?: string;
    type?: string;
    description?: string;
  }>(currentTableOptions.filters || {});

  const router = useRouter();

  useEffect(() => {
    setPage(currentTableOptions.page);
    setPageSize(currentTableOptions.limit);
    setSort(currentTableOptions.sort || { field: "date", direction: "desc" });
    setFilters(currentTableOptions.filters || {});
  }, [currentTableOptions]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTableData({
          page,
          limit: pageSize,
          sort: sort.field ? sort : undefined,
          filters: Object.keys(filters).length > 0 ? filters : undefined,
        });
      } catch (error) {
        console.error("Error loading table data:", error);
      }
    };

    loadData();
  }, [page, pageSize, sort, filters]);

  const handleSort = (field: string) => {
    let direction: "desc" | "asc" | null = "desc";
    if (sort.field === field) {
      if (sort.direction === "desc") direction = "asc";
      else if (sort.direction === "asc") direction = null;
      else direction = "asc";
    }
    setSort({ field: direction ? field : null, direction });
    setPage(1);
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
    setFilters(newFilters);
    setPage(1);
  };

  useEffect(() => {
    if (tableData.transactions.length === 0 && page > 1 && !tableData.loading) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  }, [tableData.transactions.length, page, tableData.loading]);

  return (
    <div className="max-h-[600px] overflow-scroll max-w-2xl lg:max-w-3xl bg-[#f5f6fb] dark:bg-[#0c1017] pt-0 p-5 pb-0 mt-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-md shadow-gray-500 dark:shadow-gray-800 no-scrollbar">
      <div className="sticky top-0 z-2 flex items-center justify-between pt-4 pb-4 bg-[#f5f6fb] dark:bg-[#0c1017]">
        <span className="flex items-start justify-between text-lg sm:text-xl font-bold">
          Transactions
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              value={filters.type || ""}
              onChange={(e) =>
                updateFilters({ ...filters, type: e.target.value })
              }
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-sm"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.category || ""}
              onChange={(e) =>
                updateFilters({ ...filters, category: e.target.value })
              }
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-sm w-30 md:w-40"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search description"
              value={filters.description || ""}
              onChange={(e) =>
                updateFilters({ ...filters, description: e.target.value })
              }
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-sm w-20 md:w-35"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 text-sm">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900 rounded p-1 text-sm"
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

      <Table className="max-w-md md:max-w-xl">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date{" "}
              {sort.field === "date"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead
              className="text-center cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              Sum{" "}
              {sort.field === "amount"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : tableData.transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No operations found
              </TableCell>
            </TableRow>
          ) : (
            tableData.transactions.map((op) => (
              <TableRow
                key={op.id}
                className="group hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer"
                onClick={() => router.push(`/users/${op.id}`)}
                //   <Link href={`/users/${op.id}/edit`} passHref>
              >
                <TableCell>
                  {new Date(op.date).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>{getCategoryName(op.category)}</TableCell>
                <TableCell className="overflow-scroll min-w-30 max-w-45">
                  {op.description}
                </TableCell>
                <TableCell>
                  {op.type === "expense" || op.type === "expence"
                    ? "Расход"
                    : "Доход"}
                </TableCell>
                <TableCell className="text-right md:min-w-30 min-w-15 md:max-w-40 max-w-25 overflow-scroll">
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
                  <div className="flex items-center gap-2">
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

      <div className="sticky bottom-0 z-200 flex items-center justify-between mt-4 pt-2 pb-4 bg-[#f5f6fb] dark:bg-[#0c1017]">
        <div className="text-sm text-gray-600">
          Showing {tableData.transactions.length} of {tableData.totalItems}{" "}
          transactions
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={page === 1 || tableData.loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  const startPage = Math.max(1, page - 2);
                  pageNum = startPage + i;
                  if (pageNum > tableData.totalPages) return null;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
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
              page === tableData.totalPages ||
              tableData.totalPages === 0 ||
              tableData.loading
            }
            onClick={() =>
              setPage((p) => Math.min(tableData.totalPages, p + 1))
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

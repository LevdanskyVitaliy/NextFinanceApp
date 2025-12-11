"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import Api from "../services/logic";
import { Transaction, Category, SortOptions } from "../services/logic";

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;

  tableData: {
    transactions: Transaction[];
    totalPages: number;
    totalItems: number;
    loading: boolean;
  };
  fetchTableData: (options: {
    page: number;
    limit: number;
    sort?: SortOptions;
    filters?: { category?: string; type?: string; description?: string };
  }) => Promise<void>;

  deleteTransaction: (id: number) => Promise<void>;
  currentTableOptions: {
    page: number;
    limit: number;
    sort?: SortOptions;
    filters?: { category?: string; type?: string; description?: string };
  };
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

const api = new Api();

const STORAGE_KEYS = {
  TABLE_OPTIONS: "transactions_table_options",
};

const DEFAULT_OPTIONS = {
  page: 1,
  limit: 10,
  sort: { field: "date", direction: "desc" } as SortOptions,
  filters: {} as { category?: string; type?: string; description?: string },
};

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [tableTransactions, setTableTransactions] = useState<Transaction[]>([]);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const [tableTotalItems, setTableTotalItems] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  const [currentTableOptions, setCurrentTableOptions] = useState<{
    page: number;
    limit: number;
    sort?: SortOptions;
    filters?: { category?: string; type?: string; description?: string };
  }>(DEFAULT_OPTIONS);

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const loadSavedOptions = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.TABLE_OPTIONS);
        if (saved) {
          const parsed = JSON.parse(saved);

          if (parsed && typeof parsed === "object") {
            return {
              page: Number(parsed.page) || DEFAULT_OPTIONS.page,
              limit: Number(parsed.limit) || DEFAULT_OPTIONS.limit,
              sort: parsed.sort || DEFAULT_OPTIONS.sort,
              filters: parsed.filters || DEFAULT_OPTIONS.filters,
            };
          }
        }
      } catch (error) {
        console.error("Error loading saved table options:", error);
      }
      return DEFAULT_OPTIONS;
    };

    const savedOptions = loadSavedOptions();
    setCurrentTableOptions(savedOptions);
    setInitialLoadDone(true);
  }, []);

  useEffect(() => {
    if (initialLoadDone) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.TABLE_OPTIONS,
          JSON.stringify(currentTableOptions)
        );
      } catch (error) {
        console.error("Error saving table options:", error);
      }
    }
  }, [currentTableOptions, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) {
      fetchTableData(currentTableOptions);
      fetchAllData();
    }
  }, [initialLoadDone]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [transactionsResult, categoriesResult] = await Promise.all([
        api.getTransactions({
          page: 1,
          sort: { field: "date", direction: "desc" },
        }),
        api.getAllCategories(),
      ]);

      setTransactions(transactionsResult.data || []);

      if (Array.isArray(categoriesResult)) {
        setCategories(categoriesResult);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = useCallback(
    async (options: {
      page: number;
      limit: number;
      sort?: SortOptions;
      filters?: { category?: string; type?: string; description?: string };
    }) => {
      setTableLoading(true);
      try {
        const result = await api.getTransactions({
          page: options.page,
          limit: options.limit,
          sort: options.sort?.field
            ? {
                field: options.sort.field,
                direction: options.sort.direction || "desc",
              }
            : { field: "date", direction: "desc" },
          filters: options.filters,
        });
        
        console.log("getTransactions result:", result);

        setTableTransactions(result.data || []);
        setTableTotalPages(result.pages || 1);
        setTableTotalItems(result.items || 0);

        setCurrentTableOptions((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(options)) {
            return prev;
          }
          return options;
        });
      } catch (error) {
        console.error("Error fetching table data:", error);
        setTableTransactions([]);
        setTableTotalPages(1);
        setTableTotalItems(0);
      } finally {
        setTableLoading(false);
     
      }
    },
    []
  );

  const refreshData = async () => {

    await fetchAllData();
    await fetchTableData(currentTableOptions);
  };

  const addTransaction = async (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    await fetchAllData();
    await fetchTableData(currentTableOptions);
  };

  const deleteTransaction = async (id: number) => {
    try {
      await api.deleteTransaction(id);

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setTableTransactions((prev) => prev.filter((t) => t.id !== id));
      setTableTotalItems((prev) => Math.max(0, prev - 1));

      if (tableTransactions.length === 1 && currentTableOptions.page > 1) {
        const newPage = currentTableOptions.page - 1;
        const newOptions = { ...currentTableOptions, page: newPage };
        
        fetchTableData(newOptions);
        fetchAllData();
       

      } else {
       fetchAllData();
        fetchTableData(currentTableOptions);
        // refreshData();
      }

     
    } catch (error) {
      console.error("Error deleting transaction:", error);
      fetchTableData(currentTableOptions);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        loading,
        refreshData,
        addTransaction,

        tableData: {
          transactions: tableTransactions,
          totalPages: tableTotalPages,
          totalItems: tableTotalItems,
          loading: tableLoading,
        },
        fetchTableData,
        deleteTransaction,
        currentTableOptions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
}

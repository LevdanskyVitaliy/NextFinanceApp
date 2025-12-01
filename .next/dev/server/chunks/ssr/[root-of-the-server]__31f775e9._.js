module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/my-app/app/services/logic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
class Api {
    #baseURL = "http://localhost:3000";
    #categoriesCache = null;
    async #fetch(path, options) {
        const response = await fetch(this.#baseURL + path, options);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        return await response.json();
    }
    getAllCategories = async ()=>{
        if (!this.#categoriesCache) {
            const categories = await this.#fetch("/categories");
            this.#categoriesCache = Array.isArray(categories) ? categories : [];
        }
        return this.#categoriesCache;
    };
    createTransaction = (transaction)=>{
        // Should the cache always be cleared? Review if necessary
        this.#categoriesCache = null;
        return this.#fetch("/transactions", {
            method: "POST",
            body: JSON.stringify(transaction)
        });
    };
    deleteTransaction = (id)=>this.#fetch(`/transactions/${id}`, {
            method: "DELETE"
        });
    updateTransaction = (id, updates)=>this.#fetch(`/transactions/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
    // NEW: Add method to get single transaction
    getTransactionById = async (id)=>{
        const response = await fetch(`${this.#baseURL}/transactions/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Transaction with id ${id} not found`);
            }
            const text = await response.text();
            throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        return await response.json();
    };
    async getTransactions(params = {}) {
        const { page = 1, limit = 10, filters = {}, sort = {
            field: '',
            direction: 'desc'
        } } = params;
        const query = new URLSearchParams({
            _page: page.toString(),
            _per_page: limit.toString(),
            ...filters
        });
        if (sort.field) {
            query.set("_sort", sort.direction === "desc" ? `-${sort.field}` : sort.field);
        }
        const result = await this.#fetch(`/transactions?${query.toString()}`);
        return {
            ...result,
            currentPage: page
        };
    }
}
const __TURBOPACK__default__export__ = Api;
}),
"[project]/my-app/app/contexts/TransactionContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client"
// import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
// import Api from "../services/logic"
// import { Transaction, Category, SortOptions } from '../services/logic'
// interface TransactionContextType {
//   // For dashboard components (AmountsTable, CircularDiagram)
//   transactions: Transaction[]
//   categories: Category[]
//   loading: boolean
//   refreshData: () => Promise<void>
//   addTransaction: (transaction: Transaction) => void
//   // For TransactionsTable with server-side pagination
//   tableData: {
//     transactions: Transaction[]
//     totalPages: number
//     totalItems: number
//     loading: boolean
//   }
//   fetchTableData: (options: {
//     page: number
//     limit: number
//     sort?: SortOptions
//     filters?: { category?: string; type?: string; description?: string }
//   }) => Promise<void>
//   deleteTransaction: (id: number) => Promise<void>
// }
// const TransactionContext = createContext<TransactionContextType | undefined>(undefined)
// const api = new Api()
// export function TransactionProvider({ children }: { children: ReactNode }) {
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(false)
//   const [tableTransactions, setTableTransactions] = useState<Transaction[]>([])
//   const [tableTotalPages, setTableTotalPages] = useState(1)
//   const [tableTotalItems, setTableTotalItems] = useState(0)
//   const [tableLoading, setTableLoading] = useState(false)
//   // Store current table options for refetching
//   const [currentTableOptions, setCurrentTableOptions] = useState<{
//     page: number
//     limit: number
//     sort?: SortOptions
//     filters?: { category?: string; type?: string; description?: string }
//   }>({
//     page: 1,
//     limit: 10,
//     sort: { field: 'date', direction: 'desc' }
//   })
//   const fetchAllData = async () => {
//     setLoading(true)
//     try {
//       const [transactionsResult, categoriesResult] = await Promise.all([
//         api.getTransactions({
//           page: 1, 
//           limit: 10000,
//           sort: { field: 'date', direction: 'desc' }
//         }),
//         api.getAllCategories()
//       ])
//       setTransactions(transactionsResult.data || [])
//       if (Array.isArray(categoriesResult)) {
//         setCategories(categoriesResult)
//       } else {
//         setCategories([])
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }
//   const fetchTableData = useCallback(async (options: {
//     page: number
//     limit: number
//     sort?: SortOptions
//     filters?: { category?: string; type?: string; description?: string }
//   }) => {
//     setTableLoading(true)
//     try {
//       const result = await api.getTransactions({
//         page: options.page,
//         limit: options.limit,
//         sort: options.sort?.field ? { 
//           field: options.sort.field, 
//           direction: options.sort.direction || "desc" 
//         } : { field: 'date', direction: 'desc' }, 
//         filters: options.filters,
//       })
//       setTableTransactions(result.data || [])
//       setTableTotalPages(result.pages || 1)
//       setTableTotalItems(result.items || 0)
//       setCurrentTableOptions(options)
//     } catch (error) {
//       console.error('Error fetching table data:', error)
//       setTableTransactions([])
//       setTableTotalPages(1)
//       setTableTotalItems(0)
//     } finally {
//       setTableLoading(false)
//     }
//   }, [])
//   const refreshData = useCallback(async () => {
//     await fetchAllData()
//   }, [])
//   const addTransaction = useCallback((transaction: Transaction) => {
//     setTransactions(prev => [transaction, ...prev])
//     // Refresh table data to include the new transaction
//     fetchTableData(currentTableOptions)
//   }, [fetchTableData, currentTableOptions]) 
//   const deleteTransaction = useCallback(async (id: number) => {
//     try {
//       await api.deleteTransaction(id)
//       setTransactions(prev => prev.filter(t => t.id !== id))
//       setTableTransactions(prev => prev.filter(t => t.id !== id))
//       setTableTotalItems(prev => Math.max(0, prev - 1))
//       if (tableTransactions.length === 1 && currentTableOptions.page > 1) {
//         const newPage = currentTableOptions.page - 1
//         setCurrentTableOptions(prev => ({ ...prev, page: newPage }))
//         fetchTableData({ ...currentTableOptions, page: newPage })
//       } else {
//         fetchTableData(currentTableOptions)
//       }
//     } catch (error) {
//       console.error('Error deleting transaction:', error)
//       fetchTableData(currentTableOptions)
//       throw error
//     }
//   }, [currentTableOptions, tableTransactions.length])
//   useEffect(() => {
//     fetchAllData()
//   }, [])
//   return (
//     <TransactionContext.Provider value={{
//       transactions,
//       categories,
//       loading,
//       refreshData,
//       addTransaction,
//       tableData: {
//         transactions: tableTransactions,
//         totalPages: tableTotalPages,
//         totalItems: tableTotalItems,
//         loading: tableLoading
//       },
//       fetchTableData,
//       deleteTransaction
//     }}>
//       {children}
//     </TransactionContext.Provider>
//   )
// }
// export function useTransactions() {
//   const context = useContext(TransactionContext)
//   if (context === undefined) {
//     throw new Error('useTransactions must be used within a TransactionProvider')
//   }
//   return context
// }
// "use client"
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useCallback,
// } from "react"
// import Api, { Transaction, Category, SortOptions } from "../services/logic"
// interface TransactionContextType {
//   transactions: Transaction[]
//   categories: Category[]
//   loading: boolean
//   refreshData: () => Promise<void>
//   addTransaction: (transaction: Transaction) => void
//   tableData: {
//     transactions: Transaction[]
//     totalPages: number
//     totalItems: number
//     loading: boolean
//   }
//   fetchTableData: (options: {
//     page: number
//     limit: number
//     sort?: SortOptions
//     filters?: { category?: string; type?: string; description?: string }
//   }) => Promise<void>
//   deleteTransaction: (id: number) => Promise<void>
// }
// const TransactionContext = createContext<TransactionContextType | undefined>(
//   undefined
// )
// const api = new Api()
// export function TransactionProvider({ children }: { children: ReactNode }) {
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(false)
//   const [tableTransactions, setTableTransactions] = useState<Transaction[]>([])
//   const [tableTotalPages, setTableTotalPages] = useState(1)
//   const [tableTotalItems, setTableTotalItems] = useState(0)
//   const [tableLoading, setTableLoading] = useState(false)
//   const [currentTableOptions, setCurrentTableOptions] = useState<{
//     page: number
//     limit: number
//     sort?: SortOptions
//     filters?: { category?: string; type?: string; description?: string }
//   }>({
//     page: 1,
//     limit: 10,
//     sort: { field: "date", direction: "desc" },
//   })
//   const fetchAllData = async () => {
//     setLoading(true)
//     try {
//       const [transactionsResult, categoriesResult] = await Promise.all([
//         api.getTransactions({
//           page: 1,
//           limit: 10000,
//           sort: { field: "date", direction: "desc" },
//         }),
//         api.getAllCategories(),
//       ])
//       setTransactions(Array.isArray(transactionsResult) ? transactionsResult : [])
//       if (Array.isArray(categoriesResult)) {
//         setCategories(categoriesResult)
//       } else {
//         setCategories([])
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }
//   const fetchTableData = useCallback(
//     async (options: {
//       page: number
//       limit: number
//       sort?: SortOptions
//       filters?: { category?: string; type?: string; description?: string }
//     }) => {
//       setTableLoading(true)
//       try {
//         // Your Api returns Transaction | object structure, assume it returns an array for data here
//         // So adapt if Api returns metadata as well - adjust for your API response shape
//         const result: any = await api.getTransactions({
//           page: options.page,
//           limit: options.limit,
//           sort: options.sort?.field
//             ? {
//                 field: options.sort.field,
//                 direction: options.sort.direction ?? "desc",
//               }
//             : { field: "date", direction: "desc" },
//           filters: options.filters || {},
//         })
//         // Assuming result is an array (simple fetch)
//         const data = Array.isArray(result) ? result : []
//         // Total pages/items unavailable from your current API, fallback
//         setTableTransactions(data)
//         setTableTotalPages(1) // You may modify if API returns page count
//         setTableTotalItems(data.length)
//         setCurrentTableOptions(options)
//       } catch (error) {
//         console.error("Error fetching table data:", error)
//         setTableTransactions([])
//         setTableTotalPages(1)
//         setTableTotalItems(0)
//       } finally {
//         setTableLoading(false)
//       }
//     },
//     []
//   )
//   const refreshData = useCallback(async () => {
//     await fetchAllData()
//   }, [])
//   const addTransaction = useCallback(
//     (transaction: Transaction) => {
//       setTransactions((prev) => [transaction, ...prev])
//       fetchTableData(currentTableOptions)
//     },
//     [fetchTableData, currentTableOptions]
//   )
//   const deleteTransaction = useCallback(
//     async (id: number) => {
//       try {
//         await api.deleteTransaction(id)
//         setTransactions((prev) => prev.filter((t) => t.id !== id))
//         setTableTransactions((prev) => prev.filter((t) => t.id !== id))
//         setTableTotalItems((prev) => Math.max(0, prev - 1))
//         if (tableTransactions.length === 1 && currentTableOptions.page > 1) {
//           const newPage = currentTableOptions.page - 1
//           setCurrentTableOptions((prev) => ({ ...prev, page: newPage }))
//           fetchTableData({ ...currentTableOptions, page: newPage })
//         } else {
//           fetchTableData(currentTableOptions)
//         }
//       } catch (error) {
//         console.error("Error deleting transaction:", error)
//         fetchTableData(currentTableOptions)
//         throw error
//       }
//     },
//     [currentTableOptions, fetchTableData, tableTransactions.length]
//   )
//   useEffect(() => {
//     fetchAllData()
//   }, [])
//   return (
//     <TransactionContext.Provider
//       value={{
//         transactions,
//         categories,
//         loading,
//         refreshData,
//         addTransaction,
//         tableData: {
//           transactions: tableTransactions,
//           totalPages: tableTotalPages,
//           totalItems: tableTotalItems,
//           loading: tableLoading,
//         },
//         fetchTableData,
//         deleteTransaction,
//       }}
//     >
//       {children}
//     </TransactionContext.Provider>
//   )
// }
// export function useTransactions() {
//   const context = useContext(TransactionContext)
//   if (context === undefined) {
//     throw new Error("useTransactions must be used within a TransactionProvider")
//   }
//   return context
// }
__turbopack_context__.s([
    "TransactionProvider",
    ()=>TransactionProvider,
    "useTransactions",
    ()=>useTransactions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/app/services/logic.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const TransactionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const api = new __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
// localStorage keys
const STORAGE_KEYS = {
    TABLE_OPTIONS: 'transactions_table_options'
};
const DEFAULT_OPTIONS = {
    page: 1,
    limit: 10,
    sort: {
        field: 'date',
        direction: 'desc'
    },
    filters: {}
};
function TransactionProvider({ children }) {
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tableTransactions, setTableTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tableTotalPages, setTableTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [tableTotalItems, setTableTotalItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tableLoading, setTableLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Store current table options with localStorage persistence
    const [currentTableOptions, setCurrentTableOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_OPTIONS);
    // Track if initial load has been done to prevent infinite loops
    const [initialLoadDone, setInitialLoadDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load saved options from localStorage on mount - ONLY ONCE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadSavedOptions = ()=>{
            try {
                const saved = localStorage.getItem(STORAGE_KEYS.TABLE_OPTIONS);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Validate the parsed data
                    if (parsed && typeof parsed === 'object') {
                        return {
                            page: Number(parsed.page) || DEFAULT_OPTIONS.page,
                            limit: Number(parsed.limit) || DEFAULT_OPTIONS.limit,
                            sort: parsed.sort || DEFAULT_OPTIONS.sort,
                            filters: parsed.filters || DEFAULT_OPTIONS.filters
                        };
                    }
                }
            } catch (error) {
                console.error('Error loading saved table options:', error);
            }
            return DEFAULT_OPTIONS;
        };
        const savedOptions = loadSavedOptions();
        setCurrentTableOptions(savedOptions);
        setInitialLoadDone(true);
    }, []); // Empty dependency array - runs only once on mount
    // Save options to localStorage whenever they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialLoadDone) {
            try {
                localStorage.setItem(STORAGE_KEYS.TABLE_OPTIONS, JSON.stringify(currentTableOptions));
            } catch (error) {
                console.error('Error saving table options:', error);
            }
        }
    }, [
        currentTableOptions,
        initialLoadDone
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialLoadDone) {
            fetchTableData(currentTableOptions);
            fetchAllData();
        }
    }, [
        initialLoadDone
    ]);
    const fetchAllData = async ()=>{
        setLoading(true);
        try {
            const [transactionsResult, categoriesResult] = await Promise.all([
                api.getTransactions({
                    page: 1,
                    limit: 10000,
                    sort: {
                        field: 'date',
                        direction: 'desc'
                    }
                }),
                api.getAllCategories()
            ]);
            setTransactions(transactionsResult.data || []);
            if (Array.isArray(categoriesResult)) {
                setCategories(categoriesResult);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally{
            setLoading(false);
        }
    };
    const fetchTableData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (options)=>{
        setTableLoading(true);
        try {
            const result = await api.getTransactions({
                page: options.page,
                limit: options.limit,
                sort: options.sort?.field ? {
                    field: options.sort.field,
                    direction: options.sort.direction || "desc"
                } : {
                    field: 'date',
                    direction: 'desc'
                },
                filters: options.filters
            });
            setTableTransactions(result.data || []);
            setTableTotalPages(result.pages || 1);
            setTableTotalItems(result.items || 0);
            // Only update current options if they actually changed
            // This prevents unnecessary re-renders
            setCurrentTableOptions((prev)=>{
                if (JSON.stringify(prev) === JSON.stringify(options)) {
                    return prev;
                }
                return options;
            });
        } catch (error) {
            console.error('Error fetching table data:', error);
            setTableTransactions([]);
            setTableTotalPages(1);
            setTableTotalItems(0);
        } finally{
            setTableLoading(false);
        }
    }, []);
    const refreshData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await fetchAllData();
    }, [
        fetchAllData
    ]);
    const addTransaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((transaction)=>{
        setTransactions((prev)=>[
                transaction,
                ...prev
            ]);
        // Refresh table data to include the new transaction
        fetchTableData(currentTableOptions);
    }, [
        fetchTableData,
        fetchAllData,
        currentTableOptions
    ]);
    const deleteTransaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (id)=>{
        try {
            await api.deleteTransaction(id);
            // Optimistically update both transactions arrays
            setTransactions((prev)=>prev.filter((t)=>t.id !== id));
            setTableTransactions((prev)=>prev.filter((t)=>t.id !== id));
            setTableTotalItems((prev)=>Math.max(0, prev - 1));
            // If the current page becomes empty and it's not the first page, go to previous page
            if (tableTransactions.length === 1 && currentTableOptions.page > 1) {
                const newPage = currentTableOptions.page - 1;
                const newOptions = {
                    ...currentTableOptions,
                    page: newPage
                };
                fetchTableData(newOptions);
            } else {
                // Just refetch current page to ensure data consistency
                fetchTableData(currentTableOptions);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            // If error, refetch to ensure UI is in sync with server
            fetchTableData(currentTableOptions);
            throw error;
        }
    }, [
        fetchTableData,
        currentTableOptions,
        tableTransactions.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TransactionContext.Provider, {
        value: {
            transactions,
            categories,
            loading,
            refreshData,
            addTransaction,
            tableData: {
                transactions: tableTransactions,
                totalPages: tableTotalPages,
                totalItems: tableTotalItems,
                loading: tableLoading
            },
            fetchTableData,
            deleteTransaction,
            currentTableOptions
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/my-app/app/contexts/TransactionContext.tsx",
        lineNumber: 614,
        columnNumber: 5
    }, this);
}
function useTransactions() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__31f775e9._.js.map
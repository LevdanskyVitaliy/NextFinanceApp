module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Documents/GitHub/NextFinanceApp/app/services/logic.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * Api Class - HTTP Client for Transaction and Category Operations
 * 
 * This class provides a clean interface for making API calls to your Next.js routes.
 * It abstracts away the fetch details and provides typed methods.
 * 
 * KEY CHANGE FROM BEFORE:
 * - OLD: Hard-coded `http://localhost:3000` (only worked locally)
 * - NEW: Dynamic base URL that works in both dev and production
 * 
 * HOW BASE URL WORKS:
 * - Server-side (SSR): `window` is undefined, so baseURL = "" (relative URLs)
 * - Client-side (browser): Uses `window.location.origin` (e.g., "https://yourapp.vercel.app")
 * - Result: Same code works locally AND on Vercel without changes!
 * 
 * EXAMPLE:
 * - Local dev: fetch("http://localhost:3000/transactions") → Next route handler
 * - Vercel: fetch("https://yourapp.vercel.app/transactions") → Next route handler
 */ class Api {
    // Old hard-coded approach (commented out for reference):
    // #baseURL = "http://localhost:3000";
    // New dynamic approach: works everywhere!
    // - Server-side: "" (empty string = relative URL from server)
    // - Client-side: window.location.origin (current domain)
    #baseURL = ("TURBOPACK compile-time truthy", 1) ? "" : "TURBOPACK unreachable";
    // Cache for categories since they rarely change
    // Prevents unnecessary API calls
    #categoriesCache = null;
    /**
   * Internal fetch wrapper that handles errors consistently
   * 
   * @param path - API endpoint path (e.g., "/transactions" or "/categories")
   * @param options - Standard fetch options (method, body, headers, etc.)
   * @returns Parsed JSON response
   * @throws Error if HTTP response is not ok (status >= 400)
   */ async #fetch(path, options) {
        // Construct full URL: baseURL + path
        // Examples:
        // - Local: "" + "/transactions" = "/transactions" (relative)
        // - Vercel: "https://app.vercel.app" + "/transactions" = "https://app.vercel.app/transactions"
        const response = await fetch(this.#baseURL + path, options);
        if (!response.ok) {
            // Extract error message from response body
            const text = await response.text();
            throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        return await response.json();
    }
    /**
   * Fetches all categories from the database
   * Uses caching to avoid repeated API calls
   * 
   * @returns Array of category objects
   */ getAllCategories = async ()=>{
        // Return cached categories if available
        if (!this.#categoriesCache) {
            const categories = await this.#fetch("/categories");
            // Ensure we always return an array, even if API returns unexpected format
            this.#categoriesCache = Array.isArray(categories) ? categories : [];
        }
        return this.#categoriesCache;
    };
    /**
   * Creates a new transaction
   * 
   * @param transaction - Transaction object to create (id is optional, auto-generated)
   * @returns The created transaction with assigned ID
   */ createTransaction = (transaction)=>{
        // Clear categories cache when creating transaction
        // (In case categories change, though they shouldn't in this app)
        this.#categoriesCache = null;
        return this.#fetch("/transactions", {
            method: "POST",
            body: JSON.stringify(transaction),
            headers: {
                "Content-Type": "application/json"
            }
        });
    };
    /**
   * Deletes a transaction by ID
   * 
   * @param id - Transaction ID to delete
   * @throws Error if transaction not found (404)
   */ deleteTransaction = (id)=>this.#fetch(`/transactions/${id}`, {
            method: "DELETE"
        });
    /**
   * Updates a transaction (partial update - only provided fields are changed)
   * 
   * @param id - Transaction ID to update
   * @param updates - Partial transaction object with fields to update
   * @returns The updated transaction object
   * @throws Error if transaction not found (404)
   */ updateTransaction = (id, updates)=>this.#fetch(`/transactions/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        });
    /**
   * Fetches a single transaction by ID
   * 
   * Note: This method uses fetch directly instead of #fetch wrapper
   * to provide a more specific error message for 404s
   * 
   * @param id - Transaction ID to fetch
   * @returns The transaction object
   * @throws Error with specific message if transaction not found (404)
   */ getTransactionById = async (id)=>{
        const response = await fetch(`${this.#baseURL}/transactions/${id}`);
        if (!response.ok) {
            // Provide user-friendly error for 404
            if (response.status === 404) {
                throw new Error(`Transaction with id ${id} not found`);
            }
            const text = await response.text();
            throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        return await response.json();
    };
    /**
   * Fetches paginated, filtered, and sorted list of transactions
   * 
   * @param params - Query parameters object
   * @param params.page - Page number (default: 1)
   * @param params.limit - Items per page (default: 10)
   * @param params.filters - Object with filter key-value pairs (e.g., { category: "5", type: "expense" })
   * @param params.sort - Sort options { field: string, direction: "asc" | "desc" }
   * @returns Object with paginated data: { data: Transaction[], items: number, pages: number, currentPage: number }
   * 
   * EXAMPLE:
   * ```ts
   * await api.getTransactions({
   *   page: 2,
   *   limit: 20,
   *   filters: { category: "5", type: "expense" },
   *   sort: { field: "date", direction: "desc" }
   * });
   * ```
   * 
   * This builds a query string like:
   * "/transactions?_page=2&_per_page=20&category=5&type=expense&_sort=-date"
   */ async getTransactions(params = {}) {
        // Extract parameters with defaults
        const { page = 1, limit = 10, filters = {}, sort = {
            field: "",
            direction: "desc"
        } } = params;
        // Build query string with pagination and filters
        const query = new URLSearchParams({
            _page: page.toString(),
            _per_page: limit.toString(),
            ...filters
        });
        // Add sort parameter if field is specified
        // Format: "-date" for descending, "date" for ascending
        if (sort.field) {
            query.set("_sort", sort.direction === "desc" ? `-${sort.field}` : sort.field);
        }
        // Make API call and add currentPage to response for convenience
        const result = await this.#fetch(`/transactions?${query.toString()}`);
        return {
            ...result,
            currentPage: page
        };
    }
}
const __TURBOPACK__default__export__ = Api;
}),
"[project]/Documents/GitHub/NextFinanceApp/app/contexts/TransactionContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionProvider",
    ()=>TransactionProvider,
    "useTransactions",
    ()=>useTransactions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/NextFinanceApp/app/services/logic.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const TransactionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const api = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
const STORAGE_KEYS = {
    TABLE_OPTIONS: "transactions_table_options"
};
const DEFAULT_OPTIONS = {
    page: 1,
    limit: 10,
    sort: {
        field: "date",
        direction: "desc"
    },
    filters: {}
};
function TransactionProvider({ children }) {
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tableTransactions, setTableTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tableTotalPages, setTableTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [tableTotalItems, setTableTotalItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tableLoading, setTableLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentTableOptions, setCurrentTableOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_OPTIONS);
    const [initialLoadDone, setInitialLoadDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadSavedOptions = ()=>{
            try {
                const saved = localStorage.getItem(STORAGE_KEYS.TABLE_OPTIONS);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed && typeof parsed === "object") {
                        return {
                            page: Number(parsed.page) || DEFAULT_OPTIONS.page,
                            limit: Number(parsed.limit) || DEFAULT_OPTIONS.limit,
                            sort: parsed.sort || DEFAULT_OPTIONS.sort,
                            filters: parsed.filters || DEFAULT_OPTIONS.filters
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialLoadDone) {
            try {
                localStorage.setItem(STORAGE_KEYS.TABLE_OPTIONS, JSON.stringify(currentTableOptions));
            } catch (error) {
                console.error("Error saving table options:", error);
            }
        }
    }, [
        currentTableOptions,
        initialLoadDone
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
                        field: "date",
                        direction: "desc"
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
            console.error("Error fetching data:", error);
        } finally{
            setLoading(false);
        }
    };
    const fetchTableData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (options)=>{
        setTableLoading(true);
        try {
            const result = await api.getTransactions({
                page: options.page,
                limit: options.limit,
                sort: options.sort?.field ? {
                    field: options.sort.field,
                    direction: options.sort.direction || "desc"
                } : {
                    field: "date",
                    direction: "desc"
                },
                filters: options.filters
            });
            setTableTransactions(result.data || []);
            setTableTotalPages(result.pages || 1);
            setTableTotalItems(result.items || 0);
            setCurrentTableOptions((prev)=>{
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
        } finally{
            setTableLoading(false);
        }
    }, []);
    const refreshData = async ()=>{
        await fetchAllData();
        await fetchTableData(currentTableOptions);
    };
    const addTransaction = async (transaction)=>{
        setTransactions((prev)=>[
                transaction,
                ...prev
            ]);
        await fetchAllData();
        await fetchTableData(currentTableOptions);
    };
    const deleteTransaction = async (id)=>{
        try {
            await api.deleteTransaction(id);
            setTransactions((prev)=>prev.filter((t)=>t.id !== id));
            setTableTransactions((prev)=>prev.filter((t)=>t.id !== id));
            setTableTotalItems((prev)=>Math.max(0, prev - 1));
            if (tableTransactions.length === 1 && currentTableOptions.page > 1) {
                const newPage = currentTableOptions.page - 1;
                const newOptions = {
                    ...currentTableOptions,
                    page: newPage
                };
                fetchTableData(newOptions);
            } else {
                fetchTableData(currentTableOptions);
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
            fetchTableData(currentTableOptions);
            throw error;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TransactionContext.Provider, {
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
        fileName: "[project]/Documents/GitHub/NextFinanceApp/app/contexts/TransactionContext.tsx",
        lineNumber: 229,
        columnNumber: 5
    }, this);
}
function useTransactions() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TransactionContext);
    if (context === undefined) {
        throw new Error("useTransactions must be used within a TransactionProvider");
    }
    return context;
}
}),
"[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Documents/GitHub/NextFinanceApp/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b4fc35d4._.js.map
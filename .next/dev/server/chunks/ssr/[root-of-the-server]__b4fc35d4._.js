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
        this.#categoriesCache = null;
        return this.#fetch("/transactions", {
            method: "POST",
            body: JSON.stringify(transaction),
            headers: {
                "Content-Type": "application/json"
            }
        });
    };
    deleteTransaction = (id)=>this.#fetch(`/transactions/${id}`, {
            method: "DELETE"
        });
    updateTransaction = (id, updates)=>this.#fetch(`/transactions/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        });
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
            field: "",
            direction: "desc"
        } } = params;
        const query = new URLSearchParams({
            _page: page.toString(),
            _per_page: limit.toString(),
            ...filters
        });
        if (sort.field) {
            query.set("_sort", sort.direction === "desc" ? `-${sort.field}` : sort.field);
        }
        const response = await this.#fetch(`/transactions?${query.toString()}`);
        // const data = Array.isArray(response) ? response : [];
        const totalItems = response.items;
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: response.data,
            pages: totalPages,
            items: totalItems,
            currentPage: page,
            pageSize: limit
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
module.exports = [
"[project]/my-app/app/services/logic.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
            body: JSON.stringify(updates)
        });
    async getTransactions(params = {}) {
        const { page = 1, limit = 10, filters = {}, sort = {
            field: '',
            direction: 'asc'
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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/my-app/app/(auth)/users/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // import { users } from '../../user-data'
// // import Link from 'next/link'
// // import { Card, CardContent } from '@/components/ui/card'
// // import { ReactNode } from "react"
// // export default function Layout({
// //   children,
// // }: Readonly<{
// //   children: React.ReactNode
// // }>) {
// //   return (
// //     <div  className="min-h-screen p-5">
// //       <div className="flex gap-6 justify-between items-center">
// //         <div className="flex flex-col gap-4 min-w-40 max-w-xs ">
// //           {users.map((user) => (
// //             <Card key={user.id} className="hover:bg-accent transition-color dark:text-white dark:bg-[#0c1017]">
// //               <CardContent className="p-4">
// //                 <Link
// //                   href={`/users/${user.id}`}
// //                   className="text-lg font-semibold block hover:underline"
// //                 >
// //                   {user.name}
// //                 </Link>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //          <div >{children}</div>
// //       </div>
// //     </div>
// //   )
// // }
// import { users } from '../../user-data'
// import Link from 'next/link'
// import { Card, CardContent } from '@/components/ui/card'
// import { ReactNode } from "react"
// import Api from '@/app/services/logic';
// import { Transaction, Category } from '@/app/services/logic';
// export default function Layout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const api = new Api();
//   const result = await api.getTransactions({ page: 1, limit: 1000 });
//   const transaction = result.data.find(
//     (tx: any) => String(tx.id) === id
//   );
//   if (!transaction) {
//     return notFound();
//   }
//   function getCategoryName(id: string | number): string {
//     if (!categories.length) {
//       return "Unknown"
//     }
//     let category = categories.find(cat => cat.id == id)
//     if (!category) {
//       category = categories.find(cat => String(cat.id) === String(id))
//     }
//     // If still not found, try converting both to numbers
//     if (!category) {
//       const numId = Number(id)
//       if (!isNaN(numId)) {
//         category = categories.find(cat => Number(cat.id) === numId)
//       }
//     }
//     if (!category) {
//       console.warn(`Category not found for id: ${id}. Available:`, categories.map(c => c.id))
//       return "Unknown"
//     }
//     return category.name
//   }
//   const displayTransaction = {
//     ...transaction,
//     category: getCategoryName(transaction.category),
//   };
//   return (
//     <div className="min-h-screen p-4 sm:p-8 flex justify-between">
//       <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-start w-full max-w-5xl">
//         {/* Sidebar: users list */}
//         <div className="flex flex-col gap-2 sm:gap-4 sm:min-w-30 min-w-20 max-w-xs">
//           {/* {users.map((user) => (
//             <Card 
//               key={user.id} 
//               className="hover:bg-accent transition-colors dark:text-white dark:bg-[#0c1017]"
//             >
//               <CardContent className="p-3 sm:p-4">
//                 <Link
//                   href={`/users/${user.id}`}
//                   className="text-base sm:text-lg font-semibold block hover:underline text-center sm:text-left"
//                 >
//                   {user.name}
//                 </Link>
//               </CardContent>
//             </Card>
//           ))} */}
//         </div>
//         {/* Main content area */}
//         <main className="grow w-full min-w-0">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }
// app/transactions/layout.tsx
__turbopack_context__.s([
    "default",
    ()=>TransactionsLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/app/services/logic.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/router.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function TransactionsLayout({ children }) {
    const api = new __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$router$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRouter"])();
    try {
        const [transactionsResult, categoriesResult] = await Promise.all([
            api.getTransactions({
                page: 1,
                limit: 1000
            }),
            api.getAllCategories()
        ]);
        const transactions = transactionsResult.data || [];
        // Helper function to get category name
        const getCategoryName = (categoryId)=>{
            if (!categoryId) return 'Uncategorized';
            const category = categoriesResult.find((cat)=>cat.id == categoryId || String(cat.id) === String(categoryId) || Number(cat.id) === Number(categoryId));
            return category?.name || 'Uncategorized';
        };
        // Format date for display
        const formatDate = (dateString)=>{
            try {
                return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch  {
                return 'Invalid Date';
            }
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto p-4 sm:p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col lg:flex-row gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:w-80 shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold mb-4 text-foreground",
                                        children: "Transactions"
                                    }, void 0, false, {
                                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto",
                                        children: transactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                            className: "p-4 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground",
                                                children: "No transactions found"
                                            }, void 0, false, {
                                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                lineNumber: 188,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                            lineNumber: 187,
                                            columnNumber: 21
                                        }, this) : transactions.map((transaction)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                                onClick: ()=>router.push(`/users/${transaction.id}`),
                                                className: "hover:bg-accent transition-colors duration-200 border shadow-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    className: "p-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/transactions/${transaction.id}`,
                                                        className: "block hover:no-underline group",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "font-semibold text-foreground group-hover:text-primary",
                                                                            children: [
                                                                                "#",
                                                                                transaction.id
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                            lineNumber: 203,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded",
                                                                            children: getCategoryName(transaction.category)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                            lineNumber: 206,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                    lineNumber: 202,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                className: "w-3 h-3",
                                                                                fill: "none",
                                                                                stroke: "currentColor",
                                                                                viewBox: "0 0 24 24",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    strokeWidth: 2,
                                                                                    d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                                    lineNumber: 214,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                                lineNumber: 213,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            formatDate(transaction.date)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                        lineNumber: 212,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                    lineNumber: 211,
                                                                    columnNumber: 31
                                                                }, this),
                                                                transaction.amount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-sm font-medium ${Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`,
                                                                    children: [
                                                                        Number(transaction.amount) >= 0 ? '+' : '-',
                                                                        "$",
                                                                        Math.abs(Number(transaction.amount)).toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                    lineNumber: 221,
                                                                    columnNumber: 33
                                                                }, this),
                                                                transaction.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-muted-foreground truncate",
                                                                    children: transaction.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                                    lineNumber: 232,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 25
                                                }, this)
                                            }, transaction.id, false, {
                                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                                lineNumber: 192,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                        lineNumber: 185,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                lineNumber: 183,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "mt-11",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                lineNumber: 248,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                    lineNumber: 180,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                lineNumber: 179,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
            lineNumber: 178,
            columnNumber: 7
        }, this);
    } catch (error) {
        console.error('Error fetching data:', error);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-8 h-8 text-destructive",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            }, void 0, false, {
                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                lineNumber: 263,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                            lineNumber: 262,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-foreground",
                        children: "Failed to load transactions"
                    }, void 0, false, {
                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "There was an error loading your transaction data."
                    }, void 0, false, {
                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
                        children: "Try Again"
                    }, void 0, false, {
                        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                lineNumber: 260,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
            lineNumber: 259,
            columnNumber: 7
        }, this);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dd57b8ed._.js.map
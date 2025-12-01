module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/my-app/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/my-app/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/my-app/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/my-app/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/my-app/app/(auth)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/my-app/app/(auth)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/my-app/app/(auth)/users/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/my-app/app/(auth)/users/layout.tsx [app-rsc] (ecmascript)"));
}),
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
            // You can read plain text error message here
            const text = await response.text();
            throw new Error(`HTTP error ${response.status}: ${text}`);
        }
        // This assumes a JSON response if status OK
        return await response.json();
    }
    // getAllCategories = async (): Promise<any[] | null> => {
    //   if (!this.#categoriesCache) {
    //     this.#categoriesCache = await this.#fetch("/categories");
    //   }
    //   return this.#categoriesCache;
    // };
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
"[project]/my-app/app/(auth)/users/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // import Link from 'next/link'
// // import { users } from '../../../user-data'
// // import { notFound } from 'next/navigation'
// // import { Button } from "@/components/ui/button"
// // import {
// //   Item,
// //   ItemActions,
// //   ItemContent,
// //   ItemDescription,
// //   ItemTitle,
// // } from "@/components/ui/item"
// // export default async function UserPage({ params }: { params: { id: string } }) {
// //   const { id } = await params
// //   const user = users.find((user) => user.id === id)
// //   if (!user) {
// //     return notFound()
// //   }
// //   return (
// //     <div className="flex flex-col gap-2 m-5 bg-white border-black border-2 max-w-2xs p-10 rounded-md">
// //       <Link href={`/users/${user.id}/edit`} className='bg-blue-500 rounded-xl p-2 max-w-12'>Edit</Link>
// //       User: {user.name}
// //       <Link href="/users">Back to users</Link>
// //     </div>
// //   )
// // }
// // export function ItemVariant() {
// //   return (
// //     <div className="flex flex-col gap-6 bg-black">
// //       <Item>
// //         <ItemContent>
// //           <ItemTitle>Default Variant</ItemTitle>
// //           <ItemDescription>
// //             Standard styling with subtle background and borders.
// //           </ItemDescription>
// //         </ItemContent>
// //         <ItemActions>
// //           <Button variant="outline" size="sm">
// //             Open
// //           </Button>
// //         </ItemActions>
// //       </Item>
// //       <Item variant="outline">
// //         <ItemContent>
// //           <ItemTitle>Outline Variant</ItemTitle>
// //           <ItemDescription>
// //             Outlined style with clear borders and transparent background.
// //           </ItemDescription>
// //         </ItemContent>
// //         <ItemActions>
// //           <Button variant="outline" size="sm">
// //             Open
// //           </Button>
// //         </ItemActions>
// //       </Item>
// //       <Item variant="muted">
// //         <ItemContent>
// //           <ItemTitle>Muted Variant</ItemTitle>
// //           <ItemDescription>
// //             Subdued appearance with muted colors for secondary content.
// //           </ItemDescription>
// //         </ItemContent>
// //         <ItemActions>
// //           <Button variant="outline" size="sm">
// //             Open
// //           </Button>
// //         </ItemActions>
// //       </Item>
// //     </div>
// //   )
// // }
// import Link from 'next/link'
// import { users } from '../../../user-data'
// import { notFound } from 'next/navigation'
// import { Separator } from "@/components/ui/separator" 
// import {
//   Item,
//   ItemActions,
//   ItemContent,
//   ItemDescription,
//   ItemTitle,
// } from "@/components/ui/item"
// export default async function UserPage({ params }: { params: { id: string } }) {
//   const { id } = await params // params не промис, await не нужен
//   const user = users.find((user) => user.id === id)
//   if (!user) {
//     return notFound()
//   }
//   return (
//     <div className="max-w-xl p-5 rounded-md border-2 border-black dark:border-white dark:bg-[#0c1017] flex flex-col gap-2 ">
//       <Item variant="muted">
//         <ItemContent>
//           <ItemTitle>User: {user.name}</ItemTitle>
//           <ItemDescription>Phone Number: {user.phoneNumber}</ItemDescription>
//           <Separator className="my-4" />
//           <ItemActions>
//         <Link href={`/users/${user.id}/edit`} className="max-w-12 rounded-xl bg-blue-500 p-2">
//         Edit
//       </Link>
//       <Link href="/users">Back to users</Link>
//         </ItemActions>
//         </ItemContent>
//       </Item>
//     </div>
//   )
// }
// app/transactions/[id]/page.tsx
__turbopack_context__.s([
    "default",
    ()=>TransactionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/app/services/logic.ts [app-rsc] (ecmascript)");
;
;
;
async function TransactionPage({ params }) {
    const { id } = params;
    const api = new __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$app$2f$services$2f$logic$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]();
    // Fetch all transactions (your API has no single transaction fetch)
    const allTransactions = await api.getTransactions({
        page: 1,
        limit: 1000
    });
    // Find transaction by id (string coercion for robustness)
    const transaction = allTransactions.data.find((tx)=>String(tx.id) === id);
    if (!transaction) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-semibold mb-4",
                children: "Transaction Details"
            }, void 0, false, {
                fileName: "[project]/my-app/app/(auth)/users/[id]/page.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "grid grid-cols-2 gap-6",
                children: Object.entries(transaction).map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-300 dark:border-gray-700 pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                className: "font-medium text-gray-600 dark:text-gray-400 capitalize",
                                children: key.replace(/_/g, ' ')
                            }, void 0, false, {
                                fileName: "[project]/my-app/app/(auth)/users/[id]/page.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "text-gray-900 dark:text-gray-200",
                                children: String(value)
                            }, void 0, false, {
                                fileName: "[project]/my-app/app/(auth)/users/[id]/page.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, key, true, {
                        fileName: "[project]/my-app/app/(auth)/users/[id]/page.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/my-app/app/(auth)/users/[id]/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/my-app/app/(auth)/users/[id]/page.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
}),
"[project]/my-app/app/(auth)/users/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/my-app/app/(auth)/users/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cfc9a974._.js.map
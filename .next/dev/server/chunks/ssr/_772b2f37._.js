module.exports = [
"[project]/course-web-intensive-practice/8-next-js-routing/app/user-data.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "users",
    ()=>users
]);
const users = [
    {
        id: '123',
        name: 'Ivan',
        phoneNumber: '123123413'
    },
    {
        id: '456',
        name: 'Oleg',
        phoneNumber: '12312323123213'
    },
    {
        id: '789',
        name: 'Petr',
        phoneNumber: '123123413'
    }
];
}),
"[project]/my-app/app/(auth)/users/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$course$2d$web$2d$intensive$2d$practice$2f$8$2d$next$2d$js$2d$routing$2f$app$2f$user$2d$data$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/course-web-intensive-practice/8-next-js-routing/app/user-data.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/my-app/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
;
function Layout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-dollar-pattern min-h-screen text-black ",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4 justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2 w-1/4 m-10",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$course$2d$web$2d$intensive$2d$practice$2f$8$2d$next$2d$js$2d$routing$2f$app$2f$user$2d$data$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"].map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-2xl dark-text font-bold border-2 border-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: `/users/${user.id}`,
                                children: user.name
                            }, void 0, false, {
                                fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                                lineNumber: 20,
                                columnNumber: 13
                            }, this)
                        }, user.id, false, {
                            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                    lineNumber: 17,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grow",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
                    lineNumber: 24,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
            lineNumber: 15,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/my-app/app/(auth)/users/layout.tsx",
        lineNumber: 12,
        columnNumber: 1
    }, this);
}
}),
];

//# sourceMappingURL=_772b2f37._.js.map
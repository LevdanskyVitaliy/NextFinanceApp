module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/Documents/GitHub/NextFinanceApp/app/transactions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * app/transactions/route.ts
 * 
 * This file implements the Next.js API route handlers for the `/transactions` endpoint.
 * It handles GET (list transactions) and POST (create transaction) requests.
 * 
 * ARCHITECTURE:
 * - This is a Next.js App Router route handler (not Pages Router)
 * - File-based routing: `app/transactions/route.ts` automatically creates `/transactions` endpoint
 * - Server-side only: Runs on Node.js server, never sent to browser
 * - Reads/writes to `server/db.json` as a simple file-based database
 * 
 * HOW IT WORKS:
 * 1. Client calls `fetch("/transactions")` from browser or server component
 * 2. Next.js routes request to this file's exported functions (GET/POST)
 * 3. Functions read/write JSON file synchronously
 * 4. Returns JSON response that client can consume
 * 
 * IMPORTANT LIMITATIONS:
 * - File writes work locally but NOT persisted on Vercel (serverless filesystem is read-only)
 * - No concurrent write protection (multiple requests could corrupt data)
 * - For production, replace with real database (PostgreSQL, MongoDB, etc.)
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/NextFinanceApp/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Path to the database file relative to project root
// process.cwd() = project root directory
const DB_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "server", "db.json");
/**
 * Reads the entire database file from disk and parses JSON
 * @returns Promise resolving to the database object
 */ async function readDb() {
    const file = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].readFile(DB_PATH, "utf-8");
    return JSON.parse(file);
}
/**
 * Writes the database object back to disk as formatted JSON
 * @param data - The complete database object to write
 */ async function writeDb(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
async function GET(request) {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    // Parse pagination parameters with defaults
    const page = Number(searchParams.get("_page") ?? "1") || 1;
    const limit = Number(searchParams.get("_per_page") ?? "10") || 10;
    const sortParam = searchParams.get("_sort");
    // Extract filter parameters (everything except pagination/sort params)
    // This allows flexible filtering: ?category=5&type=expense&description=test
    const filters = {};
    searchParams.forEach((value, key)=>{
        if (![
            "_page",
            "_per_page",
            "_sort"
        ].includes(key)) {
            filters[key] = value;
        }
    });
    // Load database from disk
    const db = await readDb();
    // Create a copy to avoid mutating original array
    let data = db.transactions.slice();
    // Apply filters: match transaction fields to filter values
    // Example: filter by category="5" will match transactions where tx.category === "5"
    Object.entries(filters).forEach(([key, value])=>{
        if (!value) return; // Skip empty filters
        data = data.filter((tx)=>String(tx[key]) === String(value));
    });
    // Apply sorting if requested
    // Sort format: "-date" means descending by date, "amount" means ascending by amount
    if (sortParam) {
        const desc = sortParam.startsWith("-");
        const field = desc ? sortParam.slice(1) : sortParam;
        data.sort((a, b)=>{
            const av = a[field];
            const bv = b[field];
            if (av === bv) return 0;
            // Null/undefined values go to end
            if (av == null) return 1;
            if (bv == null) return -1;
            // Compare values (works for strings, numbers, dates)
            if (av < bv) return desc ? 1 : -1;
            return desc ? -1 : 1;
        });
    }
    // Calculate pagination metadata
    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageData = data.slice(start, end);
    // Return paginated results with metadata
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        data: pageData,
        items: totalItems,
        pages: totalPages
    });
}
async function POST(request) {
    // Parse JSON body from request
    const body = await request.json();
    // Validate required fields
    // Note: category can be empty string, so we check for undefined, not falsy
    if (typeof body.amount !== "number" || !body.date || body.category === undefined || !body.type) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid transaction payload"
        }, {
            status: 400
        });
    }
    // Load current database state
    const db = await readDb();
    // Generate ID if not provided
    // Format: 4-character hexadecimal string (e.g., "a8d6", "2efb")
    // This matches the ID format used in your existing db.json
    const id = body.id && String(body.id).length ? String(body.id) : Math.random().toString(16).slice(2, 6);
    // Create new transaction object with all fields
    const newTx = {
        id,
        amount: body.amount,
        date: body.date,
        category: String(body.category ?? ""),
        description: body.description ?? "",
        type: body.type
    };
    // Add to beginning of array (newest first)
    db.transactions.unshift(newTx);
    // Persist changes to disk
    await writeDb(db);
    // Return created transaction with 201 Created status
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$NextFinanceApp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newTx, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fa7dbba9._.js.map
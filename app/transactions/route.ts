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
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Transaction type matching the structure in db.json
type Transaction = {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: string;
};

// Shape of the entire database file
type DbShape = {
  transactions: Transaction[];
  categories: { id: string; name: string }[];
};

// Path to the database file relative to project root
// process.cwd() = project root directory
const DB_PATH = path.join(process.cwd(), "server", "db.json");

/**
 * Reads the entire database file from disk and parses JSON
 * @returns Promise resolving to the database object
 */
async function readDb(): Promise<DbShape> {
  const file = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(file) as DbShape;
}

/**
 * Writes the database object back to disk as formatted JSON
 * @param data - The complete database object to write
 */
async function writeDb(data: DbShape) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * GET /transactions
 * 
 * Handles listing transactions with pagination, filtering, and sorting.
 * 
 * QUERY PARAMETERS:
 * - _page: Page number (default: 1)
 * - _per_page: Items per page (default: 10)
 * - _sort: Sort field, prefix with "-" for descending (e.g., "-date" or "amount")
 * - Any other params: Treated as filters (e.g., ?category=5&type=expense)
 * 
 * RESPONSE FORMAT:
 * {
 *   data: Transaction[],      // Array of transactions for current page
 *   items: number,            // Total number of items (after filtering)
 *   pages: number             // Total number of pages
 * }
 * 
 * EXAMPLE REQUESTS:
 * - GET /transactions?_page=1&_per_page=10&_sort=-date
 * - GET /transactions?category=5&type=expense&_page=1
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from URL
  const { searchParams } = new URL(request.url);

  // Parse pagination parameters with defaults
  const page = Number(searchParams.get("_page") ?? "1") || 1;
  const limit = Number(searchParams.get("_per_page") ?? "10") || 10;
  const sortParam = searchParams.get("_sort");

  // Extract filter parameters (everything except pagination/sort params)
  // This allows flexible filtering: ?category=5&type=expense&description=test
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!["_page", "_per_page", "_sort"].includes(key)) {
      filters[key] = value;
    }
  });

  // Load database from disk
  const db = await readDb();
  // Create a copy to avoid mutating original array
  let data = db.transactions.slice();

  // Apply filters: match transaction fields to filter values
  // Example: filter by category="5" will match transactions where tx.category === "5"
  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return; // Skip empty filters
    data = data.filter((tx) => String((tx as any)[key]) === String(value));
  });

  // Apply sorting if requested
  // Sort format: "-date" means descending by date, "amount" means ascending by amount
  if (sortParam) {
    const desc = sortParam.startsWith("-");
    const field = desc ? sortParam.slice(1) : sortParam;
    data.sort((a: any, b: any) => {
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
  return NextResponse.json({
    data: pageData,
    items: totalItems,
    pages: totalPages,
  });
}

/**
 * POST /transactions
 * 
 * Creates a new transaction and adds it to the database.
 * 
 * REQUEST BODY:
 * {
 *   id?: string,              // Optional - auto-generated if not provided
 *   amount: number,            // Required
 *   date: string,             // Required (ISO date string)
 *   category: string,         // Required (can be empty string)
 *   description?: string,      // Optional (defaults to empty string)
 *   type: "expense" | "income" // Required
 * }
 * 
 * RESPONSE:
 * - 201 Created: Returns the created transaction object
 * - 400 Bad Request: Returns error message if validation fails
 * 
 * BEHAVIOR:
 * - New transaction is added to the BEGINNING of the array (unshift)
 * - This makes newest transactions appear first when sorted by date
 * - ID is auto-generated if not provided (4-character hex string)
 */
export async function POST(request: NextRequest) {
  // Parse JSON body from request
  const body = (await request.json()) as Partial<Transaction>;

  // Validate required fields
  // Note: category can be empty string, so we check for undefined, not falsy
  if (
    typeof body.amount !== "number" ||
    !body.date ||
    body.category === undefined ||
    !body.type
  ) {
    return NextResponse.json(
      { error: "Invalid transaction payload" },
      { status: 400 }
    );
  }

  // Load current database state
  const db = await readDb();

  // Generate ID if not provided
  // Format: 4-character hexadecimal string (e.g., "a8d6", "2efb")
  // This matches the ID format used in your existing db.json
  const id =
    body.id && String(body.id).length
      ? String(body.id)
      : Math.random().toString(16).slice(2, 6);

  // Create new transaction object with all fields
  const newTx: Transaction = {
    id,
    amount: body.amount,
    date: body.date,
    category: String(body.category ?? ""), // Ensure category is always a string
    description: body.description ?? "",   // Default to empty string if missing
    type: body.type,
  };

  // Add to beginning of array (newest first)
  db.transactions.unshift(newTx);
  
  // Persist changes to disk
  await writeDb(db);

  // Return created transaction with 201 Created status
  return NextResponse.json(newTx, { status: 201 });
}



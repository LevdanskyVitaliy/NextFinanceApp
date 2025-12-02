/**
 * app/transactions/[id]/route.ts
 * 
 * This file implements API route handlers for individual transaction operations.
 * The `[id]` folder creates a dynamic route that captures the transaction ID.
 * 
 * ROUTE PATTERN:
 * - File location: `app/transactions/[id]/route.ts`
 * - Creates endpoint: `/transactions/:id` (e.g., `/transactions/a8d6`)
 * - The `[id]` segment is available as `params.id` in route handlers
 * 
 * HANDLERS:
 * - GET: Retrieve a single transaction by ID
 * - PATCH: Update specific fields of a transaction
 * - DELETE: Remove a transaction from the database
 * 
 * ERROR HANDLING:
 * - All handlers return 404 if transaction with given ID doesn't exist
 * - This matches Next.js `notFound()` behavior used in your page components
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Transaction type matching db.json structure
type Transaction = {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: string;
};

// Database file structure
type DbShape = {
  transactions: Transaction[];
  categories: { id: string; name: string }[];
};

// Path to database file
const DB_PATH = path.join(process.cwd(), "server", "db.json");

/**
 * Reads database from disk
 */
async function readDb(): Promise<DbShape> {
  const file = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(file) as DbShape;
}

/**
 * Writes database to disk
 */
async function writeDb(data: DbShape) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * GET /transactions/:id
 * 
 * Retrieves a single transaction by its ID.
 * 
 * ROUTE PARAMETERS:
 * - id: Transaction ID (from URL path, e.g., "/transactions/a8d6" → id="a8d6")
 * 
 * RESPONSE:
 * - 200 OK: Returns the transaction object
 * - 404 Not Found: Returns error if transaction doesn't exist
 * 
 * USAGE:
 * Used by your page component at `app/(auth)/users/[id]/page.tsx` to fetch
 * transaction details for display.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await readDb();
  
  // Find transaction by ID (using String() to handle number/string mismatches)
  // This matches the flexible ID matching logic in your page components
  const tx = db.transactions.find((t) => String(t.id) === String(params.id));
  
  if (!tx) {
    return NextResponse.json(
      { error: `Transaction with id ${params.id} not found` },
      { status: 404 }
    );
  }
  
  return NextResponse.json(tx);
}

/**
 * PATCH /transactions/:id
 * 
 * Partially updates a transaction. Only provided fields are updated.
 * 
 * ROUTE PARAMETERS:
 * - id: Transaction ID to update
 * 
 * REQUEST BODY:
 * Partial Transaction object - only include fields you want to change:
 * {
 *   amount?: number,
 *   date?: string,
 *   category?: string,
 *   description?: string,
 *   type?: "expense" | "income"
 * }
 * 
 * RESPONSE:
 * - 200 OK: Returns the updated transaction object
 * - 404 Not Found: Returns error if transaction doesn't exist
 * 
 * BEHAVIOR:
 * - Merges updates with existing transaction data
 * - ID field is protected (cannot be changed via updates)
 * - Used by your edit form at `app/(auth)/users/[id]/edit/page.tsx`
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Parse partial update object from request body
  const updates = (await request.json()) as Partial<Transaction>;
  const db = await readDb();

  // Find transaction index (not just the object, so we can mutate array)
  const index = db.transactions.findIndex(
    (t) => String(t.id) === String(params.id)
  );
  
  if (index === -1) {
    return NextResponse.json(
      { error: `Transaction with id ${params.id} not found` },
      { status: 404 }
    );
  }

  // Get existing transaction and merge with updates
  const existing = db.transactions[index];
  const updated: Transaction = {
    ...existing,      // Start with existing data
    ...updates,       // Override with new values
    id: existing.id,  // Protect ID from being changed
  };

  // Replace transaction in array
  db.transactions[index] = updated;
  await writeDb(db);

  return NextResponse.json(updated);
}

/**
 * DELETE /transactions/:id
 * 
 * Deletes a transaction from the database.
 * 
 * ROUTE PARAMETERS:
 * - id: Transaction ID to delete
 * 
 * RESPONSE:
 * - 200 OK: Returns { success: true }
 * - 404 Not Found: Returns error if transaction doesn't exist
 * 
 * BEHAVIOR:
 * - Removes transaction from array using filter
 * - Checks if length changed to detect if transaction existed
 * - Used by your delete functionality in TransactionContext
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await readDb();
  
  // Store original length to check if deletion actually happened
  const before = db.transactions.length;
  
  // Filter out the transaction to delete
  db.transactions = db.transactions.filter(
    (t) => String(t.id) !== String(params.id)
  );

  // If length didn't change, transaction wasn't found
  if (db.transactions.length === before) {
    return NextResponse.json(
      { error: `Transaction with id ${params.id} not found` },
      { status: 404 }
    );
  }

  // Persist deletion to disk
  await writeDb(db);
  return NextResponse.json({ success: true });
}



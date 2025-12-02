/**
 * app/categories/route.ts
 * 
 * This file implements the API route handler for fetching all categories.
 * Categories are read-only in this app (no create/update/delete endpoints).
 * 
 * ROUTE:
 * - File location: `app/categories/route.ts`
 * - Creates endpoint: `GET /categories`
 * 
 * RESPONSE:
 * Returns array of category objects:
 * [
 *   { id: "1", name: "Инвестиции" },
 *   { id: "2", name: "Подарки" },
 *   ...
 * ]
 * 
 * USAGE:
 * Used by:
 * - TransactionContext.getAllCategories() to populate category dropdowns
 * - Page components to display category names for transactions
 * 
 * PERFORMANCE NOTE:
 * Categories are cached in Api class (#categoriesCache) to avoid repeated
 * API calls since categories rarely change.
 */
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Category type matching db.json structure
type Category = {
  id: string;
  name: string;
};

// Database file structure (we only need categories here)
type DbShape = {
  transactions: any[];  // Not used in this file, but part of db.json structure
  categories: Category[];
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
 * GET /categories
 * 
 * Returns all categories from the database.
 * Simple read-only endpoint - no filtering or pagination needed.
 */
export async function GET() {
  const db = await readDb();
  // Return just the categories array
  return NextResponse.json(db.categories);
}



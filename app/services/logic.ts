export type Transaction = {
  id?: string | number;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: "expense" | "income" | string;
};

export type SortOptions = {
  field: string | null;
  direction: "desc" | "asc" | null;
};

interface Params {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  sort?: SortOptions;
}

export type Category = {
  id: string | number;
  name: string;
};

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
 */
class Api {
  // Old hard-coded approach (commented out for reference):
  // #baseURL = "http://localhost:3000";
  
  // New dynamic approach: works everywhere!
  // - Server-side: "" (empty string = relative URL from server)
  // - Client-side: window.location.origin (current domain)
  #baseURL =
    typeof window === "undefined" ? "" : window.location.origin ?? "";
  
  // Cache for categories since they rarely change
  // Prevents unnecessary API calls
  #categoriesCache: Category[] | null = null;

  /**
   * Internal fetch wrapper that handles errors consistently
   * 
   * @param path - API endpoint path (e.g., "/transactions" or "/categories")
   * @param options - Standard fetch options (method, body, headers, etc.)
   * @returns Parsed JSON response
   * @throws Error if HTTP response is not ok (status >= 400)
   */
  async #fetch(path: string, options?: RequestInit): Promise<any> {
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
   */
  getAllCategories = async (): Promise<Category[]> => {
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
   */
  createTransaction = (transaction: Transaction): Promise<Transaction> => {
    // Clear categories cache when creating transaction
    // (In case categories change, though they shouldn't in this app)
    this.#categoriesCache = null;
    
    return this.#fetch("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  /**
   * Deletes a transaction by ID
   * 
   * @param id - Transaction ID to delete
   * @throws Error if transaction not found (404)
   */
  deleteTransaction = (id: number | string): Promise<void> =>
    this.#fetch(`/transactions/${id}`, { method: "DELETE" });

  /**
   * Updates a transaction (partial update - only provided fields are changed)
   * 
   * @param id - Transaction ID to update
   * @param updates - Partial transaction object with fields to update
   * @returns The updated transaction object
   * @throws Error if transaction not found (404)
   */
  updateTransaction = (
    id: number | string,
    updates: Partial<Transaction>
  ): Promise<Transaction> =>
    this.#fetch(`/transactions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
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
   */
  getTransactionById = async (id: string | number): Promise<Transaction> => {
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
   */
  async getTransactions(params: Params = {}): Promise<Transaction> {
    // Extract parameters with defaults
    const {
      page = 1,
      limit = 10,
      filters = {},
      sort = { field: "", direction: "desc" },
    } = params;
    
    // Build query string with pagination and filters
    const query = new URLSearchParams({
      _page: page.toString(),
      _per_page: limit.toString(),
      ...filters, // Spread filters as query params (e.g., { category: "5" } → ?category=5)
    });

    // Add sort parameter if field is specified
    // Format: "-date" for descending, "date" for ascending
    if (sort.field) {
      query.set(
        "_sort",
        sort.direction === "desc" ? `-${sort.field}` : sort.field
      );
    }

    // Make API call and add currentPage to response for convenience
    const result = await this.#fetch(`/transactions?${query.toString()}`);
    return { ...result, currentPage: page };
  }
}

export default Api;

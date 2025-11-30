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

class Api {
  #baseURL = "http://localhost:3000";
  #categoriesCache: Category[] | null = null;

  async #fetch(path: string, options?: RequestInit): Promise<any> {
    const response = await fetch(this.#baseURL + path, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    return await response.json();
  }

  getAllCategories = async (): Promise<Category[]> => {
    if (!this.#categoriesCache) {
      const categories = await this.#fetch("/categories");
      this.#categoriesCache = Array.isArray(categories) ? categories : [];
    }
    return this.#categoriesCache;
  };

  createTransaction = (transaction: Transaction): Promise<Transaction> => {
    // Should the cache always be cleared? Review if necessary
    this.#categoriesCache = null;
    return this.#fetch("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });
  };

  deleteTransaction = (id: number | string): Promise<void> =>
    this.#fetch(`/transactions/${id}`, { method: "DELETE" });

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

  getTransactionById = async (id: string | number): Promise<Transaction> => {
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

  async getTransactions(params: Params = {}): Promise<Transaction> {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sort = { field: "", direction: "desc" },
    } = params;
    const query = new URLSearchParams({
      _page: page.toString(),
      _per_page: limit.toString(),
      ...filters,
    });

    if (sort.field) {
      query.set(
        "_sort",
        sort.direction === "desc" ? `-${sort.field}` : sort.field
      );
    }

    const result = await this.#fetch(`/transactions?${query.toString()}`);
    return { ...result, currentPage: page };
  }
}

export default Api;

export type Transaction = {
  id?: string | number | undefined;
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

export type Category = {
  id: string | number;
  name: string;
};

interface Params {
  page?: number | undefined;
  limit?: number | undefined;
  filters?: Record<string, any>;
  sort?: SortOptions;
}


export interface PaginatedTransactions {
  data: Transaction[];       
  pages: number | undefined;             // Total pages
  items: number | undefined;             // Total items count
  currentPage: number | undefined;       // Current page
  pageSize: number | undefined;          // Items per page
}

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
    this.#categoriesCache = null;
    return this.#fetch("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        "Content-Type": "application/json",
      },
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


  async getTransactions(params: Params = {}): Promise<PaginatedTransactions> {
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

    const response = await this.#fetch(`/transactions?${query.toString()}`);
    
    // const data = Array.isArray(response) ? response : [];
   
    const totalItems = response.items
    const totalPages = Math.ceil(totalItems / limit);
     
    
    return {
      data: response.data,
      pages: totalPages,
      items: totalItems,
      currentPage: page,
      pageSize: limit,
    };
  }
}

export default Api;

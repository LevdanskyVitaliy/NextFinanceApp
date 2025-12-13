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
  id:  number;
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
  pages: number | undefined;             
  items: number | undefined;             
  currentPage: number | undefined;      
  pageSize: number | undefined;         
}

class Api {
 

#baseURL = (() => {
  const env = process.env.NODE_ENV || 'development';
  
  const urls: Record<string, string> = {
    development: 'http://localhost:3000',
    production: process.env.NEXT_PUBLIC_API_URL || 'https://yourapp.com/api',
 
  };
  
  return urls[env] || urls.development;
})();

  
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
      limit = 10000,
      filters = {},
      sort = { field: "", direction: "desc" },
    } = params;
  
    const query = new URLSearchParams({
      _page: page.toString(),
      ...filters,
    });
    if (limit) query.set("_per_page", limit.toString());
    if (sort.field) {
      query.set(
        "_sort",
        sort.direction === "desc" ? `-${sort.field}` : sort.field
      );
    }
    const response = await this.#fetch(`/transactions?${query.toString()}`);
  
    return {
      data: response.data ?? [],
      pages: response.pages ?? 1,
      items: response.items ?? response.data?.length ?? 0,
      currentPage: response.currentPage ?? page,
      pageSize: response.pageSize ?? limit ?? response.data?.length ?? 0,
    };
  }
}

export default Api;

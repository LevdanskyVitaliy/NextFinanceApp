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

// #baseURL = "http://localhost:3000";
 

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

  // async #fetch(path: string, options?: RequestInit): Promise<any> {
  //   const response = await fetch(this.#baseURL + path, {
  //     // allow overriding, but set defaults
  //     headers: {
  //       "Content-Type": "application/json",
  //       ...(options?.headers || {}),
  //     },
  //     ...options,
  //   });

  //   if (!response.ok) {
  //     const text = await response.text();
  //     throw new Error(`HTTP error ${response.status}: ${text}`);
  //   }

  //   // 204 No Content (e.g. DELETE) has empty body
  //   if (response.status === 204) return null;

  //   return await response.json();
  // }

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



  // async getTransactions(params: Params = {}): Promise<PaginatedTransactions> {
  //   const {
  //     page = 1,
  //     limit = 10000, // optional
  //     filters = {},
  //     sort = { field: "", direction: "desc" },
  //   } = params;
  
  //   const query = new URLSearchParams({
  //     _page: page.toString(),
  //     ...filters,
  //   });
  
  //   // Only add limit if provided
  //   if (limit) {
  //     query.set("_per_page", limit.toString());
  //   }
  
  //   if (sort.field) {
  //     query.set(
  //       "_sort",
  //       sort.direction === "desc" ? `-${sort.field}` : sort.field
  //     );
  //   }
  
  //   const response = await this.#fetch(`/transactions?${query.toString()}`);
  
  //   // Handle both paginated and non-paginated responses from json-server
  //   const data = Array.isArray(response)
  //     ? response
  //     : (response.data || response || []);
  //   const totalItems =
  //     response.items || response.length || data.length || 0;
  
  //   const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
  
  //   return {
  //     data,
  //     pages: totalPages,
  //     items: totalItems,
  //     currentPage: page,
  //     pageSize: limit ?? totalItems, // if no limit, treat as "all"
  //   };
  // }
  
  // async getTransactions(params: Params = {}): Promise<PaginatedTransactions> {
  //   const {
  //     page = 1,
  //     limit = 10000,
  //     filters = {},
  //     sort = { field: "", direction: "desc" },
  //   } = params;
  
  //   const query = new URLSearchParams({
  //     _page: page.toString(),
  //     ...filters,
  //   });
  
  //   if (limit) {
  //     query.set("_per_page", limit.toString());
  //   }
  
  //   if (sort.field) {
  //     query.set(
  //       "_sort",
  //       sort.direction === "desc" ? `-${sort.field}` : sort.field
  //     );
  //   }
  
  //   const response = await this.#fetch(`/transactions?${query.toString()}`);
  
  //   const data = Array.isArray(response)
  //     ? response
  //     : (response.data || response || []);
  //   const totalItems =
  //     response.items || response.length || data.length || 0;
  
  //   const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
  
  //   return {
  //     data,
  //     pages: totalPages,
  //     items: totalItems,
  //     currentPage: page,
  //     pageSize: limit ?? totalItems,
  //   };
  // }


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
  
    // assume backend always returns the full paginated object
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

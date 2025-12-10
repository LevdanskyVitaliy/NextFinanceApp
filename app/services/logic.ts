
// export type Transaction = {
//   id?: string | number;
//   amount: number;
//   date: string;
//   category: string;
//   description: string;
//   type: "expense" | "income" | string;
// };

// export type SortOptions = {
//   field: string | null;
//   direction: "desc" | "asc" | null;
// };

// interface Params {
//   page?: number;
//   limit?: number;
//   filters?: Record<string, any>;
//   sort?: SortOptions;
// }

// export type Category = {
//   id: string | number;
//   name: string;
// };

// class Api {
//   #baseURL = "http://localhost:3000";
  
 
//   #categoriesCache: Category[] | null = null;

//   /**
//    * Internal fetch wrapper that handles errors consistently
//    * 
//    * @param path - API endpoint path (e.g., "/transactions" or "/categories")
//    * @param options - Standard fetch options (method, body, headers, etc.)
//    * @returns Parsed JSON response
//    * @throws Error if HTTP response is not ok (status >= 400)
//    */
//   async #fetch(path: string, options?: RequestInit): Promise<any> {
    
//     const response = await fetch(this.#baseURL + path, options);
    
//     if (!response.ok) {
      
//       const text = await response.text();
//       throw new Error(`HTTP error ${response.status}: ${text}`);
//     }

//     return await response.json();
//   }

  
//   getAllCategories = async (): Promise<Category[]> => {
    
//     if (!this.#categoriesCache) {
//       const categories = await this.#fetch("/categories");
//       this.#categoriesCache = Array.isArray(categories) ? categories : [];
//     }
//     return this.#categoriesCache;
//   };

  
//   createTransaction = (transaction: Transaction): Promise<Transaction> => {

//     this.#categoriesCache = null;
    
//     return this.#fetch("/transactions", {
//       method: "POST",
//       body: JSON.stringify(transaction),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   };


//   deleteTransaction = (id: number | string): Promise<void> =>
//     this.#fetch(`/transactions/${id}`, { method: "DELETE" });

 
//   updateTransaction = (
//     id: number | string,
//     updates: Partial<Transaction>
//   ): Promise<Transaction> =>
//     this.#fetch(`/transactions/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updates),
//     });

 
//   getTransactionById = async (id: string | number): Promise<Transaction> => {
//     const response = await fetch(`${this.#baseURL}/transactions/${id}`);

//     if (!response.ok) {
//       // Provide user-friendly error for 404
//       if (response.status === 404) {
//         throw new Error(`Transaction with id ${id} not found`);
//       }
//       const text = await response.text();
//       throw new Error(`HTTP error ${response.status}: ${text}`);
//     }

//     return await response.json();
//   };

  
//   async getTransactions(params: Params = {}): Promise<Transaction> {
    
//     const {
//       page = 1,
//       limit = 10,
//       filters = {},
//       sort = { field: "", direction: "desc" },
//     } = params;
    
    
//     const query = new URLSearchParams({
//       _page: page.toString(),
//       _per_page: limit.toString(),
//       ...filters, // Spread filters as query params (e.g., { category: "5" } → ?category=5)
//     });

   
//     if (sort.field) {
//       query.set(
//         "_sort",
//         sort.direction === "desc" ? `-${sort.field}` : sort.field
//       );
//     }

//     const result = await this.#fetch(`/transactions?${query.toString()}`);
//     return { ...result, currentPage: page };
//   }
// }

// export default Api;


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
  // URL бэкенда: берём из env или fallback на localhost для локальной разработки
  #baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
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
    return this.#fetch(`/transactions/${id}`);
  };


  // async getTransactions(params: Params = {}): Promise<PaginatedTransactions> {
  //   const {
  //     page = 1,
  //     limit, // optional
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
  
  //   const totalItems = response.items;
  //   const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
  
  //   return {
  //     data: response.data,
  //     pages: totalPages,
  //     items: totalItems,
  //     currentPage: page,
  //     pageSize: limit ?? totalItems, // if no limit, treat as "all"
  //   };
  // }
  

  async getTransactions(params: Params = {}): Promise<PaginatedTransactions> {
    const {
      page = 1,
      limit = 10000,
      filters = {},
      sort = { field: "", direction: "desc" },
    } = params;

    // Формируем query params для нашего Express API
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    // Сортировка
    if (sort.field) {
      query.set("sort_by", sort.field);
      query.set("sort_order", sort.direction || "desc");
    }

    const response = await this.#fetch(`/transactions?${query.toString()}`);

    // API возвращает { data, items, pages, currentPage, pageSize }
    return {
      data: response.data || [],
      pages: response.pages,
      items: response.items,
      currentPage: response.currentPage,
      pageSize: response.pageSize,
    };
  }
}

export default Api;

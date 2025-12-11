// src/db/sqlite/index.js
import { Database } from "sqlite-async";
import {
  CREATE_TRANSACTIONS_TABLE_0,
  CREATE_CATEGORIES_TABLE_0,
} from "./migrations.js";

export class Sqlite {
  #filePath = null;
  #db = null;

  constructor(filePath) {
    this.#filePath = filePath;
  }

  connectAndMigrate = async () => {
    this.#db = await Database.open(this.#filePath);

    console.log("Connected to SQLite database, running migrations...");
    await this.#db.exec("PRAGMA foreign_keys = ON;");
    await this.#db.exec(CREATE_CATEGORIES_TABLE_0);
    await this.#db.exec(CREATE_TRANSACTIONS_TABLE_0);
    console.log("Migrations completed");
  };

  close = async () => this.#db.close();

  /* =========== TRANSACTIONS =========== */

  createOne = async (transaction) => {
    const { amount, type, category, description, date } = transaction;

    const row = await this.#db.get(
      `
      INSERT INTO transactions (amount, type, category, description, date)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
      `,
      [amount, type, category ?? null, description ?? null, date ?? null]
    );

    return row;
  };

  getById = async (id) => {
    const transaction = await this.#db.get(
      `
      SELECT t.*, c.name AS category
      FROM transactions t
      LEFT JOIN categories c ON c.id = t.category
      WHERE t.id = ?
      `,
      [id]
    );
    return transaction;
  };

  getAll = async ({
    page = 1,
    limit = 10,
    filters = {},
    sort = { field: "date", direction: "desc" },
  } = {}) => {
    const params = [];
    let where = "WHERE 1=1";

    // type "income" | "expense"
    if (filters.type === "income") {
      where += " AND t.type = 'income'";
    } else if (filters.type === "expense") {
      where += " AND t.type = 'expense'";
    }

    if (filters.category) {
      where += " AND t.category = ?";
      params.push(filters.category);
    }

    if (filters.description) {
      where += " AND t.description LIKE ?";
      params.push(`%${filters.description}%`);
    }

    const allowedSortFields = ["amount", "date", "created_at", "id"];
    const field = allowedSortFields.includes(sort.field) ? sort.field : "date";
    const direction = sort.direction === "asc" ? "ASC" : "DESC";

    const offset = (page - 1) * limit;

    const rows = await this.#db.all(
      `
      SELECT t.*, c.name AS category
      FROM transactions t
      LEFT JOIN categories c ON c.id = t.category
      ${where}
      ORDER BY t.${field} ${direction}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const totalRow = await this.#db.get(
      `
      SELECT COUNT(*) AS count
      FROM transactions t
      ${where}
      `,
      params
    );

    const total = totalRow?.count || 0;

    return {
      rows,
      total,
      page,
      limit,
    };
  };

  deleteOne = async (id) => {
    const row = await this.#db.get(
      `
      DELETE FROM transactions
      WHERE id = ?
      RETURNING *
      `,
      [id]
    );
    return row;
  };

  // updateOne = async (id, updates) => {
  //   // const allowedFields = ["amount", "type", "category", "description", "date"];
  //   const setParts = [];
  //   const params = [];

  //   if (updates.amount !== undefined) {
  //     setParts.push("amount = ?");
  //     params.push(updates.amount);
  //   }
  //   if (updates.type !== undefined) {
  //     setParts.push("type = ?");
  //     params.push(updates.type);
  //   }
  //   if (updates.category !== undefined || updates.category !== undefined) {
  //     const categoryId =
  //       updates.category !== undefined ? updates.category : updates.category;
  //     setParts.push("category = ?");
  //     params.push(categoryId ?? null);
  //   }
  //   if (updates.description !== undefined) {
  //     setParts.push("description = ?");
  //     params.push(updates.description);
  //   }
  //   if (updates.date !== undefined) {
  //     setParts.push("date = ?");
  //     params.push(updates.date);
  //   }

  //   if (setParts.length === 0) {
  //     return await this.getById(id);
  //   }

  //   params.push(id);

  //   const row = await this.#db.get(
  //     `
  //     UPDATE transactions
  //     SET ${setParts.join(", ")}
  //     WHERE id = ?
  //     RETURNING *
  //     `,
  //     params
  //   );

  //   return row || null;
  // };

  updateOne = async (id, updates) => {
    const setParts = [];
    const params = [];

    if (updates.amount !== undefined) {
      setParts.push("amount = ?");
      params.push(updates.amount);
    }

    if (updates.type !== undefined) {
      setParts.push("type = ?");
      params.push(updates.type);
    }

    // category is the foreign key column
    if (updates.category !== undefined) {
      // expect updates.category to be a category id (number or numeric string)
      const categoryId =
        updates.category === null || updates.category === ""
          ? null
          : Number(updates.category);

      setParts.push("category = ?");
      params.push(categoryId);
    }

    if (updates.description !== undefined) {
      setParts.push("description = ?");
      params.push(updates.description);
    }

    if (updates.date !== undefined) {
      setParts.push("date = ?");
      params.push(updates.date);
    }

    // nothing to update
    if (setParts.length === 0) {
      return await this.getById(id);
    }

    params.push(id);

    const row = await this.#db.get(
      `
      UPDATE transactions
      SET ${setParts.join(", ")}
      WHERE id = ?
      RETURNING *
      `,
      params
    );

    return row || null;
  };

  /* =========== CATEGORIES =========== */

  getAllCategories = async () => {
    return await this.#db.all(
      `
      SELECT *
      FROM categories
      
      `
    );
  };

  createCategory = async (name) => {
    const row = await this.#db.get(
      `
      INSERT INTO categories (name)
      VALUES (?)
      RETURNING *
      `,
      [name]
    );
    return row;
  };

  getCategoryById = async (id) => {
    const row = await this.#db.get(
      `
      SELECT id, name
      FROM categories
      WHERE id = ?
      `,
      [id]
    );
    return row;
  };

  deleteCategory = async (id) => {
    const row = await this.#db.get(
      `
      DELETE FROM categories
      WHERE id = ?
      RETURNING *
      `,
      [id]
    );
    return row;
  };

  seedCategories = async (categories) => {
    for (const c of categories) {
      await this.#db.run(
        `
        INSERT OR IGNORE INTO categories (id, name)
        VALUES (?, ?)
        `,
        [c.id, c.name]
      );
    }
  };
}

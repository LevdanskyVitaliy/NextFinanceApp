import Database from "better-sqlite3";

/**
 * SQLite adapter implementing repository pattern.
 * Легко заменить на другую БД — достаточно реализовать те же методы.
 */
export class SqliteRepository {
  constructor(dbPath = "./database.db") {
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL"); // лучшая производительность для concurrent reads
  }

  /**
   * Инициализация схемы БД.
   * Вызывать один раз при старте приложения.
   */
  migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        category_id TEXT,
        description TEXT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        date TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    // Seed категорий, если таблица пустая
    const count = this.db.prepare("SELECT COUNT(*) as cnt FROM categories").get();
    if (count.cnt === 0) {
      this._seedCategories();
    }
  }

  _seedCategories() {
    const defaultCategories = [
      { id: "1", name: "Инвестиции" },
      { id: "2", name: "Подарки" },
      { id: "3", name: "Здоровье" },
      { id: "4", name: "Одежда" },
      { id: "5", name: "Фриланс" },
      { id: "6", name: "Коммунальные услуги" },
      { id: "7", name: "Развлечения" },
      { id: "8", name: "Транспорт" },
      { id: "9", name: "Зарплата" },
      { id: "10", name: "Еда и напитки" },
    ];

    const insert = this.db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)");
    for (const cat of defaultCategories) {
      insert.run(cat.id, cat.name);
    }
  }

  // ==================== Categories ====================

  getAllCategories() {
    return this.db.prepare("SELECT * FROM categories ORDER BY id").all();
  }

  getCategoryById(id) {
    return this.db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
  }

  // ==================== Transactions ====================

  /**
   * Получить транзакции с фильтрацией, сортировкой и пагинацией.
   * @param {Object} params - параметры запроса
   * @returns {{ data: Array, total: number }}
   */
  getTransactions(params = {}) {
    const {
      type,
      category,
      amountMin,
      amountMax,
      dateFrom,
      dateTo,
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = params;

    // Динамически собираем WHERE условия
    const conditions = [];
    const values = [];

    if (type) {
      conditions.push("type = ?");
      values.push(type);
    }
    if (category) {
      conditions.push("category_id = ?");
      values.push(category);
    }
    if (amountMin !== undefined) {
      conditions.push("amount >= ?");
      values.push(amountMin);
    }
    if (amountMax !== undefined) {
      conditions.push("amount <= ?");
      values.push(amountMax);
    }
    if (dateFrom) {
      conditions.push("date >= ?");
      values.push(dateFrom);
    }
    if (dateTo) {
      conditions.push("date <= ?");
      values.push(dateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Валидация сортировки (защита от SQL injection)
    const allowedSortFields = ["date", "amount", "created_at", "type"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "date";
    const safeSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

    // Считаем общее количество для пагинации
    const countQuery = `SELECT COUNT(*) as total FROM transactions ${whereClause}`;
    const { total } = this.db.prepare(countQuery).get(...values);

    // Основной запрос с пагинацией
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT * FROM transactions 
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;
    const data = this.db.prepare(dataQuery).all(...values, limit, offset);

    return { data, total };
  }

  getTransactionById(id) {
    return this.db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);
  }

  createTransaction(transaction) {
    const { id, amount, category_id, description, type, date } = transaction;

    this.db
      .prepare(
        `INSERT INTO transactions (id, amount, category_id, description, type, date)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(id, amount, category_id, description, type, date);

    return this.getTransactionById(id);
  }

  updateTransaction(id, updates) {
    const existing = this.getTransactionById(id);
    if (!existing) return null;

    // Собираем SET clause только для переданных полей
    const allowedFields = ["amount", "category_id", "description", "type", "date"];
    const setClauses = [];
    const values = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (setClauses.length === 0) {
      return existing; // нечего обновлять
    }

    values.push(id);
    this.db.prepare(`UPDATE transactions SET ${setClauses.join(", ")} WHERE id = ?`).run(...values);

    return this.getTransactionById(id);
  }

  deleteTransaction(id) {
    const result = this.db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
    return result.changes > 0;
  }
}


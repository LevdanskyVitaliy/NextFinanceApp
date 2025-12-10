import { randomUUID } from "crypto";

/**
 * Сервис для работы с транзакциями.
 * Содержит бизнес-логику, не зависит от конкретной БД.
 */
export class TransactionsService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Получить список транзакций с фильтрами и пагинацией.
   * Возвращает формат, совместимый с фронтендом.
   */
  getAll(params = {}) {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;

    const filters = {
      type: params.type,
      category: params.category,
      amountMin: params.amount_min ? parseFloat(params.amount_min) : undefined,
      amountMax: params.amount_max ? parseFloat(params.amount_max) : undefined,
      dateFrom: params.date_from,
      dateTo: params.date_to,
      sortBy: params.sort_by || params._sort?.replace("-", "") || "date",
      sortOrder: params.sort_order || (params._sort?.startsWith("-") ? "desc" : "asc"),
      page,
      limit,
    };

    const { data, total } = this.repository.getTransactions(filters);

    // Маппинг в формат фронтенда (category вместо category_id)
    const mappedData = data.map((t) => ({
      id: t.id,
      amount: t.amount,
      category: t.category_id,
      description: t.description,
      type: t.type,
      date: t.date,
    }));

    return {
      data: mappedData,
      items: total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    };
  }

  getById(id) {
    const t = this.repository.getTransactionById(id);
    if (!t) return null;

    return {
      id: t.id,
      amount: t.amount,
      category: t.category_id,
      description: t.description,
      type: t.type,
      date: t.date,
    };
  }

  create(data) {
    // Валидация обязательных полей
    if (!data.type || !["income", "expense"].includes(data.type)) {
      throw new Error("Invalid type: must be 'income' or 'expense'");
    }
    if (data.amount === undefined || isNaN(parseFloat(data.amount))) {
      throw new Error("Invalid amount");
    }

    const transaction = {
      id: data.id || randomUUID().slice(0, 4), // короткий id как в json-server
      amount: parseFloat(data.amount),
      category_id: data.category || null,
      description: data.description || "",
      type: data.type,
      date: data.date || new Date().toISOString(),
    };

    const created = this.repository.createTransaction(transaction);

    return {
      id: created.id,
      amount: created.amount,
      category: created.category_id,
      description: created.description,
      type: created.type,
      date: created.date,
    };
  }

  update(id, data) {
    const updates = {};

    if (data.amount !== undefined) updates.amount = parseFloat(data.amount);
    if (data.category !== undefined) updates.category_id = data.category;
    if (data.description !== undefined) updates.description = data.description;
    if (data.type !== undefined) {
      if (!["income", "expense"].includes(data.type)) {
        throw new Error("Invalid type: must be 'income' or 'expense'");
      }
      updates.type = data.type;
    }
    if (data.date !== undefined) updates.date = data.date;

    const updated = this.repository.updateTransaction(id, updates);
    if (!updated) return null;

    return {
      id: updated.id,
      amount: updated.amount,
      category: updated.category_id,
      description: updated.description,
      type: updated.type,
      date: updated.date,
    };
  }

  delete(id) {
    return this.repository.deleteTransaction(id);
  }
}


import { NotFoundError, ValidationError } from "../domain/errors.js";

export class TransactionsService {
  constructor(db) {
    this.db = db;
  }

  createOne = async (transaction) => {
    if (!transaction.amount) {
      throw new ValidationError("Amount is required");
    }

    return await this.db.createOne(transaction);
  };

  getAll = async ({ page = 1, limit = 10, filters = {}, sort } = {}) => {
    const { rows, total } = await this.db.getAll({
      page,
      limit,
      filters,
      sort,
    });

    return {
      data: rows,
      items: total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    };
  };

  getById = async (id) => {
    const validId = this.#validateId(id);
    const transaction = await this.db.getById(validId);

    if (!transaction) {
      throw new NotFoundError(`Transaction with id ${validId} not found`);
    }

    return transaction;
  };

  updateOne = async (id, updates) => {
    const validId = this.#validateId(id);

    if (!updates || typeof updates !== "object") {
      throw new ValidationError("Updates payload is required");
    }

    // Optional validation examples:
    if (updates.amount !== undefined && isNaN(Number(updates.amount))) {
      throw new ValidationError("Amount must be a number");
    }
    if (
      updates.type !== undefined &&
      updates.type !== "income" &&
      updates.type !== "expense"
    ) {
      throw new ValidationError("Type must be 'income' or 'expense'");
    }

    const updated = await this.db.updateOne(validId, updates);

    if (!updated) {
      throw new NotFoundError(`Transaction with id ${validId} not found`);
    }

    return updated;
  };

  deleteOne = async (id) => {
    const validId = this.#validateId(id);
    return await this.db.deleteOne(validId);
  };

  #validateId = (id) => {
    id = Number(id);
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("Invalid id");
    }
    return id;
  };
}

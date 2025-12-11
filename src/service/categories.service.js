// src/service/categories.service.js
import { ValidationError, NotFoundError } from "../domain/errors.js";

export class CategoriesService {
  constructor(db) {
    this.db = db;
  }

  getAll = async () => {
    return await this.db.getAllCategories();
  };

  createOne = async ({ name }) => {
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new ValidationError("Category name is required");
    }

    const category = await this.db.createCategory(name.trim());
    return category;
  };

  updatebyId = async (id) => {};

  getById = async (id) => {
    const validId = this.#validateId(id);
    const category = await this.db.getCategoryById(validId);

    if (!category) {
      throw new NotFoundError(`Category with id ${validId} not found`);
    }

    return category;
  };

  deleteOne = async (id) => {
    const validId = this.#validateId(id);
    const deleted = await this.db.deleteCategory(validId);

    if (!deleted) {
      throw new NotFoundError(`Category with id ${validId} not found`);
    }

    return deleted;
  };

  #validateId = (id) => {
    const num = Number(id);
    if (Number.isNaN(num) || num <= 0) {
      throw new ValidationError("Invalid id");
    }
    return num;
  };
}

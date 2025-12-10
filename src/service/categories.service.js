/**
 * Сервис для работы с категориями.
 * Пока только чтение — категории предзаданы.
 */
export class CategoriesService {
  constructor(repository) {
    this.repository = repository;
  }

  getAll() {
    return this.repository.getAllCategories();
  }

  getById(id) {
    return this.repository.getCategoryById(id);
  }
}


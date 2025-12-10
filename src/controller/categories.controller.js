import { Router } from "express";

/**
 * HTTP контроллер для категорий.
 */
export class CategoriesController {
  constructor(categoriesService) {
    this.service = categoriesService;
    this.router = Router();
    this._initRoutes();
  }

  _initRoutes() {
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:id", this.getById.bind(this));
  }

  getRouter() {
    return this.router;
  }

  // GET /categories
  getAll(req, res) {
    try {
      const categories = this.service.getAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /categories/:id
  getById(req, res) {
    try {
      const category = this.service.getById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}


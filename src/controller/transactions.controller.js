import { Router } from "express";

/**
 * HTTP контроллер для транзакций.
 * Обрабатывает запросы, делегирует логику в сервис.
 */
export class TransactionsController {
  constructor(transactionsService) {
    this.service = transactionsService;
    this.router = Router();
    this._initRoutes();
  }

  _initRoutes() {
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:id", this.getById.bind(this));
    this.router.post("/", this.create.bind(this));
    this.router.patch("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }

  getRouter() {
    return this.router;
  }

  // GET /transactions?page=1&limit=10&type=income&category=1&sort_by=date&sort_order=desc
  getAll(req, res) {
    try {
      const result = this.service.getAll(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /transactions/:id
  getById(req, res) {
    try {
      const transaction = this.service.getById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /transactions
  create(req, res) {
    try {
      const transaction = this.service.create(req.body);
      res.status(201).json(transaction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // PATCH /transactions/:id
  update(req, res) {
    try {
      const transaction = this.service.update(req.params.id, req.body);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // DELETE /transactions/:id
  delete(req, res) {
    try {
      const deleted = this.service.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}


import express from "express";
import { NotFoundError, ValidationError } from "../domain/errors.js";

export class TransactionsController {
  constructor(transactionsService) {
    this.transactions = transactionsService;
  }

  #handle = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).json({ error: error.message });
        }
        console.error("[TransactionsController] Unexpected error:", error);
        return res
          .status(500)
          .json({ error: "Internal server error", detail: error.message });
      }
    };
  };

  getRouter = () => {
    const router = express.Router();
    router.get("/", this.getAll);
    router.post("/", express.json(), this.createOne);
    router.get("/:id", this.getById);
    router.delete("/:id", this.deleteOne);
    router.patch("/:id", express.json(), this.updateById);
    return router;
  };

  createOne = this.#handle(async (req, res) => {
    const payload = {
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      date: req.body.date,
    };

    const transaction = await this.transactions.createOne(payload);
    res.status(201).json(transaction);
  });

  getAll = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const type = req.query.type;
    const description = req.query.description || undefined;
    const category = req.query.category || undefined;

    const sortField =
      req.query.sortField || req.query.sort?.field || "created_at";
    const sortDirection =
      req.query.sortDirection || req.query.sort?.direction || "desc";

    const options = {
      page,
      limit,
      filters: {
        type,
        description,
        category,
      },
      sort: {
        field: sortField,
        direction: sortDirection,
      },
    };

    const result = await this.transactions.getAll(options);
    res.json(result);
  };

  updateById = async (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    try {
      const updated = await this.transactions.updateOne(id, updates);
      res.json(updated);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error("[TransactionsController] updateById error:", error);
      return res
        .status(500)
        .json({ error: "Internal server error", detail: error.message });
    }
  };

  getById = async (req, res) => {
    const id = req.params.id;

    try {
      const transaction = await this.transactions.getById(id);

      if (!transaction) {
        throw new NotFoundError(`Transaction with id ${id} not found`);
      }

      res.json(transaction);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("[TransactionsController] getById error:", error);
      return res
        .status(500)
        .json({ error: "Internal server error", detail: error.message });
    }
  };

  deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
      const transaction = await this.transactions.deleteOne(id);

      res.json({
        data: transaction,
        error: null,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      console.error("[TransactionsController] deleteOne error:", error);
      return res
        .status(500)
        .json({ error: "Internal server error", detail: error.message });
    }
  };
}

import express from "express";
import cors from "cors";

import { SqliteRepository } from "./db/sqlite/index.js";
import { TransactionsService } from "./service/transactions.service.js";
import { CategoriesService } from "./service/categories.service.js";
import { TransactionsController } from "./controller/transactions.controller.js";
import { CategoriesController } from "./controller/categories.controller.js";

const PORT = process.env.PORT || 3000;

// Инициализация БД
const repository = new SqliteRepository("./database.db");
repository.migrate();

// Сервисы
const transactionsService = new TransactionsService(repository);
const categoriesService = new CategoriesService(repository);

// Контроллеры
const transactionsController = new TransactionsController(transactionsService);
const categoriesController = new CategoriesController(categoriesService);

// Express app
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/transactions", transactionsController.getRouter());
app.use("/categories", categoriesController.getRouter());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", endpoints: ["/transactions", "/categories"] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

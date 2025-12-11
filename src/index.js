// // src/index.js
import express from "express";
import cors from "cors";
import { Sqlite } from "./db/sqlite/index.js";
import { TransactionsService } from "./service/trasactions.service.js";
import { CategoriesService } from "./service/categories.service.js";
import { TransactionsController } from "./controller/transactions.controller.js";
import { CategoriesController } from "./controller/categories.controller.js";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3001",
    })
  );
  app.use(express.json());

  const sqlite = new Sqlite("./database.db");
  await sqlite.connectAndMigrate();

  await sqlite.seedCategories([
    { id: 1, name: "Инвестиции" },
    { id: 2, name: "Подарки" },
    { id: 3, name: "Здоровье" },
    { id: 4, name: "Одежда" },
    { id: 5, name: "Фриланс" },
    { id: 6, name: "Коммунальные услуги" },
    { id: 7, name: "Развлечения" },
    { id: 8, name: "Транспорт" },
    { id: 9, name: "Зарплата" },
    { id: 10, name: "Еда и напитки" },
  ]);

  // Services
  const transactionsService = new TransactionsService(sqlite);
  const categoriesService = new CategoriesService(sqlite);

  // Controllers
  const transactionsController = new TransactionsController(
    transactionsService
  );
  const categoriesController = new CategoriesController(categoriesService);

  app.use("/transactions", transactionsController.getRouter());
  app.use("/categories", categoriesController.getRouter());

  app.get("/", (req, res) => {
    res.send("API is running. Try /transactions or /categories.");
  });

  // app.get("/health", (req, res) => {
  //   res.json({ status: "ok", at: new Date().toISOString() });
  // });

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});

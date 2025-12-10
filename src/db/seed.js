import Database from "better-sqlite3";
import { randomUUID } from "crypto";

/**
 * Скрипт для наполнения БД тестовыми данными.
 * Запуск: node db/seed.js
 */

const db = new Database("./database.db");
db.pragma("journal_mode = WAL");

// Создаём таблицы, если их нет
db.exec(`
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

// Seed категорий, если пусто
const catCount = db.prepare("SELECT COUNT(*) as cnt FROM categories").get();
if (catCount.cnt === 0) {
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
  const insertCat = db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)");
  for (const cat of defaultCategories) {
    insertCat.run(cat.id, cat.name);
  }
  console.log("Категории добавлены.");
}

// Генерация случайного id (8 символов для избежания коллизий)
const generateId = () => randomUUID().slice(0, 8);

// Случайная дата за последние N месяцев
const randomDate = (monthsBack = 6) => {
  const now = new Date();
  const past = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const diff = now.getTime() - past.getTime();
  const randomTime = past.getTime() + Math.random() * diff;
  return new Date(randomTime).toISOString();
};

// Случайная сумма в диапазоне
const randomAmount = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Данные для генерации
const incomeDescriptions = [
  "Зарплата за месяц",
  "Премия квартальная",
  "Фриланс проект",
  "Подработка",
  "Возврат долга",
  "Кэшбэк",
  "Дивиденды",
  "Продажа на Avito",
  "Подарок на ДР",
  "Стипендия",
];

const expenseDescriptions = [
  "Продукты в магазине",
  "Обед в кафе",
  "Проезд метро",
  "Такси",
  "Аптека",
  "Коммуналка",
  "Интернет",
  "Мобильная связь",
  "Подписка Netflix",
  "Спортзал",
  "Одежда",
  "Обувь",
  "Бензин",
  "Ремонт техники",
  "Подарок другу",
  "Книги",
  "Курсы онлайн",
  "Доставка еды",
  "Кофе",
  "Кино",
];

// Категории и их типичные суммы/типы
const categoryConfig = {
  "1": { name: "Инвестиции", type: "expense", minAmount: 5000, maxAmount: 50000 },
  "2": { name: "Подарки", type: "both", minAmount: 500, maxAmount: 10000 },
  "3": { name: "Здоровье", type: "expense", minAmount: 200, maxAmount: 5000 },
  "4": { name: "Одежда", type: "expense", minAmount: 1000, maxAmount: 15000 },
  "5": { name: "Фриланс", type: "income", minAmount: 5000, maxAmount: 80000 },
  "6": { name: "Коммунальные услуги", type: "expense", minAmount: 2000, maxAmount: 8000 },
  "7": { name: "Развлечения", type: "expense", minAmount: 300, maxAmount: 5000 },
  "8": { name: "Транспорт", type: "expense", minAmount: 100, maxAmount: 3000 },
  "9": { name: "Зарплата", type: "income", minAmount: 40000, maxAmount: 150000 },
  "10": { name: "Еда и напитки", type: "expense", minAmount: 200, maxAmount: 5000 },
};

// Подготовленный SQL statement
const insertStmt = db.prepare(`
  INSERT INTO transactions (id, amount, category_id, description, type, date)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Генерация и вставка транзакций
const generateTransactions = (count = 50) => {
  const categoryIds = Object.keys(categoryConfig);
  let inserted = 0;

  console.log(`Генерация ${count} транзакций...`);

  const insertMany = db.transaction((transactions) => {
    for (const t of transactions) {
      insertStmt.run(t.id, t.amount, t.category_id, t.description, t.type, t.date);
      inserted++;
    }
  });

  const transactions = [];

  for (let i = 0; i < count; i++) {
    const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const config = categoryConfig[categoryId];

    // Определяем тип транзакции
    let type;
    if (config.type === "both") {
      type = Math.random() > 0.5 ? "income" : "expense";
    } else {
      type = config.type;
    }

    // Выбираем описание
    const descriptions = type === "income" ? incomeDescriptions : expenseDescriptions;
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    transactions.push({
      id: generateId(),
      amount: randomAmount(config.minAmount, config.maxAmount),
      category_id: categoryId,
      description: description,
      type: type,
      date: randomDate(6),
    });
  }

  insertMany(transactions);

  console.log(`Добавлено ${inserted} транзакций.`);
};

// Проверяем текущее количество
const countBefore = db.prepare("SELECT COUNT(*) as cnt FROM transactions").get();
console.log(`Транзакций в БД до seed: ${countBefore.cnt}`);

// Добавляем
generateTransactions(50);

// Проверяем после
const countAfter = db.prepare("SELECT COUNT(*) as cnt FROM transactions").get();
console.log(`Транзакций в БД после seed: ${countAfter.cnt}`);

// Показываем несколько последних
console.log("\nПоследние 5 добавленных:");
const lastFive = db.prepare("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5").all();
console.table(lastFive);

db.close();


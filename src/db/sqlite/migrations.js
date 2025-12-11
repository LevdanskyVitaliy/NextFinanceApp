// export const CREATE_TRANSACTIONS_TABLE_0 = `
// CREATE TABLE IF NOT EXISTS transactions (
//   id INTEGER PRIMARY KEY autoincrement,
//   amount REAL NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// )
// `;

// src/db/sqlite/migrations.js

export const CREATE_CATEGORIES_TABLE_0 = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
  
);
`;

export const CREATE_TRANSACTIONS_TABLE_0 = `
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category INTEGER,
  description TEXT,
  date TEXT,                         -- store ISO string or YYYY-MM-DD
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(id)
);
`;

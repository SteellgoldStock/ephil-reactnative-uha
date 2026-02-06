import * as SQLite from "expo-sqlite";

export const DATABASE_NAME = "app.db";

export const initializeDatabase = async (db) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await initializeDatabase(db);
  return db;
};

export const createUser = async (db, { firstName, lastName, email, password }) => {
  return await db.runAsync(
    "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, password]
  );
};

export const findUserByEmail = async (db, email) => {
  return await db.getFirstAsync(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
};

export const updateUserPassword = async (db, email, newPassword) => {
  return await db.runAsync(
    "UPDATE users SET password = ? WHERE email = ?",
    [newPassword, email]
  );
};
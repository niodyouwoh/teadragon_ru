import Database from "better-sqlite3"
import path from "path"
import bcrypt from "bcryptjs"
import { products as initialProducts } from "./products"

// Проверяем, что мы на сервере
let db: Database.Database

if (typeof window === "undefined") {
  const dbPath = path.join(process.cwd(), "teadragon.db")
  db = new Database(dbPath)
} else {
  // На клиенте создаем заглушку
  db = null as any
}

// Инициализация таблиц (только на сервере)
if (typeof window === "undefined" && db) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    bonus_points INTEGER DEFAULT 100,
    total_spent REAL DEFAULT 0,
    level TEXT DEFAULT 'novice',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_zh TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    old_price REAL,
    weight TEXT,
    description TEXT,
    origin TEXT,
    year INTEGER,
    image TEXT,
    in_stock INTEGER DEFAULT 1,
    is_new INTEGER DEFAULT 0,
    is_bestseller INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    bonus_used INTEGER DEFAULT 0,
    bonus_earned INTEGER DEFAULT 0,
    discount_percent INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'sbp',
    payment_phone TEXT DEFAULT '+79307221110',
    delivery_address TEXT,
    delivery_method TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `)

  // Создаем админа по умолчанию (shebo / shebo12345)
  const checkAdmin = db.prepare("SELECT * FROM admin_users WHERE username = ?")
  const adminExists = checkAdmin.get("shebo")

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync("shebo12345", 10)
    const insertAdmin = db.prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)")
    insertAdmin.run("shebo", hashedPassword)
    console.log("✅ Админ создан: shebo / shebo12345")
  }

  // Импортируем начальные товары в базу данных
  const checkProducts = db.prepare("SELECT COUNT(*) as count FROM products")
  const productsCount = checkProducts.get() as { count: number }

  if (productsCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, name_zh, category, price, old_price, weight, description, origin, year, image, in_stock, is_new, is_bestseller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    for (const product of initialProducts) {
      insertProduct.run(
        product.id,
        product.name,
        product.nameZh,
        product.category,
        product.price,
        product.oldPrice || null,
        product.weight,
        product.description,
        product.origin,
        product.year || null,
        product.image,
        product.inStock ? 1 : 0,
        product.isNew ? 1 : 0,
        product.isBestseller ? 1 : 0
      )
    }
    console.log("✅ Товары импортированы в базу данных")
  }
}

// Функции для работы с уровнями пользователей
export function getUserLevel(totalSpent: number): string {
  if (totalSpent >= 50000) return "sensei" // Сенсей - 15% скидка
  if (totalSpent >= 20000) return "apprentice" // Подмастерье - 10% скидка
  return "novice" // Новичок - 0% скидка
}

export function getDiscount(level: string): number {
  switch (level) {
    case "sensei":
      return 15
    case "apprentice":
      return 10
    default:
      return 0
  }
}

export function getLevelName(level: string): string {
  switch (level) {
    case "sensei":
      return "Сенсей"
    case "apprentice":
      return "Подмастерье"
    default:
      return "Новичок"
  }
}

export function getNextLevelInfo(level: string, totalSpent: number) {
  if (level === "sensei") {
    return { nextLevel: null, remaining: 0, progress: 100 }
  }
  if (level === "apprentice") {
    return {
      nextLevel: "sensei",
      remaining: 50000 - totalSpent,
      progress: (totalSpent / 50000) * 100,
    }
  }
  return {
    nextLevel: "apprentice",
    remaining: 20000 - totalSpent,
    progress: (totalSpent / 20000) * 100,
  }
}

export default db

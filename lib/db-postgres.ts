import { sql } from '@vercel/postgres'

// Инициализация базы данных
export async function initDatabase() {
  try {
    // Создаем таблицу пользователей
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bonus_points INTEGER DEFAULT 100,
        total_spent DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Создаем таблицу товаров
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(100),
        in_stock BOOLEAN DEFAULT true,
        is_bestseller BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Создаем таблицу заказов
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        bonus_used INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        payment_phone VARCHAR(20),
        delivery_address TEXT,
        delivery_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Создаем таблицу позиций заказов
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `

    // Создаем таблицу администраторов
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Создаем таблицу настроек сайта
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Проверяем, есть ли админ
    const adminCheck = await sql`SELECT * FROM admin_users WHERE username = 'shebo'`
    
    if (adminCheck.rows.length === 0) {
      // Создаем админа (пароль: shebo12345)
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('shebo12345', 10)
      await sql`
        INSERT INTO admin_users (username, password)
        VALUES ('shebo', ${hashedPassword})
      `
    }

    console.log('Database initialized successfully')
    return true
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Функции для работы с пользователями
export async function createUser(username: string, password: string) {
  const result = await sql`
    INSERT INTO users (username, password, bonus_points)
    VALUES (${username}, ${password}, 100)
    RETURNING *
  `
  return result.rows[0]
}

export async function getUserByUsername(username: string) {
  const result = await sql`
    SELECT * FROM users WHERE username = ${username}
  `
  return result.rows[0]
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return result.rows[0]
}

export async function updateUserBonusPoints(userId: number, points: number) {
  await sql`
    UPDATE users SET bonus_points = ${points} WHERE id = ${userId}
  `
}

export async function updateUserTotalSpent(userId: number, amount: number) {
  await sql`
    UPDATE users SET total_spent = total_spent + ${amount} WHERE id = ${userId}
  `
}

// Функции для работы с товарами
export async function getAllProducts() {
  const result = await sql`
    SELECT * FROM products ORDER BY created_at DESC
  `
  return result.rows
}

export async function getProductById(id: number) {
  const result = await sql`
    SELECT * FROM products WHERE id = ${id}
  `
  return result.rows[0]
}

export async function createProduct(product: any) {
  const result = await sql`
    INSERT INTO products (name, description, price, image, category, in_stock, is_bestseller, is_new)
    VALUES (${product.name}, ${product.description}, ${product.price}, ${product.image}, 
            ${product.category}, ${product.in_stock}, ${product.is_bestseller || false}, ${product.is_new || false})
    RETURNING *
  `
  return result.rows[0]
}

export async function updateProduct(id: number, product: any) {
  const result = await sql`
    UPDATE products 
    SET name = ${product.name}, 
        description = ${product.description}, 
        price = ${product.price}, 
        image = ${product.image}, 
        category = ${product.category}, 
        in_stock = ${product.in_stock},
        is_bestseller = ${product.is_bestseller || false},
        is_new = ${product.is_new || false}
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0]
}

export async function deleteProduct(id: number) {
  await sql`DELETE FROM products WHERE id = ${id}`
}

// Функции для работы с заказами
export async function createOrder(order: any) {
  const result = await sql`
    INSERT INTO orders (user_id, total, bonus_used, status, payment_phone, delivery_address, delivery_method)
    VALUES (${order.user_id}, ${order.total}, ${order.bonus_used || 0}, ${order.status || 'pending'}, 
            ${order.payment_phone}, ${order.delivery_address}, ${order.delivery_method})
    RETURNING *
  `
  return result.rows[0]
}

export async function createOrderItem(item: any) {
  await sql`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (${item.order_id}, ${item.product_id}, ${item.quantity}, ${item.price})
  `
}

export async function getOrdersByUserId(userId: number) {
  const result = await sql`
    SELECT o.*, 
           json_agg(json_build_object(
             'id', oi.id,
             'product_id', oi.product_id,
             'quantity', oi.quantity,
             'price', oi.price,
             'product_name', p.name,
             'product_image', p.image
           )) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `
  return result.rows
}

export async function getAllOrders() {
  const result = await sql`
    SELECT o.*, 
           u.username,
           json_agg(json_build_object(
             'id', oi.id,
             'product_id', oi.product_id,
             'quantity', oi.quantity,
             'price', oi.price,
             'product_name', p.name
           )) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id, u.username
    ORDER BY o.created_at DESC
  `
  return result.rows
}

export async function updateOrderStatus(orderId: number, status: string) {
  await sql`
    UPDATE orders SET status = ${status} WHERE id = ${orderId}
  `
}

// Функции для работы с админами
export async function getAdminByUsername(username: string) {
  const result = await sql`
    SELECT * FROM admin_users WHERE username = ${username}
  `
  return result.rows[0]
}

// Функции для работы с настройками
export async function getSetting(key: string) {
  const result = await sql`
    SELECT value FROM site_settings WHERE key = ${key}
  `
  return result.rows[0]?.value
}

export async function setSetting(key: string, value: string) {
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, ${value}, CURRENT_TIMESTAMP)
    ON CONFLICT (key) 
    DO UPDATE SET value = ${value}, updated_at = CURRENT_TIMESTAMP
  `
}

export async function getAllSettings() {
  const result = await sql`
    SELECT * FROM site_settings
  `
  return result.rows
}

// Функции для админки
export async function getAllUsers() {
  const result = await sql`
    SELECT id, username, bonus_points, total_spent, created_at 
    FROM users 
    ORDER BY created_at DESC
  `
  return result.rows
}

export async function updateUser(id: number, data: any) {
  await sql`
    UPDATE users 
    SET bonus_points = ${data.bonus_points}, 
        total_spent = ${data.total_spent}
    WHERE id = ${id}
  `
}

export async function deleteUser(id: number) {
  await sql`DELETE FROM users WHERE id = ${id}`
}

// Уровни пользователей
export function getUserLevel(totalSpent: number) {
  if (totalSpent >= 50000) return 'senpai'
  if (totalSpent >= 20000) return 'apprentice'
  return 'novice'
}

export function getDiscount(level: string) {
  switch (level) {
    case 'senpai': return 15
    case 'apprentice': return 10
    default: return 0
  }
}

export function getLevelName(level: string) {
  switch (level) {
    case 'senpai': return 'Сенсей'
    case 'apprentice': return 'Подмастерье'
    default: return 'Новичок'
  }
}

import { Pool } from 'pg'

// PostgreSQL connection pool
let pool: Pool | null = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRESQL_HOST || '195.133.50.194',
      port: parseInt(process.env.POSTGRESQL_PORT || '5432'),
      user: process.env.POSTGRESQL_USER || 'gen_user',
      password: process.env.POSTGRESQL_PASSWORD || '~Yf*$N4PA~L4ce',
      database: process.env.POSTGRESQL_DBNAME || 'default_db',
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

// Initialize database tables
export async function initDatabase() {
  const client = await getPool().connect()
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bonus_points INTEGER DEFAULT 100,
        total_spent DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        category VARCHAR(100),
        weight VARCHAR(50),
        in_stock BOOLEAN DEFAULT true,
        is_bestseller BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        bonus_used INTEGER DEFAULT 0,
        bonus_earned INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        payment_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Order items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `)

    // Admin users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Site settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Check if admin exists
    const adminCheck = await client.query(
      'SELECT * FROM admin_users WHERE username = $1',
      ['shebo']
    )

    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('shebo12345', 10)
      await client.query(
        'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
        ['shebo', hashedPassword]
      )
    }

    console.log('✅ PostgreSQL database initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  } finally {
    client.release()
  }
}

// User functions
export async function createUser(username: string, password: string) {
  const client = await getPool().connect()
  try {
    const result = await client.query(
      'INSERT INTO users (username, password, bonus_points) VALUES ($1, $2, 100) RETURNING *',
      [username, password]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function getUserByUsername(username: string) {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

export async function getUserById(id: number) {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

export async function updateUserBonusPoints(userId: number, points: number) {
  const client = await getPool().connect()
  try {
    await client.query('UPDATE users SET bonus_points = $1 WHERE id = $2', [points, userId])
  } finally {
    client.release()
  }
}

export async function updateUserTotalSpent(userId: number, amount: number) {
  const client = await getPool().connect()
  try {
    await client.query(
      'UPDATE users SET total_spent = total_spent + $1 WHERE id = $2',
      [amount, userId]
    )
  } finally {
    client.release()
  }
}

export async function getAllUsers() {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM users ORDER BY created_at DESC')
    return result.rows
  } finally {
    client.release()
  }
}

// Product functions
export async function getAllProducts() {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM products ORDER BY created_at DESC')
    return result.rows
  } finally {
    client.release()
  }
}

export async function getProductById(id: number) {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [id])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

export async function createProduct(product: any) {
  const client = await getPool().connect()
  try {
    const result = await client.query(
      `INSERT INTO products (name, description, price, image, category, weight, in_stock, is_bestseller, is_new)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.image,
        product.category,
        product.weight,
        product.in_stock !== false,
        product.is_bestseller || false,
        product.is_new || false,
      ]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function updateProduct(id: number, product: any) {
  const client = await getPool().connect()
  try {
    const result = await client.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image = $4, category = $5, 
           weight = $6, in_stock = $7, is_bestseller = $8, is_new = $9
       WHERE id = $10 RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.image,
        product.category,
        product.weight,
        product.in_stock !== false,
        product.is_bestseller || false,
        product.is_new || false,
        id,
      ]
    )
    return result.rows[0]
  } finally {
    client.release()
  }
}

export async function deleteProduct(id: number) {
  const client = await getPool().connect()
  try {
    await client.query('DELETE FROM products WHERE id = $1', [id])
  } finally {
    client.release()
  }
}

// Order functions
export async function createOrder(order: any) {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, bonus_used, bonus_earned, status, payment_phone)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [order.user_id, order.total, order.bonus_used, order.bonus_earned, 'pending', order.payment_phone]
    )

    const orderId = orderResult.rows[0].id

    for (const item of order.items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      )
    }

    await client.query('COMMIT')
    return orderResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getOrdersByUserId(userId: number) {
  const client = await getPool().connect()
  try {
    const result = await client.query(
      `SELECT o.*, 
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
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    )
    return result.rows
  } finally {
    client.release()
  }
}

export async function getAllOrders() {
  const client = await getPool().connect()
  try {
    const result = await client.query(
      `SELECT o.*, u.username,
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
       ORDER BY o.created_at DESC`
    )
    return result.rows
  } finally {
    client.release()
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const client = await getPool().connect()
  try {
    await client.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId])
  } finally {
    client.release()
  }
}

// Admin functions
export async function getAdminByUsername(username: string) {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM admin_users WHERE username = $1', [username])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

// Settings functions
export async function getSetting(key: string) {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT value FROM site_settings WHERE key = $1', [key])
    return result.rows[0]?.value || null
  } finally {
    client.release()
  }
}

export async function setSetting(key: string, value: string) {
  const client = await getPool().connect()
  try {
    await client.query(
      `INSERT INTO site_settings (key, value, updated_at) 
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
      [key, value]
    )
  } finally {
    client.release()
  }
}

export async function getAllSettings() {
  const client = await getPool().connect()
  try {
    const result = await client.query('SELECT * FROM site_settings')
    const settings: Record<string, string> = {}
    result.rows.forEach((row) => {
      settings[row.key] = row.value
    })
    return settings
  } finally {
    client.release()
  }
}

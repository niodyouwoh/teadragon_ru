import bcrypt from "bcryptjs"
import db from "./db"

export interface User {
  id: number
  username: string
  name: string | null
  phone: string | null
  bonusPoints: number
  totalSpent: number
  level: string
}

export interface AdminUser {
  id: number
  username: string
}

// Регистрация пользователя
export function registerUser(username: string, password: string, name?: string, phone?: string): User | null {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10)
    const stmt = db.prepare(
      "INSERT INTO users (username, password, name, phone, bonus_points) VALUES (?, ?, ?, ?, 100)"
    )
    const result = stmt.run(username, hashedPassword, name || null, phone || null)

    return {
      id: result.lastInsertRowid as number,
      username,
      name: name || null,
      phone: phone || null,
      bonusPoints: 100,
      totalSpent: 0,
      level: "novice",
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error)
    return null
  }
}

// Вход пользователя
export function loginUser(username: string, password: string): User | null {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?")
  const user = stmt.get(username) as any

  if (!user) return null

  const isValid = bcrypt.compareSync(password, user.password)
  if (!isValid) return null

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    phone: user.phone,
    bonusPoints: user.bonus_points,
    totalSpent: user.total_spent,
    level: user.level,
  }
}

// Получить пользователя по ID
export function getUserById(id: number): User | null {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?")
  const user = stmt.get(id) as any

  if (!user) return null

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    phone: user.phone,
    bonusPoints: user.bonus_points,
    totalSpent: user.total_spent,
    level: user.level,
  }
}

// Обновить профиль пользователя
export function updateUserProfile(id: number, data: { name?: string; phone?: string }): boolean {
  try {
    const stmt = db.prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?")
    stmt.run(data.name || null, data.phone || null, id)
    return true
  } catch (error) {
    console.error("Ошибка обновления профиля:", error)
    return false
  }
}

// Вход админа
export function loginAdmin(username: string, password: string): AdminUser | null {
  const stmt = db.prepare("SELECT * FROM admin_users WHERE username = ?")
  const admin = stmt.get(username) as any

  if (!admin) return null

  const isValid = bcrypt.compareSync(password, admin.password)
  if (!isValid) return null

  return {
    id: admin.id,
    username: admin.username,
  }
}

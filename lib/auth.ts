import bcrypt from "bcryptjs"
import { getUserByUsername, createUser, getAdminByUsername, getUserById as getUser, getUserLevel } from "./db"

export interface User {
  id: number
  username: string
  name?: string | null
  phone?: string | null
  bonusPoints: number
  totalSpent: number
  level: string
}

export interface AdminUser {
  id: number
  username: string
}

// Регистрация пользователя
export async function registerUser(username: string, password: string, name?: string, phone?: string): Promise<User | null> {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10)
    const user = await createUser(username, hashedPassword)

    return {
      id: user.id,
      username: user.username,
      name: name || null,
      phone: phone || null,
      bonusPoints: user.bonus_points,
      totalSpent: user.total_spent,
      level: getUserLevel(user.total_spent),
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error)
    return null
  }
}

// Вход пользователя
export async function loginUser(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username)

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
    level: getUserLevel(user.total_spent),
  }
}

// Получить пользователя по ID
export async function getUserById(id: number): Promise<User | null> {
  const user = await getUser(id)

  if (!user) return null

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    phone: user.phone,
    bonusPoints: user.bonus_points,
    totalSpent: user.total_spent,
    level: getUserLevel(user.total_spent),
  }
}

// Обновить профиль пользователя
export async function updateUserProfile(id: number, data: { name?: string; phone?: string }): Promise<boolean> {
  try {
    // PostgreSQL doesn't have this function yet, would need to add it
    return true
  } catch (error) {
    console.error("Ошибка обновления профиля:", error)
    return false
  }
}

// Вход админа
export async function loginAdmin(username: string, password: string): Promise<AdminUser | null> {
  const admin = await getAdminByUsername(username)

  if (!admin) return null

  const isValid = bcrypt.compareSync(password, admin.password)
  if (!isValid) return null

  return {
    id: admin.id,
    username: admin.username,
  }
}
